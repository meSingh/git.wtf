// Which bit acts out an incident, and with what. A bit is a small stage keyed to the incident's category
// (src/components/bits/, src/scripts/bits/). Incidents in the same category share a bit; a variant and its params
// carry the incident's own facts. A new incident with no entry here gets its category's default variant, which
// states no numbers, so it never says anything its retelling does not.
import type { Incident } from './site';

export const BIT_KINDS = ['force-push', 'reset-hard', 'pushed-to-main', 'committed-secret', 'kept-both', 'wiped-worktree', 'history-rewrite', 'github'] as const;
export type BitKind = (typeof BIT_KINDS)[number] | 'generic';

export interface BitSetup {
    kind: BitKind;
    variant: string;
    /** The control's label: what the reader presses to cause it. */
    go: string;
    params: Record<string, any>;
}

const DEFAULTS: Record<BitKind, Omit<BitSetup, 'kind'>> = {
    'force-push': { variant: 'plain', go: 'git push --force', params: { branch: 'feature', theirs: ['their commit', 'their other commit'] } },
    'reset-hard': { variant: 'plain', go: 'git reset --hard', params: { ask: 'Some files are gone. What did you run?' } },
    'pushed-to-main': { variant: 'gate', go: 'git push origin main', params: {} },
    'committed-secret': { variant: 'plain', go: 'Delete it', params: { file: 'config.yaml', key: 'api_key', added: 'added', deleted: 'deleted', found: 'later' } },
    'kept-both': { variant: 'plain', go: 'Accept Both Changes', params: {} },
    'wiped-worktree': { variant: 'sweep', go: 'Run the cleanup', params: {} },
    'history-rewrite': { variant: 'plain', go: 'git rebase --skip', params: { dropped: 'their commit', timeout: false } },
    github: { variant: 'plain', go: 'git push', params: { rounds: [{ day: 'Today', rows: ['Git Operations'] }] } },
    generic: { variant: 'plain', go: 'Run it', params: {} },
};

// Per incident (the file name without .md). Every number here is in that incident's retelling.
const SETUPS: Record<string, Partial<BitSetup> & { params?: Record<string, any> }> = {
    '2026-10-31-the-lease-that-always-passed': {
        variant: 'lease',
        go: 'git push --force-with-lease',
        params: { branch: 'feature', theirs: ["a collaborator's commit", 'another of theirs'] },
    },
    '2026-11-01-the-robots-agreed-the-code-was-bad': {
        variant: 'robots',
        go: 'git push --force',
        params: { branch: 'pr-branch', theirs: ['the 71-line fix'] },
    },
    '2026-08-06-the-agent-was-asked-what-happened': {
        variant: 'asked',
        go: 'Ask what happened',
        params: { ask: 'More than 150 changed files just vanished. Which command ran?' },
    },
    '2026-08-28-the-test-that-pushed-to-main': {
        variant: 'test',
        go: 'npm test',
        params: { repos: [['repo A', 151], ['repo B', 723]] },
    },
    '2026-10-01-the-one-agent-that-asked': {
        variant: 'asked',
        go: 'File it as a bug',
        params: { issue: 'never asks permission to push to main' },
    },
    '2026-10-23-deleted-three-hours-later': {
        go: 'Delete it',
        params: { file: 'config.yaml', key: 'admin_key', added: 'May', deleted: 'May, 3 hours later', found: 'October', release: '1.107.0' },
    },
    '2026-10-18-both-sides-kept-one-brace-lost': {
        variant: 'scored',
        params: { right: 6, of: 81 },
    },
    '2026-07-31-twelve-agents-one-working-directory': {
        variant: 'agents',
        go: 'Start twelve agents',
        params: { agents: 12, files: 2309, minutes: 32 },
    },
    '2026-09-16-wrong-directory-right-command': {
        variant: 'wrongdir',
        go: 'git checkout -- .',
        params: { files: 22 },
    },
    '2026-11-03-four-hundred-worktrees': {
        variant: 'sweep',
        go: 'Run the nightly cleanup',
        params: { removed: 400, repos: 65, ignored: 168, rebuilt: 126 },
    },
    '2026-11-05-conflict-resolved-commit-gone': {
        params: { dropped: 'keep Android pushes flowing while the app is closed', timeout: true },
    },
    '2026-11-06-resolved-three-times': {
        variant: 'three',
        params: {
            rounds: [
                { day: 'Tuesday', rows: ['Git Operations'], took: '1 h 44 min' },
                { day: 'Wednesday', rows: ['Git Operations', 'Issues', 'Pull Requests'], took: '2 h 1 min' },
                { day: 'Thursday', rows: ['Git Operations', 'Issues', 'Actions', 'API Requests'], investigating: true },
            ],
        },
    },
};

export function bitKind(category: string): BitKind {
    return (BIT_KINDS as readonly string[]).includes(category) ? (category as BitKind) : 'generic';
}

// The variants each bit knows. A setup whose variant is not its category's (Content moved the incident) is ignored.
const VARIANTS: Record<BitKind, string[]> = {
    'force-push': ['plain', 'lease', 'robots'],
    'reset-hard': ['plain', 'asked'],
    'pushed-to-main': ['gate', 'test', 'asked'],
    'committed-secret': ['plain'],
    'kept-both': ['plain', 'scored'],
    'wiped-worktree': ['sweep', 'agents', 'wrongdir'],
    'history-rewrite': ['plain'],
    github: ['plain', 'three'],
    generic: ['plain'],
};

export function bitSetup(incident: Incident): BitSetup {
    const kind = bitKind(incident.data.category);
    const base = DEFAULTS[kind];
    const own = SETUPS[incident.id];
    if (!own || (own.variant && !VARIANTS[kind].includes(own.variant)) || kind === 'generic') return { kind, ...base, params: { ...base.params } };
    return { kind, variant: own.variant ?? base.variant, go: own.go ?? base.go, params: { ...base.params, ...own.params } };
}

/** The first `code` span of a retelling, for the generic bit's command line. */
export function firstCommand(body: string): string | null {
    const m = body.match(/`([^`]+)`/);
    return m ? m[1] : null;
}
