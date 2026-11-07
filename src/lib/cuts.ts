// An incident's cutscene and what was rendered from it. The shot list lives in src/anime/shots/<id>.json; the
// rendered stills, share image and video live next to the retelling in incidents/<id>/cut/ (written by
// scripts/render-cut.mjs and Video's export) and are served from /cuts/<id>/ (copied by scripts/copy-cuts.mjs).
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { ShotList } from '../anime/types';

const lists = import.meta.glob<{ default: ShotList }>('../anime/shots/*.json', { eager: true });

export function shotList(id: string): ShotList | null {
    const hit = Object.entries(lists).find(([p]) => p.endsWith(`/${id}.json`));
    return hit ? hit[1].default : null;
}

export interface CutAssets { stills: { file: string; shot: string }[]; video: string | null; poster: string | null; posterTall: string | null; /** Video's story image (also the share image), 1200 by 630, with a 2x copy */ story: string | null; story2x: string | null }

export function cutAssets(id: string): CutAssets {
    const dir = path.join(process.cwd(), 'public/cuts', id);
    if (!existsSync(dir)) return { stills: [], video: null, poster: null, posterTall: null, story: null, story2x: null };
    const files = readdirSync(dir).sort();
    return {
        stills: files.filter((f) => /^still-\d+-.+\.webp$/.test(f)).map((f) => ({ file: f, shot: f.replace(/^still-\d+-|\.webp$/g, '') })),
        video: files.includes('cut.mp4') ? 'cut.mp4' : null,
        poster: files.includes('poster.webp') ? 'poster.webp' : null,
        posterTall: files.includes('poster-tall.webp') ? 'poster-tall.webp' : null,
        story: files.includes('story.webp') ? 'story.webp' : null,
        story2x: files.includes('story@2x.webp') ? 'story@2x.webp' : null,
    };
}
