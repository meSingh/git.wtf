import type { APIRoute } from 'astro';

// The old Ghost sitemaps. Each now points crawlers at the real one.
export function getStaticPaths() {
    return ['sitemap', 'sitemap-posts', 'sitemap-pages', 'sitemap-tags', 'sitemap-authors'].map((legacy) => ({ params: { legacy } }));
}

export const GET: APIRoute = ({ site }) => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const loc = new URL(`${base}/sitemap-0.xml`, site ?? 'https://git.wtf').toString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${loc}</loc></sitemap></sitemapindex>\n`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
