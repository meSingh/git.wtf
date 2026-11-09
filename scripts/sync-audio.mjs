#!/usr/bin/env node
// Copies the sound library's web files and manifest from Video's library (../video/audio by default) into
// public/audio/, which is what the cutscene plays. The site build cannot reach ../video, so the copy is committed.
// Usage: node scripts/sync-audio.mjs [path to video/audio]
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.resolve(process.argv[2] ?? path.join(root, '../video/audio'));
const out = path.join(root, 'public/audio');
const m = JSON.parse(readFileSync(path.join(src, 'manifest.json'), 'utf8'));
mkdirSync(out, { recursive: true });
const sounds = [];
for (const s of m.sounds ?? []) {
    if (!s.web || !existsSync(path.join(src, s.web))) continue;
    mkdirSync(path.dirname(path.join(out, s.web)), { recursive: true });
    copyFileSync(path.join(src, s.web), path.join(out, s.web));
    // the page needs where and what; the licence record stays in Video's manifest
    sounds.push({ id: s.id, web: s.web, kind: s.kind, tags: s.tags, duration: s.duration, ...(s.gain ? { gain: s.gain } : {}) });
}
writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({ about: 'Copied from video/audio by scripts/sync-audio.mjs; edit the library there.', fx: m.fx ?? {}, sfx: m.sfx ?? {}, music: m.music ?? {}, events: m.events ?? {}, voices: m.voices ?? {}, ...(m.mix ? { mix: m.mix } : {}), sounds }, null, 1));
console.log(`[audio] ${sounds.length} sounds copied to public/audio`);
