import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';

// Fixed in notes/content/VOICE.md (Content owns the list). Add one only when three incidents need it.
export const CATEGORIES = [
    'force-push',
    'reset-hard',
    'deleted-tests',
    'committed-secret',
    'renamed-main',
    'pr-flood',
    'kept-both',
    'commit-message',
    'pushed-to-main',
    'history-rewrite',
    'wiped-worktree',
    'github',
] as const;

export const ACTORS = ['ai', 'human', 'github'] as const;
export const TOOLS = ['claude-code', 'codex', 'cursor', 'custom', 'human', 'github'] as const;
export const PANEL_WHO = ['DEV', 'AGENT', 'STATUS PAGE', 'caption'] as const;

// YAML turns an unquoted 2026-11-06 into a Date; accept both and keep the calendar day.
const toDay = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v);
const toIso = (v: unknown) => (v instanceof Date ? v.toISOString() : v);
const isoDate = z.preprocess(toDay, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'));

// GITWTF_FIXTURE=1 builds from tests/fixtures/ instead of the real folders (npm run build:fixture),
// so fixture output never lands in incidents/ or archive/.
const FIXTURE = process.env.GITWTF_FIXTURE === '1';
const INCIDENTS_DIR = FIXTURE ? './tests/fixtures/incidents' : './incidents';
const ARCHIVE_DIR = FIXTURE ? 'tests/fixtures/archive/' : 'archive/';

const incidents = defineCollection({
    loader: glob({ pattern: '*.md', base: INCIDENTS_DIR }),
    schema: z.object({
        date: isoDate,
        title: z.string().min(3),
        category: z.enum(CATEGORIES),
        source_url: z.string().url(),
        source_date: isoDate,
        status: z.string().min(1),
        // Who caused it (the scoreboard) and with what (the tally by tool). Content sets both (VOICE.md).
        actor: z.enum(ACTORS),
        tool: z.enum(TOOLS).optional(),
        // The comic strip's script (VOICE.md, the panels block): four panels, each a scene and optionally who says what.
        panels: z
            .array(
                z
                    .object({ scene: z.string().min(1), who: z.enum(PANEL_WHO).optional(), bubble: z.string().min(1).optional() })
                    .refine((p) => !p.who === !p.bubble, 'who and bubble go together'),
            )
            .length(4)
            .optional(),
        // Set by scripts/render-video.mjs once the video is uploaded (phase 2). Absent until then.
        video: z.string().url().optional(),
        poster: z.string().url().optional(),
        fixture: z.boolean().optional(),
        // The homepage's "What actually happened": a few short lines (else the retelling's first sentences), and
        // the words for the story image that sits beside them.
        detail: z.array(z.string().min(1)).max(4).optional(),
        story_alt: z.string().optional(),
    }),
});

// The Ghost archive: one file per post or page, front matter plus the post's html as the body.
// Written by scripts/ghost-to-archive.mjs, never by hand. The body stays html (no markdown pass).
const archive = defineCollection({
    loader: {
        name: 'ghost-archive',
        load: async ({ store, config, parseData, logger }) => {
            const dir = new URL(ARCHIVE_DIR, config.root);
            let files: string[] = [];
            try {
                files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
            } catch {
                logger.warn(`${ARCHIVE_DIR} is missing; the archive is empty`);
            }
            store.clear();
            for (const file of files) {
                const raw = await readFile(new URL(file, dir), 'utf8');
                const { data, content } = matter(raw);
                const id = file.replace(/\.md$/, '');
                const parsed = await parseData({ id, data: { ...data, html: content.trim() } });
                store.set({ id, data: parsed });
            }
            logger.info(`${files.length} archive entries from ${ARCHIVE_DIR}`);
        },
    },
    schema: z.object({
        title: z.string(),
        type: z.enum(['post', 'page']).default('post'),
        published_at: z.preprocess(toIso, z.string()),
        updated_at: z.preprocess(toIso, z.string().optional()),
        excerpt: z.string().default(''),
        tags: z.array(z.string()).default([]),
        feature_image: z.string().nullable().default(null),
        meta_title: z.string().nullable().default(null),
        meta_description: z.string().nullable().default(null),
        canonical_url: z.string().nullable().default(null),
        authors: z.array(z.string()).default([]),
        html: z.string(),
    }),
});

export const collections = { incidents, archive };
