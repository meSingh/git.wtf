import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildRedirects } from './src/redirects.mjs';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { hiddenIncidentIds, lastModified, liveCategories, publishedIncidentIds } from './src/lib/visibility.mjs';

// BASE_PATH is '' on git.wtf and '/git.wtf' on the project Pages URL before the custom domain is set.
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const { redirects, unmapped } = buildRedirects({ base });
const hidden = hiddenIncidentIds();
const categories = liveCategories();
const modified = lastModified();
const preview = process.env.RECORD_PREVIEW === '1';
if (unmapped.length) console.warn(`[redirects] ${unmapped.length} old paths have no mapping: ${unmapped.join(', ')}`);

export default defineConfig({
    site: 'https://git.wtf',
    base,
    // both /archive and /archive/ work: GitHub Pages redirects the first to the second, and the dev server serves both
    trailingSlash: 'ignore',
    build: { format: 'directory', inlineStylesheets: 'always' },
    redirects,
    integrations: [
        sitemap({
            // labs, hero openings, the cutscene player routes, the footer's cast partial, hidden incidents and empty categories stay out of the sitemap
            filter: (page) => {
                const p = new URL(page).pathname;
                if (/\/(lab|hero)\//.test(p) || /\/incident\/[^/]+\/cut\//.test(p) || p === '/foot-cast/') return false;
                // /feed/ and /rss/ are redirect pages to /rss.xml
                if (p === '/feed/' || p === '/rss/') return false;
                const m = p.match(/\/incident\/([^/]+)\//);
                if (m && hidden.has(m[1])) return false;
                const c = p.match(/\/incidents\/([^/]+)\/$/);
                return !(c && !categories.has(c[1]));
            },
            serialize: (item) => {
                const p = new URL(item.url).pathname.replace(/^\/git\.wtf/, '');
                const d = modified.get(p);
                return d ? { ...item, lastmod: d } : item;
            },
        }),
        {
            // a launch build carries the strips of published incidents only: hidden ones (and leftovers of renamed ones)
            // stay out, so their addresses are not public before they are
            name: 'gitwtf-hidden-strips',
            hooks: {
                'astro:build:done': ({ dir }) => {
                    if (preview) return;
                    const strips = new URL('strips/', dir);
                    if (!existsSync(strips)) return;
                    const keep = publishedIncidentIds();
                    for (const id of readdirSync(strips)) if (!keep.has(id)) rmSync(new URL(`${id}/`, strips), { recursive: true, force: true });
                },
            },
        },
    ],
});
