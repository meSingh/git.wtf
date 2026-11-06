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

// YAML turns an unquoted 2026-11-06 into a Date; accept both and keep the calendar day.
const toDay = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v);
const toIso = (v: unknown) => (v instanceof Date ? v.toISOString() : v);
const isoDate = z.preprocess(toDay, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'));

const incidents = defineCollection({
    loader: glob({ pattern: '*.md', base: './incidents' }),
    schema: z.object({
        date: isoDate,
        title: z.string().min(3),
        category: z.enum(CATEGORIES),
        source_url: z.string().url(),
        source_date: isoDate,
        status: z.string().min(1),
    }),
});

// The Ghost archive: one file per post or page, front matter plus the post's html as the body.
// Written by scripts/ghost-to-archive.mjs, never by hand. The body stays html (no markdown pass).
const archive = defineCollection({
    loader: async () => {
        const dir = new URL('../archive/', import.meta.url);
        const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
        return Promise.all(
            files.map(async (file) => {
                const raw = await readFile(new URL(file, dir), 'utf8');
                const { data, content } = matter(raw);
                return { id: file.replace(/\.md$/, ''), ...data, html: content.trim() };
            }),
        );
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
