#!/usr/bin/env node
// Renders the PNG icons from public/favicon.svg. Run once after changing the mark; the PNGs are committed.
import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const svg = await readFile(path.join(root, 'public/favicon.svg'), 'utf8');
for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-512.png', 512], ['favicon-32.png', 32]]) {
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
    await writeFile(path.join(root, 'public', file), png);
    console.log(`${file} ${png.length} bytes`);
}
