#!/usr/bin/env node
// Checks that every old git.wtf URL still resolves on a deployed or local copy of the site.
// Usage: node scripts/check-urls.mjs <base-url> [tests/old-urls.txt]
// Each line in the list is a path; an optional second column is the path it must end on.
// A path passes when it answers 200, or redirects (up to 5 hops, http redirects or meta-refresh pages
// as GitHub Pages needs) to a page that answers 200 and is not itself a redirect page.

import { readFile } from 'node:fs/promises';

const base = (process.argv[2] ?? 'http://127.0.0.1:8787').replace(/\/$/, '');
const listFile = process.argv[3] ?? new URL('../tests/old-urls.txt', import.meta.url);
const lines = (await readFile(listFile, 'utf8')).split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

async function follow(path) {
    let url = base + path;
    const hops = [];
    for (let i = 0; i < 6; i++) {
        const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'gitwtf-url-check' } });
        hops.push(`${res.status} ${new URL(url).pathname}`);
        if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
            url = new URL(res.headers.get('location'), url).toString();
            continue;
        }
        if (res.status === 200 && (res.headers.get('content-type') ?? '').includes('text/html')) {
            const html = await res.text();
            const m = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\s*\d+\s*;\s*url=([^"']+)["']/i);
            if (m) {
                hops[hops.length - 1] += ' (meta refresh)';
                url = new URL(m[1].trim(), url).toString();
                continue;
            }
        }
        return { status: res.status, final: new URL(url).pathname, hops };
    }
    return { status: 0, final: url, hops };
}

let failed = 0;
const limit = 8;
const queue = [...lines];
async function worker() {
    while (queue.length) {
        const line = queue.shift();
        const [path, expected] = line.split(/\s+/);
        const r = await follow(path);
        const ok = r.status === 200 && (!expected || r.final === expected);
        if (!ok) {
            failed++;
            console.log(`FAIL ${path}  ->  ${r.hops.join('  ->  ')}${expected ? `  (expected ${expected})` : ''}`);
        }
    }
}
await Promise.all(Array.from({ length: limit }, worker));
console.log(`${lines.length - failed}/${lines.length} old URLs resolve on ${base}`);
process.exit(failed ? 1 : 0);
