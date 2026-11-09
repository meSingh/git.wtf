// Scrolls the homepage with real wheel events, a frame every 100 px, and reports what is painted.
// Needs Playwright, which is not a dependency of the site: `npm i --no-save playwright && npx playwright install chromium`.
// Usage: node scripts/scroll-strip.mjs http://127.0.0.1:8787/ 1440 900 out/frames-1440 2500
// Then: ffmpeg -i out/frames-1440/f%02d.png -vf "scale=360:-1,tile=13x2:padding=4:color=0x333333" -frames:v 1 strip.png
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const [,, url = 'http://127.0.0.1:8788/', w = '1440', h = '900', out = 'frames-1440', maxY = '2500'] = process.argv;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const log = [];
for (let i = 0; i * 100 <= +maxY; i++) {
    if (i > 0) { await page.mouse.wheel(0, 100); await page.waitForTimeout(220); }
    const info = await page.evaluate(() => {
        const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); const c = getComputedStyle(e); return { top: Math.round(b.top), h: Math.round(b.height), op: c.opacity, vis: c.visibility, pos: c.position, z: c.zIndex }; };
        return { y: scrollY, bar: r('.bar'), hero: r('#hero'), sign: r('#sign'), today: r('#today'), term: r('#today .term'), vis: document.querySelectorAll('#today .ch:not(.hid)').length, docked: document.body.classList.contains('docked') };
    });
    const file = `${out}/f${String(i).padStart(2, '0')}.png`;
    await page.screenshot({ path: file });
    log.push({ i, ...info });
}
writeFileSync(`${out}/log.json`, JSON.stringify(log, null, 1));
for (const l of log) console.log(`${String(l.y).padStart(5)}  bar:${l.bar?.op}/${l.bar?.top}  hero:${l.hero?.pos}/${l.hero?.top}  sign:${l.sign?.op}/${l.sign?.vis}  today:${l.today?.top}  term:${l.term?.top}/${l.term?.op}  chars:${l.vis}  docked:${l.docked}`);
await browser.close();
