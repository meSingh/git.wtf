import { defineMiddleware } from 'astro:middleware';

// Every link to another site, on every page (components, incidents and the archive's own HTML alike), opens in a
// new tab, carries rel="noopener noreferrer" (any rel it had, such as nofollow, stays) and a ref=git.wtf in its
// query, so the other end can tell where the visit came from. Runs on each page as it is built, and in dev.
const OURS = /^(?:www\.)?git\.wtf$|^localhost$|^127\.0\.0\.1$/;

export function externalLinks(html: string): string {
    return html.replace(/<a\b([^>]*?)\bhref="(https?:\/\/[^"]+)"([^>]*)>/gi, (tag, pre: string, href: string, post: string) => {
        let host = '';
        try { host = new URL(href.replace(/&amp;/g, '&')).hostname; } catch { return tag; }
        if (OURS.test(host)) return tag;
        let attrs = `${pre}${post}`;
        // ref=git.wtf, ahead of any #fragment, unless the link already has one
        let url = href;
        if (!/[?&](amp;)?ref=/.test(url)) {
            const [base, hash] = url.split('#');
            url = `${base}${base.includes('?') ? '&amp;' : '?'}ref=git.wtf${hash !== undefined ? `#${hash}` : ''}`;
        }
        const rel = attrs.match(/\brel="([^"]*)"/i);
        const tokens = new Set([...(rel?.[1].split(/\s+/).filter(Boolean) ?? []), 'noopener', 'noreferrer']);
        attrs = rel ? attrs.replace(rel[0], `rel="${[...tokens].join(' ')}"`) : `${attrs} rel="${[...tokens].join(' ')}"`;
        if (!/\btarget=/i.test(attrs)) attrs += ' target="_blank"';
        return `<a${attrs.replace(/\s+$/, '')} href="${url}">`;
    });
}

export const onRequest = defineMiddleware(async (_ctx, next) => {
    const res = await next();
    if (!(res.headers.get('content-type') ?? '').includes('text/html')) return res;
    const html = await res.text();
    return new Response(externalLinks(html), { status: res.status, statusText: res.statusText, headers: res.headers });
});
