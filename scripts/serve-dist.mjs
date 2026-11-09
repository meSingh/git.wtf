#!/usr/bin/env node
// Serves dist/ the way GitHub Pages does: /dir/ -> dir/index.html, /dir -> 301 to /dir/, /file.html works,
// missing paths get 404.html with a 404. Usage: node scripts/serve-dist.mjs [dist] [port] [base-path]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 8787);
const base = (process.argv[4] ?? '').replace(/\/$/, '');
const types = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'text/javascript', mjs: 'text/javascript', json: 'application/json', xml: 'application/xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp', ico: 'image/x-icon', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', txt: 'text/plain; charset=utf-8', mp4: 'video/mp4', webmanifest: 'application/manifest+json' };

async function exists(p) {
    try {
        return (await stat(p)).isFile();
    } catch {
        return false;
    }
}

createServer(async (req, res) => {
    let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (base && url.startsWith(base)) url = url.slice(base.length) || '/';
    // Pages compresses text responses; do the same so performance numbers measured here are representative.
    const send = async (file, status = 200) => {
        const ext = path.extname(file).slice(1).toLowerCase();
        const type = types[ext] ?? 'application/octet-stream';
        let body = await readFile(file);
        const headers = { 'content-type': type, 'cache-control': ext === 'html' ? 'no-cache' : 'max-age=600' };
        if (/^(text\/|application\/(json|xml|javascript|manifest))/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
            body = gzipSync(body);
            headers['content-encoding'] = 'gzip';
        }
        res.writeHead(status, headers);
        res.end(body);
    };
    const target = path.join(dir, url);
    if (!target.startsWith(dir)) {
        res.writeHead(400).end();
        return;
    }
    if (url.endsWith('/')) {
        if (await exists(path.join(target, 'index.html'))) return send(path.join(target, 'index.html'));
    } else {
        if (await exists(target)) return send(target);
        if (await exists(target + '.html')) return send(target + '.html');
        if (await exists(path.join(target, 'index.html'))) {
            res.writeHead(301, { location: base + url + '/' });
            res.end();
            return;
        }
    }
    if (await exists(path.join(dir, '404.html'))) return send(path.join(dir, '404.html'), 404);
    res.writeHead(404).end('not found');
}).listen(port, '127.0.0.1', () => console.log(`serving ${dir} at http://127.0.0.1:${port}${base}/`));
