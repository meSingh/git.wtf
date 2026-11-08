// The git.wtf wordmark, laid on every image the site makes (story and share images, stills, posters).
// Bottom-right, on a near-black plate so it reads on any picture; sized to the image's width (160 px at 1200 wide).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const logo = readFileSync(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/logo.svg'));

/** The input (a path or a buffer), sized to w by h, with the wordmark on. Returns a sharp pipeline to encode. */
export async function withWordmark(input, w, h, fit = 'cover') {
    // 160 px on a 1200-wide picture; a tall one (a phone poster) gets a fifth of its width
    const lw = Math.round(w < h ? w * 0.22 : (160 * w) / 1200), pad = Math.round(lw * 0.075);
    const mark = await sharp(logo, { density: 600 }).resize({ width: lw }).png().toBuffer();
    const { height: lh } = await sharp(mark).metadata();
    const pw = lw + pad * 2, ph = lh + pad * 2, r = Math.round(lw * 0.04);
    const plate = Buffer.from(`<svg width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="${r}" fill="#0A0A0A" stroke="#FFD400" stroke-width="${Math.max(1, Math.round(lw / 100))}" stroke-opacity="0.55"/></svg>`);
    const m = Math.round(lw * 0.11), left = w - pw - m, top = h - ph - m;
    const base = await sharp(input).resize(w, h, { fit, position: 'centre', background: '#0A0A0A' }).png().toBuffer();
    return sharp(base).composite([{ input: plate, left, top }, { input: mark, left: left + pad, top: top + pad }]);
}
