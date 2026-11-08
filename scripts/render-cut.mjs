#!/usr/bin/env node
// Draws an incident's key shots and its share image from its cutscene, for the incident page.
// Usage: node scripts/render-cut.mjs <incident id> [--base http://127.0.0.1:8787]
// Needs the site served (npm run build && npm run preview) and Playwright (npm i --no-save playwright).
// Writes incidents/<id>/cut/still-NN-<shot id>.webp (1280 wide), poster.webp and poster-tall.webp (the opening hook in
// each frame, for the homepage's play button) and incidents/<id>/share.png (1200 x 630). Every image gets the
// git.wtf wordmark (scripts/wordmark.mjs).
// Key shots: those marked "still": true in the shot list, else every shot with a line or an impact word, and the end.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { withWordmark } from './wordmark.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const id = process.argv[2];
const bi = process.argv.indexOf('--base');
const base = (bi > 0 ? process.argv[bi + 1] : 'http://127.0.0.1:8787').replace(/\/$/, '');
if (!id) { console.error('usage: node scripts/render-cut.mjs <incident id> [--base URL]'); process.exit(1); }
const listFile = path.join(root, 'src/anime/shots', `${id}.json`);
if (!existsSync(listFile)) { console.error(`no shot list at ${listFile}`); process.exit(1); }
const list = JSON.parse(readFileSync(listFile, 'utf8'));
let chromium;
// PLAYWRIGHT_MODULE: a path to a Playwright install elsewhere, when the repo has none
try { ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')); } catch { console.error('Playwright is needed: npm i --no-save playwright && npx playwright install chromium'); process.exit(1); }

const marked = list.shots.map((s, k) => (s.still ? k : -1)).filter((k) => k >= 0);
const keys = marked.length ? marked : list.shots.map((s, k) => (s.line || s.word || k === list.shots.length - 1 ? k : -1)).filter((k) => k >= 0).slice(0, 7);
const out = path.join(root, 'incidents', id, 'cut');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const shoot = async (w, h, ks, save) => {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto(`${base}/incident/${id}/cut/?render&frame=${w < h ? '9:16' : '16:9'}`, { waitUntil: 'load' });
    await page.evaluate(async () => { await window.__cut.ready; });
    await page.evaluate(() => { window.__cut.master.pause(); });
    const plan = await page.evaluate(() => window.__cut.plan);
    for (const k of ks) {
        // the shot settled: just before it hands over to the next
        const at = list.shots[k].stillAt;
        await page.evaluate((t) => { window.__cut.frameAt(t); }, plan[k].start + (typeof at === 'number' ? Math.min(at, plan[k].length - 0.05) : plan[k].length - 0.25));
        await page.waitForTimeout(60);
        const png = await page.locator('#cutscene svg.cutscene').screenshot({ animations: 'disabled', timeout: 15000 });
        await save(k, png);
    }
    await page.close();
};
await shoot(1600, 900, keys, async (k, png) => {
    const name = `still-${String(k + 1).padStart(2, '0')}-${list.shots[k].id}.webp`;
    await (await withWordmark(png, 1280, 720)).webp({ quality: 82 }).toFile(path.join(out, name));
    console.log('still', name);
});
// the posters: the opening (the hook), in each frame
await shoot(1600, 900, [0], async (_, png) => { await (await withWordmark(png, 1280, 720)).webp({ quality: 82 }).toFile(path.join(out, 'poster.webp')); console.log('poster'); });
await shoot(900, 1600, [0], async (_, png) => { await (await withWordmark(png, 720, 1280)).webp({ quality: 82 }).toFile(path.join(out, 'poster-tall.webp')); console.log('poster-tall'); });
// the share image: Video's story image when the cut has one (cut/story.webp, placed as share.png by hand), else the
// shot with the stamp (or the last), stamp down, framed for 1200 x 630
if (existsSync(path.join(out, 'story.webp'))) { console.log('share: kept (the story image is the share image)'); await browser.close(); process.exit(0); }
const stampShot = list.shots.findLastIndex((s) => (s.fx ?? []).some((f) => /^(stamp|endcard)(@|$)/.test(f)));
await shoot(1200, 630, [stampShot >= 0 ? stampShot : list.shots.length - 1], async (_, png) => {
    await (await withWordmark(png, 1200, 630)).png().toFile(path.join(root, 'incidents', id, 'share.png'));
    console.log('share incidents/' + id + '/share.png');
});
await browser.close();
