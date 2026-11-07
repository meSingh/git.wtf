// Syntax highlighting for the archive's code blocks, at build time (Shiki, no script on the page). Ghost wrote the
// blocks as <pre><code class="language-x">; every one in the archive is shell, so a block without a language is
// read as bash. Each block gets a bar with its language and the copy buttons (wired by scripts/code-copy.ts).
import { createHighlighter, type Highlighter } from 'shiki';

let hl: Promise<Highlighter> | null = null;
const highlighter = () => (hl ??= createHighlighter({ themes: ['vitesse-dark'], langs: ['bash', 'python', 'javascript', 'json', 'yaml', 'diff', 'ini'] }));

const ALIAS: Record<string, string> = { shell: 'bash', sh: 'bash', zsh: 'bash', console: 'bash', js: 'javascript', py: 'python', yml: 'yaml' };
const LABEL: Record<string, string> = { bash: 'shell', javascript: 'js', python: 'python' };
const decode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The commands alone: prompts dropped, and in a block with prompts, the output lines too; comments and blanks go. */
export function commandsOf(code: string): string | null {
    const lines = code.replace(/\n+$/, '').split('\n');
    const prompted = lines.some((l) => /^\s*\$ /.test(l));
    const hasComment = lines.some((l) => /^\s*#(?!!)/.test(l));
    if (!prompted && !hasComment) return null;
    const out = lines
        .filter((l) => (prompted ? /^\s*\$ /.test(l) : true))
        .map((l) => l.replace(/^\s*\$ /, ''))
        .filter((l) => l.trim() && !/^\s*#(?!!)/.test(l));
    const s = out.join('\n');
    return s && s !== code.trim() ? s : null;
}

export async function highlightHtml(html: string): Promise<string> {
    if (!html.includes('<pre')) return html;
    const h = await highlighter();
    const loaded = new Set(h.getLoadedLanguages());
    return html.replace(/<pre><code(?: class="language-([\w+-]+)")?>([\s\S]*?)<\/code><\/pre>/g, (_, raw: string | undefined, body: string) => {
        const code = decode(body).replace(/\n+$/, '');
        const want = ALIAS[raw ?? ''] ?? raw ?? 'bash';
        const lang = loaded.has(want) ? want : 'text';
        const pre = h.codeToHtml(code, { lang, theme: 'vitesse-dark' });
        const cmds = lang === 'bash' ? commandsOf(code) : null;
        const label = LABEL[lang] ?? (lang === 'text' ? 'code' : lang);
        return `<div class="code"><div class="code-bar"><span class="code-lang">${label}</span><span class="code-acts" hidden><button type="button" class="code-copy" data-copy="${attr(code)}">Copy</button>${cmds ? `<button type="button" class="code-copy" data-copy="${attr(cmds)}">Copy commands</button>` : ''}</span></div>${pre}</div>`;
    });
}
