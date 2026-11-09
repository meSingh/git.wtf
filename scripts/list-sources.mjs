#!/usr/bin/env node
// Lists every incident already published: date, id, category and source URL.
// The daily task reads this before searching so it never picks a source twice.
// Usage: node scripts/list-sources.mjs [--json]

import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';

const dir = new URL('../incidents/', import.meta.url);
const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort().reverse();
const rows = [];
for (const file of files) {
    const { data } = matter(await readFile(new URL(file, dir), 'utf8'));
    rows.push({ id: file.replace(/\.md$/, ''), date: data.date, category: data.category, source_url: data.source_url, title: data.title });
}
if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
} else {
    for (const r of rows) console.log(`${r.date}  ${r.category.padEnd(16)}  ${r.source_url}  (${r.id})`);
    if (!rows.length) console.log('No incidents yet.');
}
