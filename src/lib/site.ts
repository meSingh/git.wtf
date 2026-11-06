import type { CollectionEntry } from 'astro:content';

export const SITE = {
    name: 'git.wtf',
    title: 'Days since the last Git fuck-up',
    description: 'One real Git fuck-up a day, retold deadpan. The counter resets when a new one lands.',
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

/** Newest first by the day it happened, then by publish date. */
export function sortIncidents(list: Incident[]): Incident[] {
    return [...list].sort((x, y) => {
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
    const out: string[] = [];
    const re = /[^.!?]+(?:[.!?]+["')\]]*|$)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(clean))) {
        const s = m[0].trim();
        if (s) out.push(s);
    }
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
