#!/usr/bin/env node
// Cuts each incident's comic strip into its four panels, in three widths, for the homepage, the record and the
// incident pages. A strip lives next to its retelling: incidents/<id>/strip.png (a 2 x 2 grid, 16:9, from
// video/comic.mjs). Until an incident has one, the placeholder (assets/strip-placeholder.webp, the first sample
// strip) stands in, so the layout can be judged. Output: public/strips/<id>/p<1-4>-<w>.webp (generated, not
// committed). Runs before every build (npm's prebuild); skips work whose output is newer than its strip.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FIXTURE = process.env.GITWTF_FIXTURE === '1';
const dir = path.join(root, FIXTURE ? 'tests/fixtures/incidents' : 'incidents');
const out = path.join(root, 'public/strips');
const placeholder = path.join(root, 'assets/strip-placeholder.webp');
export const WIDTHS = [480, 800, 1280];

const ids = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
let made = 0;
for (const id of ids) {
    const own = path.join(dir, id, 'strip.png');
    const src = existsSync(own) ? own : placeholder;
    const dest = path.join(out, id);
    const marker = path.join(dest, `p4-${WIDTHS.at(-1)}.webp`);
    if (existsSync(marker) && statSync(marker).mtimeMs > statSync(src).mtimeMs) continue;
    mkdirSync(dest, { recursive: true });
    const { width, height } = await sharp(src).metadata();
    const w = Math.floor(width / 2), h = Math.floor(height / 2);
    for (let p = 0; p < 4; p++) {
        const panel = sharp(src).extract({ left: (p % 2) * w, top: Math.floor(p / 2) * h, width: w, height: h });
        const buf = await panel.toBuffer();
        for (const W of WIDTHS) await sharp(buf).resize({ width: W }).webp({ quality: 80 }).toFile(path.join(dest, `p${p + 1}-${W}.webp`));
    }
    made++;
}
console.log(`[panels] ${ids.length} incidents, ${made} strips cut${made ? '' : ' (all current)'}`);
