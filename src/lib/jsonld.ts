// Structured data (schema.org JSON-LD) for the page types, passed to Base through its `jsonld` prop.
// Archive posts: TechArticle, or HowTo when the post really is a list of steps. Incidents: Article, plus a
// VideoObject once the incident has a video. Every page: a BreadcrumbList. One @graph per page.
import { SITE, href } from './site';

const abs = (path: string) => new URL(path.startsWith('http') ? path : href(path), SITE.url).toString();
const text = (html: string) =>
    html
        .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&#x27;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

export const ORG = {
    '@type': 'Organization',
    '@id': `${SITE.url}/#org`,
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
    sameAs: [SITE.x, `https://github.com/${SITE.repo}`],
};
export const OWNER = { '@type': 'Person', '@id': `${SITE.url}/#owner`, name: SITE.owner.name, url: SITE.owner.url, sameAs: [SITE.owner.linkedin] };

function breadcrumbs(items: [string, string][]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
    };
}

/** Steps, only when a post really is a procedure: a "How to" post with an ordered list of three or more actions,
 *  or a post whose section headings are numbered "Step 1", "Step 2" and so on (just those headings). */
export function howToSteps(title: string, html: string): string[] | null {
    const steps = [...html.matchAll(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/gi)].map((m) => text(m[1])).filter((h) => /^step\s*\d+/i.test(h));
    if (steps.length >= 2) return steps;
    if (!/^how (to|do|can)\b/i.test(title)) return null;
    const lists = [...html.matchAll(/<ol[^>]*>([\s\S]*?)<\/ol>/gi)]
        .map((m) => [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => text(li[1])).filter((t) => t && !/^https?:\/\//.test(t)));
    const longest = lists.sort((a, b) => b.length - a.length)[0];
    return longest && longest.length >= 3 ? longest : null;
}

interface ArchiveData {
    title: string;
    type: 'post' | 'page';
    published_at: string;
    updated_at?: string;
    excerpt: string;
    tags: string[];
    feature_image: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    authors: string[];
    html: string;
}

export function archiveJsonLd(slug: string, d: ArchiveData) {
    const url = d.canonical_url ?? abs(`/${slug}/`);
    const description = clip(d.meta_description || d.excerpt || text(d.html), 300);
    const crumbs = breadcrumbs(d.type === 'post' ? [['git.wtf', '/'], ['Archive', '/archive/'], [d.title, `/${slug}/`]] : [['git.wtf', '/'], [d.title, `/${slug}/`]]);
    if (d.type !== 'post') {
        return { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': url, url, name: d.title, description, isPartOf: { '@id': `${SITE.url}/#site` }, publisher: { '@id': ORG['@id'] } }, crumbs, ORG] };
    }
    const author = d.authors[0] && d.authors[0] !== SITE.owner.name ? { '@type': 'Person', name: d.authors[0] } : { '@id': OWNER['@id'] };
    const steps = howToSteps(d.title, d.html);
    const common = {
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: url,
        name: d.title,
        description,
        datePublished: d.published_at,
        dateModified: d.updated_at ?? d.published_at,
        inLanguage: 'en',
        image: abs(`/og/${slug}.png`),
        author,
        publisher: { '@id': ORG['@id'] },
        keywords: d.tags.length ? d.tags.join(', ') : undefined,
        isAccessibleForFree: true,
    };
    const main = steps
        ? { '@type': 'HowTo', ...common, step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: clip(s, 110), text: clip(s, 500) })) }
        : { '@type': 'TechArticle', ...common, headline: clip(d.title, 110), proficiencyLevel: 'Beginner', dependencies: 'Git' };
    return { '@context': 'https://schema.org', '@graph': [main, crumbs, ORG, OWNER] };
}

interface IncidentData {
    title: string;
    date: string;
    status: string;
    source_url: string;
    source_date: string;
    category: string;
}

export function incidentJsonLd(path: string, d: IncidentData, opts: { image: string; video?: { url: string; poster: string } | null; summary?: string }) {
    const url = abs(path);
    const description = clip(opts.summary ? text(opts.summary) : `Status: ${d.status}`, 300);
    const article = {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: clip(d.title, 110),
        description,
        url,
        mainEntityOfPage: url,
        datePublished: d.date,
        dateModified: d.date,
        inLanguage: 'en',
        image: abs(opts.image),
        author: { '@id': OWNER['@id'] },
        publisher: { '@id': ORG['@id'] },
        articleSection: d.category,
        citation: d.source_url,
        about: { '@type': 'Event', name: d.title, startDate: d.source_date, url: d.source_url },
        isAccessibleForFree: true,
    };
    const graph: Record<string, unknown>[] = [article, breadcrumbs([['git.wtf', '/'], ['Incidents', '/incidents/'], [d.title, path]]), ORG, OWNER];
    if (opts.video) {
        graph.push({
            '@type': 'VideoObject',
            '@id': `${url}#video`,
            name: d.title,
            description,
            uploadDate: d.date,
            thumbnailUrl: abs(opts.video.poster),
            contentUrl: abs(opts.video.url),
            embedUrl: url,
            publisher: { '@id': ORG['@id'] },
        });
        (article as Record<string, unknown>).video = { '@id': `${url}#video` };
    }
    return { '@context': 'https://schema.org', '@graph': graph };
}
