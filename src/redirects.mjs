// The redirect map for GitHub Pages, which has no server-side redirects: every old URL family becomes a
// static page that Astro emits with a meta refresh and a canonical link (astro.config.mjs `redirects`).
// Sources: tests/old-urls.txt (every path the Wayback Machine saw answer 200 since 2023, plus what the
// converters add) and the archive folder (one page per post, so its amp copy can redirect to it).
//
// Exported for astro.config.mjs; run `node src/redirects.mjs` to print the map and anything unmapped.

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);

// Slugs the Laravel app (2016 to 2021) used that Ghost renamed in 2023.
export const RENAMED = {
    '/how-to-change-the-message-on-last-commit': '/how-to-change-the-message-on-last-commit-in-git/',
    '/how-to-move-accidentally-committed-changes-to-a-brand-new-branch': '/how-to-move-accidentally-committed-changes-to-a-brand-new-branch-in-git/',
    '/how-to-sync-my-commits-with-multiple-repositories': '/how-to-sync-my-commits-with-multiple-repositories-in-git/',
    '/how-to-squash-last-x-commits-together': '/how-to-squash-the-last-x-commits-together-in-git/',
    '/how-to-squash-last-x-commits-together-in-git': '/how-to-squash-the-last-x-commits-together-in-git/',
    '/how-to-revert-last-x-commits-in-git': '/how-to-revert-last-x-commits/',
    '/how-to-run-a-diff-on-unstagged-changes': '/how-to-run-a-diff-on-unstaged-changes-in-git/',
    '/how-to-run-a-diff-on-unstagged-changes-in-git': '/how-to-run-a-diff-on-unstaged-changes-in-git/',
    '/how-to-remove-stagged-changes-from-git': '/how-to-remove-staged-changes-from-git/',
    '/how-to-stop-password-prompts-on-any-git-command-on-macos': '/how-to-stop-password-prompts-on-any-git-command-in-macos/',
    '/git-frustrations': '/archive/',
    '/contributors': '/archive/',
    // Mandeep, 8 Nov 2026: the About page's story now opens the archive; the duplicate post (the same article
    // twice on Ghost, the copy ending mid-sentence) gives way to the original
    '/about': '/archive/',
    '/how-to-remove-a-file-or-directory-from-git-without-deleting-it-from-your-working-directory-2': '/how-to-remove-a-file-or-directory-from-git-without-deleting-it-from-your-working-directory/',
};

export function archiveSlugs(dir = path.join(root, 'archive')) {
    try {
        return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
    } catch {
        return [];
    }
}

/** Maps one old path to its new destination, or null when it is a real page (or must stay a 404). */
export function mapPath(p, slugs) {
    const clean = p.replace(/\/+$/, '') || '/';
    if (clean === '/') return null;
    if (slugs.has(clean.slice(1))) return null;
    if (RENAMED[clean]) return RENAMED[clean];
    let m;
    if ((m = clean.match(/^\/([^/]+)\/amp$/)) && slugs.has(m[1])) return `/${m[1]}/`;
    if (m && RENAMED[`/${m[1]}`]) return RENAMED[`/${m[1]}`];
    if (/^\/(tag|category|author|authors|page)(\/|$)/.test(clean)) return "/archive/";
    if ((m = clean.match(/^\/([^/]+)\/page\/\d+$/)) ) return '/archive/';
    if (/^\/(rss|feed)$/.test(clean)) return null; // real pages: src/pages/rss and src/pages/feed refresh to /rss.xml
    if (/^\/(members|signup|signin|ghost|webmentions|p)(\/|$)/.test(clean)) return '/';
    if (/^\/sitemap[-a-z]*\.xml$/.test(clean)) return null; // real endpoints, see src/pages/sitemap*.xml.ts
    if (/\.(png|jpg|jpeg|gif|svg|ico|css|js|json|txt|xml|webmanifest)$/.test(clean)) return null; // assets: 404 is fine
    if (clean.startsWith('/.well-known') || clean.startsWith('/cdn-cgi') || clean.startsWith('/content/') || clean.startsWith('/assets/')) return null;
    return undefined; // unmapped
}

export function buildRedirects({ base = '/' } = {}) {
    const slugs = new Set(archiveSlugs());
    const listFile = path.join(root, 'tests/old-urls.txt');
    let paths = [];
    try {
        paths = readFileSync(listFile, 'utf8').split('\n').map((l) => l.trim().split(/\s+/)[0]).filter((l) => l && !l.startsWith('#'));
    } catch {}
    for (const s of slugs) paths.push(`/${s}/amp/`);
    for (const k of Object.keys(RENAMED)) paths.push(k);
    paths.push('/signup', '/signin', '/ghost', '/members');

    const prefix = base.replace(/\/$/, '');
    const redirects = {};
    const unmapped = [];
    for (const p of new Set(paths)) {
        const dest = mapPath(p, slugs);
        if (dest === undefined) {
            unmapped.push(p);
            continue;
        }
        if (dest === null) continue;
        const key = p.replace(/\/+$/, '');
        if (!key || key.includes('.')) continue;
        redirects[key] = dest.startsWith('/') ? prefix + dest : dest;
    }
    return { redirects, unmapped };
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
    const { redirects, unmapped } = buildRedirects();
    for (const [k, v] of Object.entries(redirects)) console.log(`${k}  ->  ${v}`);
    console.log(`\n${Object.keys(redirects).length} redirect pages, ${unmapped.length} unmapped`);
    for (const u of unmapped) console.log(`  unmapped ${u}`);
}
