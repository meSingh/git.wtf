#!/usr/bin/env node
// Moves a reviewed draft into incidents/, builds the site, commits the file by path and pushes.
// Usage: node scripts/publish-incident.mjs drafts/2026-11-07-slug.md [--no-push] [--dry-run]
// The commit carries the configured git identity (his) and nothing else.

import { access, readFile, rename, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import matter from 'gray-matter';

const CATEGORIES = ['force-push', 'reset-hard', 'deleted-tests', 'committed-secret', 'renamed-main', 'pr-flood', 'kept-both', 'commit-message', 'pushed-to-main', 'history-rewrite', 'wiped-worktree', 'github'];
const root = path.resolve(new URL('..', import.meta.url).pathname);
const args = process.argv.slice(2);
const draft = args.find((a) => !a.startsWith('--'));
const noPush = args.includes('--no-push');
const dryRun = args.includes('--dry-run');
if (!draft) {
    console.error('usage: publish-incident.mjs <draft.md> [--no-push] [--dry-run]');
    process.exit(2);
}

const errors = [];
const raw = await readFile(draft, 'utf8');
const { data, content } = matter(raw);
const iso = /^\d{4}-\d{2}-\d{2}$/;
if (!iso.test(String(data.date ?? ''))) errors.push('date must be YYYY-MM-DD');
if (!data.title || String(data.title).length < 3) errors.push('title missing');
if (!CATEGORIES.includes(data.category)) errors.push(`category must be one of ${CATEGORIES.join(', ')}`);
if (!/^https?:\/\//.test(String(data.source_url ?? ''))) errors.push('source_url must be an http(s) URL');
if (!iso.test(String(data.source_date ?? ''))) errors.push('source_date must be YYYY-MM-DD');
if (!data.status || !String(data.status).trim()) errors.push('status missing');
const body = content.trim();
const sentences = body.split(/[.!?](\s|$)/).filter((s) => s.trim().length > 10).length;
if (sentences < 2) errors.push('body needs at least two sentences');
if (/^status:/im.test(body)) errors.push('body must not repeat the Status line; it comes from the front matter');
if (/—/.test(raw)) errors.push('no em dashes');

const slug = path.basename(draft).replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
const id = `${data.date}-${slug}`;
const target = path.join(root, 'incidents', `${id}.md`);
try {
    await access(target);
    errors.push(`incidents/${id}.md already exists`);
} catch {}

// No source twice.
const existing = JSON.parse(execFileSync('node', [path.join(root, 'scripts/list-sources.mjs'), '--json'], { encoding: 'utf8' }));
const dup = existing.find((e) => e.source_url === data.source_url);
if (dup) errors.push(`source already used by ${dup.id}`);
const sameDay = existing.find((e) => e.date === data.date);
if (sameDay) errors.push(`an incident for ${data.date} already exists (${sameDay.id})`);

if (errors.length) {
    console.error('Not published:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
}
console.log(`OK  ${id}`);
if (dryRun) process.exit(0);

await writeFile(target, matter.stringify(body + '\n', data));
if (path.resolve(draft) !== target) await rename(draft, target).catch(() => {});
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
const rel = `incidents/${id}.md`;
execFileSync('git', ['add', '--', rel], { cwd: root, stdio: 'inherit' });
execFileSync('git', ['commit', '-m', `incident: ${data.date} ${data.title}`, '--', rel], { cwd: root, stdio: 'inherit' });
if (!noPush) execFileSync('git', ['push', 'origin', 'HEAD'], { cwd: root, stdio: 'inherit' });
console.log(noPush ? `Committed ${rel}, not pushed.` : `Committed and pushed ${rel}.`);
