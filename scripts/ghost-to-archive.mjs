#!/usr/bin/env node
// Converts a Ghost 5 JSON export into the static archive: one archive/<slug>.md per published post or page,
// front matter plus the post's html as the body. Keeps every image at its old /content/images/ path.
//
// Usage: node scripts/ghost-to-archive.mjs <ghost-export.json> [--images <ghost content/images dir>] [--out archive]
//
// What it does:
//   - reads db[0].data (or data) from the export: posts, tags, posts_tags, users, posts_authors, posts_meta
//   - skips drafts and scheduled posts, reports them
//   - rewrites __GHOST_URL__ and https://git.wtf back to site-relative paths
//   - strips Ghost member cards, signup forms, paywalls and scripts from the html
//   - copies images into public/content/images/ when --images is given, reports any image a post needs but the folder lacks
//   - rewrites tests/old-urls.txt with every post, page, tag and author URL from the export (merged with the existing list)

import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import matter from 'gray-matter';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--'));
const opt = (name, dflt) => (args.includes(name) ? args[args.indexOf(name) + 1] : dflt);
const imagesDir = opt('--images', null);
const outDir = path.resolve(root, opt('--out', 'archive'));
const noUrlList = args.includes('--no-url-list');
const isFixture = path.resolve(input ?? '').includes(`${path.sep}tests${path.sep}fixtures${path.sep}`);
if (isFixture && outDir === path.resolve(root, 'archive')) {
    console.error('Fixture input must not be written into archive/. Use --out tests/fixtures/archive (npm run build:fixture does).');
    process.exit(2);
}
if (!input) {
    console.error('usage: ghost-to-archive.mjs <ghost-export.json> [--images <dir>] [--out archive]');
    process.exit(2);
}

const json = JSON.parse(await readFile(input, 'utf8'));
const data = json.db?.[0]?.data ?? json.data ?? json;
const meta = json.db?.[0]?.meta ?? json.meta ?? {};
const posts = data.posts ?? [];
const tags = new Map((data.tags ?? []).map((t) => [t.id, t]));
const users = new Map((data.users ?? []).map((u) => [u.id, u]));
const postTags = new Map();
for (const pt of data.posts_tags ?? []) {
    if (!postTags.has(pt.post_id)) postTags.set(pt.post_id, []);
    postTags.get(pt.post_id).push({ ...pt, tag: tags.get(pt.tag_id) });
}
const postAuthors = new Map();
for (const pa of data.posts_authors ?? []) {
    if (!postAuthors.has(pa.post_id)) postAuthors.set(pa.post_id, []);
    postAuthors.get(pa.post_id).push({ ...pa, user: users.get(pa.author_id) });
}
const postMeta = new Map((data.posts_meta ?? []).map((m) => [m.post_id, m]));

const SITE_HOSTS = /https?:\/\/(www\.)?git\.wtf/g;
function relative(s) {
    if (!s) return s;
    return String(s).replace(/__GHOST_URL__/g, '').replace(SITE_HOSTS, '');
}

const report = { written: [], skipped: [], noHtml: [], externalImages: new Map(), missingImages: new Set(), neededImages: new Set() };

