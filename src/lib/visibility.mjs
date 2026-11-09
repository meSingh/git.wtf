// Which incidents are hidden, read straight from the front matter so astro.config (the sitemap filter) and the
// pages agree. Launch rule (Mandeep, 7 Nov): one incident is published, the rest stay hidden. An incident is
// hidden when its front matter has `published: false`, `draft: true` or `hidden: true`.
// Plain JS so astro.config.mjs can import it.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// the site folder: astro runs there, and once Vite bundles this file import.meta.url no longer points into src/
const root = process.cwd();

export function isHiddenData(data = {}) {
    return data.published === false || data.draft === true || data.hidden === true;
}

/** Categories with at least one published incident (an empty category page stays out of the sitemap). */
export function liveCategories() {
    return new Set(readAll().filter((x) => !x.hidden).map((x) => x.data.category).filter(Boolean));
}

export function publishedIncidentIds() {
    return new Set(readAll().filter((x) => !x.hidden).map((x) => x.id));
}

/** Hidden incidents the dev preview opens for review (GITWTF_SHOW_INCIDENTS): their pages work, but the homepage
 *  leaves them out, so it always shows what the live site would. */
export function previewIncidentIds() {
    return new Set(readAll().filter((x) => x.preview).map((x) => x.id));
}

export function hiddenIncidentIds() {
    return new Set(readAll().filter((x) => x.hidden).map((x) => x.id));
}

/** Last-modified dates for the sitemap: archive entries by updated_at (else published_at), incidents by date. */
export function lastModified() {
    const out = new Map();
    for (const x of readAll()) if (x.data.date) out.set(`/incident/${x.id}/`, new Date(x.data.date).toISOString());
    const adir = path.join(root, process.env.GITWTF_FIXTURE === '1' ? 'tests/fixtures/archive' : 'archive');
    let files = [];
    try { files = readdirSync(adir).filter((f) => f.endsWith('.md')); } catch { return out; }
    for (const f of files) {
        try {
            const { data } = matter(readFileSync(path.join(adir, f), 'utf8'));
            const d = data.updated_at || data.published_at;
            if (d) out.set(`/${f.replace(/\.md$/, '')}/`, new Date(d).toISOString());
        } catch { /* skip */ }
    }
    return out;
}

function readAll() {
    const dir = path.join(root, process.env.GITWTF_FIXTURE === '1' ? 'tests/fixtures/incidents' : 'incidents');
    let files = [];
    try {
        files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    } catch {
        return [];
    }
    // GITWTF_HIDE_INCIDENTS=id,id or GITWTF_ONLY_INCIDENTS=id,id: preview a launch set without editing front matter
    const hide = new Set((process.env.GITWTF_HIDE_INCIDENTS || '').split(',').map((x) => x.trim()).filter(Boolean));
    const only = new Set((process.env.GITWTF_ONLY_INCIDENTS || '').split(',').map((x) => x.trim()).filter(Boolean));
    // GITWTF_SHOW_INCIDENTS=id,id (the dev preview only): lift `published: false` on these, to review drafts in place
    const show = new Set((process.env.GITWTF_SHOW_INCIDENTS || '').split(',').map((x) => x.trim()).filter(Boolean));
    const out = [];
    for (const f of files) {
        const id = f.replace(/\.md$/, '');
        let data = {};
        try {
            data = matter(readFileSync(path.join(dir, f), 'utf8')).data;
        } catch {
            /* a file that does not parse is the build's problem, not the filter's */
        }
        out.push({ id, data, hidden: hide.has(id) || (only.size > 0 && !only.has(id)) || (isHiddenData(data) && !show.has(id)), preview: isHiddenData(data) && show.has(id) });
    }
    return out;
}
