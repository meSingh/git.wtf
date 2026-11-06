import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://git.wtf',
    trailingSlash: 'always',
    build: { format: 'directory' },
    integrations: [sitemap()],
});
