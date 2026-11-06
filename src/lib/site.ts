import type { CollectionEntry } from 'astro:content';

export const SITE = {
    name: 'git.wtf',
    title: 'DAYS SINCE THE LAST GIT FUCK-UP',
    description: 'One real Git fuck-up a day, retold deadpan. The counter resets when a new one lands.',
    url: 'https://git.wtf',
    twitter: '@gitwtf',
    owner: { name: 'Mandeep Singh', url: 'https://www.msingh.com', linkedin: 'https://www.linkedin.com/in/mesingh9' },
};

export const TZ = 'Asia/Kolkata';

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

export function sortIncidents(list: Incident[]): Incident[] {
    return [...list].sort((x, y) => (x.data.date < y.data.date ? 1 : x.data.date > y.data.date ? -1 : x.id < y.id ? 1 : -1));
}

export function incidentPath(i: Incident): string {
    return `/incident/${i.id}/`;
}

export function formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d));
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
