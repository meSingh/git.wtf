import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildRedirects } from './src/redirects.mjs';

// BASE_PATH is '' on git.wtf and '/git.wtf' on the project Pages URL before the custom domain is set.
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const { redirects, unmapped } = buildRedirects({ base });
if (unmapped.length) console.warn(`[redirects] ${unmapped.length} old paths have no mapping: ${unmapped.join(', ')}`);

export default defineConfig({
    site: 'https://git.wtf',
    base,
    trailingSlash: 'always',
    build: { format: 'directory', inlineStylesheets: 'always' },
    redirects,
    integrations: [
        sitemap({
            // labs, hero openings and the bare cutscene player are noindex; they stay out of the sitemap too
            filter: (page) => !/\/(lab|hero)\//.test(new URL(page).pathname) && !/\/incident\/[^/]+\/cut\/$/.test(new URL(page).pathname),
        }),
    ],
});