function cleanHtml(html, slug) {
    const $ = cheerio.load(relative(html), null, false);
    $('script, style, form, iframe[src*="portal"], .kg-signup-card, .kg-paywall, .kg-product-card, [data-members-form], [data-portal]').remove();
    $('a').each((_, a) => {
        const href = $(a).attr('href');
        if (!href) return;
        let h = relative(href);
        h = h.replace(/\/amp\/?$/, '/');
        if (/^\/?#\/portal/.test(h)) {
            $(a).replaceWith($(a).text());
            return;
        }
        $(a).attr('href', h);
    });
    $('img, source').each((_, el) => {
        // Ghost's resized variants (/content/images/size/w600/...) are made on request; serve the original.
        $(el).removeAttr('srcset').removeAttr('sizes');
        for (const attr of ['src']) {
            const v = $(el).attr(attr);
            if (!v) continue;
            const nv = relative(v).replace(/^\/content\/images\/size\/[^/]+\//, '/content/images/');
            $(el).attr(attr, nv);
            for (const part of nv.split(',')) {
                const u = part.trim().split(/\s+/)[0];
                if (!u) continue;
                if (u.startsWith('/content/images/')) report.neededImages.add(u.replace(/^\/content\/images\/size\/[^/]+\//, '/content/images/'));
                else if (/^https?:\/\//.test(u)) {
                    const host = new URL(u).hostname;
                    if (!report.externalImages.has(host)) report.externalImages.set(host, new Set());
                    report.externalImages.get(host).add(slug);
                }
            }
        }
    });
    return $.html().trim();
}

function plain(html) {
    const spaced = html.replace(/<\/(p|h[1-6]|li|pre|div|figure|figcaption|blockquote|tr|td)>/g, '$& ');
    return cheerio.load(spaced, null, false).text().replace(/\s+/g, ' ').trim();
}

await mkdir(outDir, { recursive: true });
const urls = new Set();
for (const p of posts) {
    if (p.status !== 'published') {
        report.skipped.push(`${p.slug} (${p.status})`);
        continue;
    }
    if (!p.html) {
        report.noHtml.push(p.slug);
    }
    const html = p.html ? cleanHtml(p.html, p.slug) : '';
    const ptags = (postTags.get(p.id) ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((t) => t.tag?.name).filter(Boolean);
    const authors = (postAuthors.get(p.id) ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((a) => a.user?.name).filter(Boolean);
    const m = postMeta.get(p.id) ?? {};
    const feature = p.feature_image ? relative(p.feature_image).replace(/^\/content\/images\/size\/[^/]+\//, '/content/images/') : null;
    if (feature?.startsWith('/content/images/')) report.neededImages.add(feature);
    const text = plain(html);
    const fm = {
        title: p.title,
        type: p.type === 'page' ? 'page' : 'post',
        published_at: String(p.published_at ?? p.created_at).replace(' ', 'T'),
        updated_at: p.updated_at ? String(p.updated_at).replace(' ', 'T') : undefined,
        excerpt: p.custom_excerpt || (text.length > 160 ? text.slice(0, 157).trimEnd() + '...' : text),
        tags: ptags,
        feature_image: feature,
        meta_title: m.meta_title ?? p.meta_title ?? null,
        meta_description: m.meta_description ?? p.meta_description ?? null,
        canonical_url: p.canonical_url ? relative(p.canonical_url) : null,
        authors,
        ghost_id: p.id,
        fixture: isFixture ? true : undefined,
        visibility: p.visibility && p.visibility !== 'public' ? p.visibility : undefined,
    };
    for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];
    const file = path.join(outDir, `${p.slug}.md`);
    await writeFile(file, matter.stringify('\n' + html + '\n', fm));
    report.written.push(p.slug);
    urls.add(`/${p.slug}/`);
    if (fm.type === 'post') urls.add(`/${p.slug}/amp/`);
}
for (const t of tags.values()) urls.add(`/tag/${t.slug}/`);
for (const u of users.values()) if (u.slug) urls.add(`/author/${u.slug}/`);

// Images.
if (imagesDir) {
    for (const needed of report.neededImages) {
        const rel = needed.replace(/^\/content\/images\//, '');
        const src = path.join(imagesDir, rel);
        const dst = path.join(root, 'public/content/images', rel);
        try {
            await stat(src);
            await mkdir(path.dirname(dst), { recursive: true });
            await copyFile(src, dst);
        } catch {
            report.missingImages.add(needed);
        }
    }
} else {
    for (const needed of report.neededImages) {
        try {
            await stat(path.join(root, 'public', needed));
        } catch {
            report.missingImages.add(needed);
        }
    }
}

// URL list.
if (!noUrlList) {
const listFile = path.join(root, 'tests/old-urls.txt');
const existing = (await readFile(listFile, 'utf8').catch(() => '')).split('\n').map((l) => l.trim()).filter(Boolean);
const merged = [...new Set([...existing, ...urls])].sort();
await writeFile(listFile, merged.join('\n') + '\n');
console.log(`tests/old-urls.txt: ${merged.length} paths`);
}

console.log(`Ghost export ${meta.version ?? '?'} from ${meta.exported_on ? new Date(meta.exported_on).toISOString() : '?'}`);
console.log(`written: ${report.written.length} (${report.written.filter((s) => true).length} files in ${path.relative(root, outDir)}/)`);
console.log(`skipped (not published): ${report.skipped.length}${report.skipped.length ? '  ' + report.skipped.join(', ') : ''}`);
if (report.noHtml.length) console.log(`NO HTML in export (body empty, needs a lexical render): ${report.noHtml.join(', ')}`);
console.log(`images needed: ${report.neededImages.size}, missing: ${report.missingImages.size}`);
for (const m of report.missingImages) console.log(`  missing ${m}`);
if (report.externalImages.size) {
    console.log('external image hosts (Content may want a look):');
    for (const [host, slugs] of report.externalImages) console.log(`  ${host}: ${[...slugs].join(', ')}`);
}
