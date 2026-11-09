// The confession count, read once at build time from the issues labelled `confession`. No backend: if GitHub does
// not answer within a few seconds the count is left out of the page rather than shown wrong.
import { SITE } from './site';

let cached: Promise<number | null> | null = null;

export function confessionCount(): Promise<number | null> {
    if (cached) return cached;
    cached = (async () => {
        try {
            const url = `https://api.github.com/search/issues?q=${encodeURIComponent(`repo:${SITE.repo} is:issue label:confession`)}&per_page=1`;
            const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'git.wtf-build' };
            if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
            const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
            if (!res.ok) return null;
            const data = (await res.json()) as { total_count?: number };
            return typeof data.total_count === 'number' ? data.total_count : null;
        } catch {
            return null;
        }
    })();
    return cached;
}

const TEMPLATE = 'What I ran:\n\n\nWhat happened:\n\n\nA link, if there is one:\n';

export const confessIssueUrl = `https://github.com/${SITE.repo}/issues/new?template=confession.yml`;

export const confessMailto = SITE.confessEmail
    ? `mailto:${SITE.confessEmail}?subject=${encodeURIComponent('A Git fuck-up')}&body=${encodeURIComponent(TEMPLATE)}`
    : null;
