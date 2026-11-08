import type { CollectionEntry } from 'astro:content';
import { hiddenIncidentIds, previewIncidentIds } from './visibility.mjs';

// Launch rule (Mandeep, 7 Nov): one incident is published, the rest stay hidden (`published: false`, `draft: true`
// or `hidden: true` in the front matter, or the GITWTF_ONLY_INCIDENTS / GITWTF_HIDE_INCIDENTS preview). Read once.
const HIDDEN = hiddenIncidentIds();
/** Whether an incident is published (not hidden by its front matter or the preview variables). */
export function isPublished(i: Incident): boolean {
    return !HIDDEN.has(i.id);
}
const PREVIEW = previewIncidentIds();
/** Whether an incident is really published, not just opened for review in the dev preview (homepage lists use this). */
export function isLive(i: Incident): boolean {
    return isPublished(i) && !PREVIEW.has(i.id);
}
/** The incidents the site shows: the published ones. */
export function published(list: Incident[]): Incident[] {
    return list.filter(isPublished);
}

export const SITE = {
    name: 'git.wtf',
    title: 'Days since the last Git and AI fuck-up',
    // The hero line, spelt out for screen readers and labels (Content, notes/content/homepage-v5-copy.md).
    line: 'Days since the last Git and AI fuck-up',
    // the same line as the hero's giant words; GIT & AI stays one word on the wheel (Mandeep, 8 Nov 2026: "Git and AI", not "or")
    lineWords: ['DAYS', 'SINCE', 'THE', 'LAST', 'GIT & AI', 'FUCK-UP'],
    // The credit line, his exact words; the emphasised parts are marked by the footer.
    credit: { name: 'Mandeep Singh', before: 'an ', strong: 'AI Architect', after: " who reviews his agents' commits. ", last: '“Mostly.”' },
    // The project's own accounts, from this one list; all four show (Mandeep, v6). X is real. The other three are
    // X and LinkedIn (a showcase page) are live. Instagram and YouTube are PLACEHOLDER URLs until he creates them (social session, 8 Nov 2026).
    social: [
        { name: 'Instagram', url: 'https://www.instagram.com/gitwtf', placeholder: true },
        { name: 'YouTube Shorts', url: 'https://www.youtube.com/@gitwtf/shorts', placeholder: true },
        { name: 'X', url: 'https://x.com/gitwtf' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/showcase/gitwtf/' },
    ] as { name: string; url: string; placeholder?: boolean }[],
    // Google Analytics, through the Tag Manager container the Ghost site used (the same property, so the history
    // carries on). Loaded only on the real site, after the page has finished loading.
    gtm: 'GTM-PPTBFGT',
    // the score's line, as it was
    tagline: "AI killed our blog. We're keeping score.",
    description: "A running count of the days since the last Git and AI fuck-up, each new one retold as an anime episode. Plus the old git.wtf blog on fixing Git, kept as it was.",
    repo: 'meSingh/git.wtf',
    // where a mailed confession goes; empty until Mandeep names an address, and the mail link stays hidden till then
    confessEmail: '',
    url: 'https://git.wtf',
    twitter: '@gitwtf',
    x: 'https://x.com/gitwtf',
    owner: { name: 'Mandeep Singh', url: 'https://www.msingh.com', linkedin: 'https://www.linkedin.com/in/mesingh9' },
};

export const TZ = 'Asia/Kolkata';

/** Site-relative href with the deploy base (empty on git.wtf, /git.wtf on the project Pages URL). */
export function href(path: string): string {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    return path.startsWith('/') ? base + path : path;
}

/** Today's calendar date in IST as YYYY-MM-DD. */
export function todayIST(now = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Whole days between two YYYY-MM-DD dates (b - a). */
export function daysBetween(a: string, b: string): number {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

export type Incident = CollectionEntry<'incidents'>;

/** The day the fuck-up happened. The counter, the gaps and the timeline all count from this. */
export function happened(i: Incident): string {
    return i.data.source_date;
}

/** The published incidents, newest first by the day it happened, then by publish date (all of them with `all`). */
export function sortIncidents(list: Incident[], all = false): Incident[] {
    return (all ? [...list] : published(list)).sort((x, y) => {
        const a = happened(x), b = happened(y);
        if (a !== b) return a < b ? 1 : -1;
        if (x.data.date !== y.data.date) return x.data.date < y.data.date ? 1 : -1;
        return x.id < y.id ? 1 : -1;
    });
}

export function daysSince(list: Incident[], today = todayIST()): number | null {
    const latest = sortIncidents(list)[0];
    return latest ? Math.max(0, daysBetween(happened(latest), today)) : null;
}

export function incidentPath(i: Incident): string {
    return `/incident/${i.id}/`;
}

export function formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d));
}

export function formatDay(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d));
}

export function sourceHost(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

/** Escapes html, then turns `code` spans into <code>. For status lines and titles written in the house voice. */
export function inlineCode(text: string): string {
    const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Splits a retelling into sentences for the scroll-typed card. Keeps the punctuation with its sentence. */
export function sentences(text: string): string[] {
    const clean = text.replace(/\s+/g, ' ').trim();
    // a full stop inside a `code` span (git checkout -- .) never ends a sentence
    const out: string[] = [];
    let cur = '';
    let inCode = false;
    for (let i = 0; i < clean.length; i++) {
        const c = clean[i];
        cur += c;
        if (c === '`') inCode = !inCode;
        if (!inCode && /[.!?]/.test(c)) {
            while (i + 1 < clean.length && /[.!?"')\]]/.test(clean[i + 1])) cur += clean[++i];
            if (i + 1 >= clean.length || clean[i + 1] === ' ') {
                out.push(cur.trim());
                cur = '';
            }
        }
    }
    if (cur.trim()) out.push(cur.trim());
    return out.length ? out : [clean];
}

/** How a category reads on the page. The slugs are Content's (VOICE.md). */
export const CATEGORY_LABELS: Record<string, string> = {
    'force-push': 'force-push',
    'reset-hard': 'reset --hard',
    'deleted-tests': 'deleted the tests',
    'committed-secret': 'committed a secret',
    'renamed-main': 'renamed main',
    'pr-flood': 'PR flood',
    'kept-both': 'kept both sides',
    'commit-message': 'the commit message',
    'pushed-to-main': 'pushed to main',
    'history-rewrite': 'rewrote history',
    'wiped-worktree': 'wiped the worktree',
    github: 'GitHub itself',
    'off-script': 'went off script',
};

export function categoryLabel(slug: string): string {
    return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, ' ');
}

/** Digits for a split-flap display: at least `min` cells, zero padded. */
export function flapDigits(n: number | null, min = 2): string[] {
    if (n === null) return Array(min).fill('-');
    const s = String(Math.max(0, Math.floor(n)));
    return s.padStart(min, '0').split('');
}

/** How a tool reads on the page and on the scoreboard. */
export const TOOL_LABELS: Record<string, string> = {
    'claude-code': 'Claude Code',
    codex: 'Codex',
    cursor: 'Cursor',
    custom: 'a home-made loop',
    human: 'a human',
    github: 'GitHub',
    openai: 'OpenAI',
    anthropic: 'Anthropic',
};

export function toolLabel(slug: string | undefined): string | null {
    return slug ? TOOL_LABELS[slug] ?? slug : null;
}
