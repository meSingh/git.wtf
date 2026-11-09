#!/usr/bin/env node
// Renders the video for one incident with the Video role's Remotion template and attaches it to the incident.
//
// Usage: node scripts/render-video.mjs <incident-id> [--local] [--no-push] [--mode scroll|fit]
//
//   --local   write to public/incident/<id>/video.mp4 and poster.jpg (gitignored) for a look on a preview build;
//             the front matter is not touched. The incident page shows the file when it exists at build time.
//   default   (phase 2) upload the mp4 and poster to R2, write `video:` and `poster:` into the incident's front
//             matter and commit that one file by path. Needs GITWTF_R2_BUCKET and GITWTF_MEDIA_URL in the
//             environment and a wrangler login on his account.
//
// Renderer contract (Video role): node video/render.mjs <incident.md> --out <file.mp4> [--poster <file.jpg>] [--mode ...]
// Exit 0 and a last stdout line "rendered <path> in N s: ..." on success. Node 24+, ffmpeg and ffprobe on PATH.
// The renderer works out "days before" from the previous file in the same folder, so incidents/ must be complete.

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--'));
const local = args.includes('--local');
const noPush = args.includes('--no-push');
const mode = args.includes('--mode') ? args[args.indexOf('--mode') + 1] : null;
if (!id) {
    console.error('usage: render-video.mjs <incident-id> [--local] [--no-push] [--mode scroll|fit]');
    process.exit(2);
}

const incident = path.join(root, 'incidents', `${id}.md`);
await access(incident).catch(() => {
    console.error(`no such incident: incidents/${id}.md`);
    process.exit(1);
});

// The renderer lives in site/video/ once the Remotion project moves into the repo; until then at the workspace root.
const candidates = [path.join(root, 'video/render.mjs'), path.join(root, '../video/render.mjs')];
let renderer = null;
for (const c of candidates) {
    try {
        await access(c);
        renderer = c;
        break;
    } catch {}
}
if (!renderer) {
    console.error(`renderer not found; looked in ${candidates.join(' and ')}`);
    process.exit(1);
}

const outDir = local ? path.join(root, 'public/incident', id) : path.join(root, '.render', id);
await mkdir(outDir, { recursive: true });
const mp4 = path.join(outDir, 'video.mp4');
const poster = path.join(outDir, 'poster.jpg');

const renderArgs = [renderer, incident, '--out', mp4, '--poster', poster];
if (mode) renderArgs.push('--mode', mode);
console.log(`rendering ${id} with ${path.relative(root, renderer)}`);
const r = spawnSync('node', renderArgs, { stdio: 'inherit' });
if (r.status !== 0) {
    console.error(`render failed (exit ${r.status})`);
    process.exit(r.status ?? 1);
}
if (local) {
    console.log(`local render at public/incident/${id}/video.mp4 (ignored by git); the incident page picks it up on the next build`);
    process.exit(0);
}

// Phase 2: R2 upload and the front matter update.
const bucket = process.env.GITWTF_R2_BUCKET;
const mediaUrl = process.env.GITWTF_MEDIA_URL?.replace(/\/$/, '');
if (!bucket || !mediaUrl) {
    console.error('set GITWTF_R2_BUCKET and GITWTF_MEDIA_URL (the public base URL of the bucket), or use --local');
    process.exit(1);
}
for (const [file, key, type] of [
    [mp4, `incident/${id}.mp4`, 'video/mp4'],
    [poster, `incident/${id}.jpg`, 'image/jpeg'],
]) {
    execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `${bucket}/${key}`, '--file', file, '--content-type', type, '--remote'], { cwd: root, stdio: 'inherit' });
}
const raw = await readFile(incident, 'utf8');
const { data, content } = matter(raw);
data.video = `${mediaUrl}/incident/${id}.mp4`;
data.poster = `${mediaUrl}/incident/${id}.jpg`;
await writeFile(incident, matter.stringify(content, data));
const rel = `incidents/${id}.md`;
execFileSync('git', ['add', '--', rel], { cwd: root, stdio: 'inherit' });
execFileSync('git', ['commit', '-m', `incident: ${id} video`, '--', rel], { cwd: root, stdio: 'inherit' });
if (!noPush) execFileSync('git', ['push', 'origin', 'HEAD'], { cwd: root, stdio: 'inherit' });
console.log(`${rel}: video attached${noPush ? ', not pushed' : ' and pushed'}`);
