#!/usr/bin/env node
// Builds the archive from the Internet Archive's captures of the old Ghost site, so the archive is real
// before the Ghost export arrives. Same output as ghost-to-archive.mjs: archive/<slug>.md with front matter
// and the post's html as the body, images saved under public/content/images/ at their old paths.
//
// Usage: node scripts/wayback-to-archive.mjs [tests/wayback-posts.txt] [--out archive] [--no-images] [--only slug]
//
// Only web.archive.org is contacted (the id_ flag returns the original html, no toolbar). The live site is never touched.

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import matter from 'gray-matter';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const args = process.argv.slice(2);
const opt = (name, dflt) => (args.includes(name) ? args[args.indexOf(name) + 1] : dflt);
const listFile = args.find((a) => !a.startsWith('--') && a.endsWith('.txt')) ?? path.join(root, 'tests/wayback-posts.txt');
const outDir = path.resolve(root, opt('--out', 'archive'));
const only = opt('--only', null);
const noImages = args.includes('--no-images');
const SITE = 'https://git.wtf';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, as = 'text', tries = 4) {
    for (let i = 0; i < tries; i++) {
        try {
            const res = await fetch(url, { headers: { 'user-agent': 'gitwtf-archive-builder (one pass, polite)' }, redirect: 'follow' });
            if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
            if (!res.ok) return null;
            return as === 'text' ? await res.text() : Buffer.from(await res.arrayBuffer());
        } catch (e) {
            if (i === tries - 1) throw e;
            await sleep(1500 * (i + 1));
        }
    }
}

async function latestCapture(original) {
    // Newest capture with a 200 since 2023. limit=-1 returns the last row.
    const q = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(original)}&output=json&filter=statuscode:200&from=2023&limit=-1&fl=timestamp,original`;
    const txt = await get(q);
    if (!txt) return null;
    const rows = JSON.parse(txt);
    if (rows.length < 2) return null;
    return { ts: rows[rows.length - 1][0], original: rows[rows.length - 1][1] };
}

const SITE_RE = /https?:\/\/(www\.)?git\.wtf/g;
const relative = (s) => (s ? String(s).replace(/__GHOST_URL__/g, '').replace(SITE_RE, '') : s);
const unsize = (u) => u.replace(/^\/content\/images\/size\/[^/]+\//, '/content/images/');

const slugs = (await readFile(listFile, 'utf8')).split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).filter((s) => !only || s === only);
await mkdir(outDir, { recursive: true });
const images = new Set();
const report = { ok: [], missing: [], failed: [] };

for (const slug of slugs) {
    const original = `${SITE}/${slug}/`;
    try {
        const cap = await latestCapture(original);
        if (!cap) {
            report.missing.push(slug);
            console.log(`MISSING  ${slug} (no 200 capture)`);
            continue;
        }
        const html = await get(`https://web.archive.org/web/${cap.ts}id_/${cap.original}`);
        if (!html) {
            report.missing.push(slug);
            console.log(`MISSING  ${slug} (capture ${cap.ts} not readable)`);
            continue;
        }
        const $ = cheerio.load(html);
        let ld = {};
        try {
            ld = JSON.parse($('script[type="application/ld+json"]').first().text() || '{}');
        } catch {}
        const title = ($('h1.gh-article-title').first().text() || ld.headline || $('title').text().replace(/\s*\|.*$/, '')).trim();
        const isPage = $('body').hasClass('page-template');
        const published = ld.datePublished ?? $('meta[property="article:published_time"]').attr('content') ?? null;
        const modified = ld.dateModified ?? $('meta[property="article:modified_time"]').attr('content') ?? null;
        const excerpt = ($('.gh-article-excerpt').first().text() || $('meta[name="description"]').attr('content') || '').trim();
        const metaTitle = $('meta[property="og:title"]').attr('content') ?? null;
        const metaDesc = $('meta[name="description"]').attr('content') ?? null;
        // Tags: the body classes carry every tag as tag-<slug>; the primary tag link gives the name case.
        const tags = ($('body').attr('class') || '').split(/\s+/).filter((c) => c.startsWith('tag-')).map((c) => c.slice(4));
        const feature = $('.gh-article-image img, figure.gh-article-image img').first().attr('src');
        const featureImage = feature ? unsize(relative(feature)) : null;
        if (featureImage?.startsWith('/content/images/')) images.add(featureImage);
        const content = $('.gh-content').first();
        if (!content.length) {
            report.failed.push(`${slug}: no .gh-content`);
            console.log(`FAILED   ${slug}: no .gh-content in capture ${cap.ts}`);
            continue;
        }
        content.find('script, style, form, .kg-signup-card, .kg-paywall, [data-members-form], [data-portal]').remove();
        content.find('a').each((_, a) => {
            const href = $(a).attr('href');
            if (!href) return;
            let h = relative(href).replace(/\/amp\/?$/, '/');
            if (/^\/?#\/portal/.test(h)) {
                $(a).replaceWith($(a).text());
                return;
            }
            $(a).attr('href', h);
        });
        content.find('img, source').each((_, el) => {
            $(el).removeAttr('srcset').removeAttr('sizes');
            const v = $(el).attr('src');
            if (!v) return;
            const nv = unsize(relative(v));
            $(el).attr('src', nv);
            if (nv.startsWith('/content/images/')) images.add(nv);
        });
        const body = content.html().trim();
        const text = $('<div>').html(body.replace(/<\/(p|h[1-6]|li|pre|div|figure|figcaption|blockquote|tr|td)>/g, '$& ')).text().replace(/\s+/g, ' ').trim();
        const fm = {
            title,
            type: isPage ? 'page' : 'post',
            published_at: published ?? '2016-01-01T00:00:00.000Z',
            updated_at: modified ?? undefined,
            excerpt: excerpt || (text.length > 160 ? text.slice(0, 157).trimEnd() + '...' : text),
            tags,
            feature_image: featureImage,
            meta_title: metaTitle && metaTitle !== title ? metaTitle : null,
            meta_description: metaDesc,
            canonical_url: null,
            authors: [ld.author?.name ?? 'Mandeep Singh'],
            source: 'wayback',
            wayback_ts: cap.ts,
        };
        for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];
        await writeFile(path.join(outDir, `${slug}.md`), matter.stringify('\n' + body + '\n', fm));
        report.ok.push(slug);
        console.log(`ok       ${slug} (${cap.ts}, ${tags.length} tags${featureImage ? ', image' : ''})`);
    } catch (e) {
        report.failed.push(`${slug}: ${e.message}`);
        console.log(`FAILED   ${slug}: ${e.message}`);
    }
    await sleep(400);
}

if (!noImages) {
    for (const img of images) {
        const dst = path.join(root, 'public', img);
        try {
            await stat(dst);
            continue;
        } catch {}
        try {
            const cap = await latestCapture(`${SITE}${img}`);
            const buf = cap ? await get(`https://web.archive.org/web/${cap.ts}id_/${cap.original}`, 'buffer') : null;
            if (!buf) {
                console.log(`IMAGE MISSING ${img}`);
                continue;
            }
            await mkdir(path.dirname(dst), { recursive: true });
            await writeFile(dst, buf);
            console.log(`image    ${img} (${buf.length} bytes)`);
        } catch (e) {
            console.log(`IMAGE FAILED ${img}: ${e.message}`);
        }
        await sleep(400);
    }
}

console.log(`\nok ${report.ok.length}, missing ${report.missing.length}, failed ${report.failed.length}, images ${images.size}`);
if (report.missing.length) console.log('missing: ' + report.missing.join(', '));
if (report.failed.length) console.log('failed: ' + report.failed.join('; '));
