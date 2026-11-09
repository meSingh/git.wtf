// Makes an incident's story image from a raw illustration: crops to 1200 by 630 (and a 2400 by 1260 copy),
// puts the git.wtf wordmark in the bottom-right corner, and writes share.png, cut/story.webp and cut/story@2x.webp.
// The wordmark is laid on in code, never drawn by the image model, so the name is always crisp and spelled right.
// Usage: node scripts/brand-story.mjs <incident id> <raw image path>
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { withWordmark } from './wordmark.mjs';

const [id, raw] = process.argv.slice(2);
if (!id || !raw) { console.error('Usage: node scripts/brand-story.mjs <incident id> <raw image>'); process.exit(1); }
const dir = path.join('incidents', id);
mkdirSync(path.join(dir, 'cut'), { recursive: true });
const branded = (w, h) => withWordmark(raw, w, h);

const one = await (await branded(1200, 630)).png().toBuffer();
writeFileSync(path.join(dir, 'share.png'), await sharp(one).png({ palette: true, colours: 64, compressionLevel: 9 }).toBuffer());
await sharp(one).webp({ quality: 82 }).toFile(path.join(dir, 'cut', 'story.webp'));
await (await branded(2400, 1260)).webp({ quality: 80 }).toFile(path.join(dir, 'cut', 'story@2x.webp'));
console.log(`${id}: share.png, cut/story.webp, cut/story@2x.webp`);
