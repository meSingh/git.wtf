import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildRedirects } from './src/redirects.mjs';
import { hiddenIncidentIds, liveCategories } from './src/lib/visibility.mjs';

// BASE_PATH is '' on git.wtf and '/git.wtf' on the project Pages URL before the custom domain is set.
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const { redirects, unmapped } = buildRedirects({ base });
const hidden = hiddenIncidentIds();
const categories = liveCategories();
if (unmapped.length) console.warn(`[redirects] ${unmapped.length} old paths have no mapping: ${unmapped.join(', ')}`);

export default defineConfig({
    site: 'https://git.wtf',
    base,
    trailingSlash: 'always',
    build: { format: 'directory', inlineStylesheets: 'always' },
    redirects,
    integrations: [
        sitemap({
            // labs, hero openings, the cutscene player routes, the footer's cast partial, hidden incidents and empty categories stay out of the sitemap
            filter: (page) => {
                const p = new URL(page).pathname;
                if (/\/(lab|hero)\//.test(p) || /\/incident\/[^/]+\/cut\//.test(p) || p === '/foot-cast/') return false;
                const m = p.match(/\/incident\/([^/]+)\//);
                if (m && hidden.has(m[1])) return false;
                const c = p.match(/\/incidents\/([^/]+)\/$/);
                return !(c && !categories.has(c[1]));
            },
        }),
    ],
});
