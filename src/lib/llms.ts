// llms.txt and llms-full.txt (https://llmstxt.org): what git.wtf is, for AI answer engines, built from the
// incidents and the archive at build time. The summary text is Content's (notes/content/launch-copy.md); until it
// lands, LLMS_COPY holds a plain placeholder that only states facts already on the site.
import { getCollection } from 'astro:content';
import { SITE, href, incidentPath, sortIncidents } from './site';

export const LLMS_COPY = {
    // PLACEHOLDER until Content's launch copy lands; replace both strings with notes/content/launch-copy.md
    summary: `${SITE.title}. ${SITE.description}`,
    about:
        'git.wtf logs public incidents where Git went wrong, most of them caused by AI coding agents, each with its date, source link and status, and counts the days since the last one. It also keeps its older archive of short answers to common Git problems.',
};

export const abs = (path: string) => new URL(href(path), SITE.url).toString();

/** Post html to readable plain text with markdown-ish structure: headings, lists, code blocks and link text. */
export function htmlToText(html: string): string {
    const ent = (s: string) =>
        s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');
    const blocks: string[] = [];
    let s = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
        blocks.push('```\n' + ent(code.replace(/<[^>]+>/g, '')).replace(/\n+$/, '') + '\n```');
        return `\n\n@@CODE${blocks.length - 1}@@\n\n`;
    });
    s = s
        .replace(/<(script|style|figure)[\s\S]*?<\/\1>/gi, '')
        .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(Math.min(6, Number(n) + 1))} ${t}\n\n`)
        .replace(/<li[^>]*>/gi, '\n- ')
        .replace(/<\/(p|div|ul|ol|blockquote|table|tr)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
        .replace(/<[^>]+>/g, '');
    s = ent(s)
        .replace(/[ \t]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    return s.replace(/@@CODE(\d+)@@/g, (_, i) => blocks[Number(i)]);
}

export async function llmsData() {
    const incidents = sortIncidents(await getCollection('incidents')).filter((i) => !i.data.fixture);
    const archive = (await getCollection('archive')).sort((a, b) => (a.data.published_at < b.data.published_at ? 1 : -1));
    return { incidents, posts: archive.filter((p) => p.data.type === 'post'), pages: archive.filter((p) => p.data.type === 'page') };
}

const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

export async function llmsTxt(): Promise<string> {
    const { incidents, posts, pages } = await llmsData();
    const out: string[] = [];
    out.push(`# ${SITE.name}`, '', `> ${oneLine(LLMS_COPY.summary)}`, '', oneLine(LLMS_COPY.about), '');
    out.push('## Key pages', '');
    out.push(`- [Home](${abs('/')}): the day count since the last incident and today's incident`);
    out.push(`- [Incidents](${abs('/incidents/')}): every logged incident, newest first`);
    out.push(`- [Archive](${abs('/archive/')}): the older Git answers, one per page`);
    out.push(`- [Full text for language models](${abs('/llms-full.txt')}): every incident and archive answer as plain text`);
    out.push('');
    out.push('## Incidents', '');
    for (const i of incidents) out.push(`- [${oneLine(i.data.title)}](${abs(incidentPath(i))}): ${i.data.source_date}. Status: ${oneLine(i.data.status)}`);
    out.push('');
    out.push('## Archive: Git answers', '');
    for (const p of posts) {
        const ex = oneLine(p.data.meta_description || p.data.excerpt || '');
        out.push(`- [${oneLine(p.data.title)}](${abs(`/${p.id}/`)})${ex ? `: ${ex.length > 160 ? ex.slice(0, 159).replace(/\s+\S*$/, '') + '…' : ex}` : ''}`);
    }
    out.push('');
    out.push('## Optional', '');
    for (const p of pages) out.push(`- [${oneLine(p.data.title)}](${abs(`/${p.id}/`)})`);
    out.push(`- [RSS feed](${abs('/rss.xml')})`, `- [Sitemap](${abs('/sitemap-index.xml')})`, `- [Source code](https://github.com/${SITE.repo})`);
    return out.join('\n') + '\n';
}

export async function llmsFullTxt(): Promise<string> {
    const { incidents, posts } = await llmsData();
    const out: string[] = [];
    out.push(`# ${SITE.name}`, '', `> ${oneLine(LLMS_COPY.summary)}`, '', oneLine(LLMS_COPY.about), '');
    out.push('# Incidents', '');
    for (const i of incidents) {
        out.push(`## ${oneLine(i.data.title)}`, '');
        out.push(`URL: ${abs(incidentPath(i))}`, `Happened: ${i.data.source_date}`, `Logged: ${i.data.date}`, `Status: ${oneLine(i.data.status)}`, `Source: ${i.data.source_url}`, '');
        if (i.body) out.push(i.body.trim(), '');
    }
    out.push('# Archive: Git answers', '');
    for (const p of posts) {
        out.push(`## ${oneLine(p.data.title)}`, '');
        out.push(`URL: ${abs(`/${p.id}/`)}`, `Published: ${p.data.published_at.slice(0, 10)}`);
        if (p.data.updated_at) out.push(`Updated: ${p.data.updated_at.slice(0, 10)}`);
        if (p.data.tags.length) out.push(`Tags: ${p.data.tags.join(', ')}`);
        out.push('', htmlToText(p.data.html), '');
    }
    return out.join('\n') + '\n';
}
