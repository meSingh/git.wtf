import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LOGO } from './logo-data';

const YELLOW = '#FFD400';
const BLACK = '#0A0A0A';
const PAPER = '#F2F0EA';
const GREY = '#8A877F';

type FontSet = { display: ArrayBuffer; mono: ArrayBuffer };
let fonts: FontSet | null = null;
async function loadFonts(): Promise<FontSet> {
    if (fonts) return fonts;
    const read = async (p: string) => {
        const buf = await readFile(path.join(process.cwd(), 'node_modules', p));
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    };
    fonts = {
        display: await read('@fontsource/big-shoulders-display/files/big-shoulders-display-latin-900-normal.woff'),
        mono: await read('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff'),
    };
    return fonts;
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO.viewBox}"><path fill="#FFD400" d="${LOGO.bar}"/><path fill="#F2F0EA" d="${LOGO.word}"/><path fill="#FFD400" d="${LOGO.trio}"/></svg>`;
const LOGO_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString('base64')}`;


function flap(d: string, dim: boolean) {
    const digit = (top: boolean) =>
        h('div', { position: 'absolute', left: 0, right: 0, top: top ? 0 : -100, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 168, color: dim ? 'rgba(255,212,0,0.3)' : YELLOW, fontFamily: 'Big Shoulders Display' }, d);
    return h('div', { position: 'relative', width: 140, height: 200, display: 'flex' }, [
        h('div', { position: 'absolute', left: 0, right: 0, top: 0, height: 100, overflow: 'hidden', background: '#1b1b1b', borderRadius: '8px 8px 0 0', display: 'flex' }, [digit(true)]),
        h('div', { position: 'absolute', left: 0, right: 0, top: 100, height: 100, overflow: 'hidden', background: '#121212', borderRadius: '0 0 8px 8px', display: 'flex' }, [digit(false)]),
        h('div', { position: 'absolute', left: 0, right: 0, top: 98, height: 4, background: BLACK }),
    ]);
}

function stripes() {
    const cells = [];
    for (let i = 0; i < 60; i++) cells.push(h('div', { width: 40, height: 60, background: i % 2 ? BLACK : YELLOW, transform: 'skewX(-45deg)' }));
    return h('div', { position: 'absolute', left: -40, right: -40, bottom: 0, height: 18, display: 'flex', overflow: 'hidden' }, cells);
}

/** 1200x630 share card: the sign at its number, the incident title, the status. */
export async function shareImage(opts: { title: string; status: string; days?: number; date?: string }): Promise<Uint8Array> {
    const svg = await shareSvg(opts);
    return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

/** The share card as SVG (what the PNG is rendered from). */
export async function shareSvg(opts: { title: string; status: string; days?: number; date?: string }): Promise<string> {
    const f = await loadFonts();
    const n = Math.max(0, opts.days ?? 0);
    const digits = String(n).padStart(2, '0').split('');
    const firstNonZero = digits.findIndex((d) => d !== '0');
    const title = opts.title.length > 64 ? opts.title.slice(0, 61).trimEnd() + '...' : opts.title;
    const status = opts.status.replace(/`/g, '');
    // satori sizes the content box, so width and height leave room for the padding: 1200 x 630 overall.
    const tree = h('div', { width: 1088, height: 544, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: BLACK, color: PAPER, padding: '40px 56px 46px', position: 'relative', overflow: 'hidden' }, [
        h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
            h('div', { fontFamily: 'Big Shoulders Display', fontSize: 44, letterSpacing: 1, color: PAPER }, 'DAYS SINCE THE LAST GIT FUCK-UP'),
            h('div', { fontFamily: 'JetBrains Mono', fontSize: 22, color: GREY }, opts.date ?? ''),
        ]),
        h('div', { display: 'flex', alignItems: 'center', gap: 44, height: 340 }, [
            h('div', { display: 'flex', gap: 10, padding: 12, background: '#0e0e0e', border: `2px solid rgba(242,240,234,0.12)` }, digits.map((d, i) => flap(d, firstNonZero === -1 ? i < digits.length - 1 : i < firstNonZero))),
            h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }, [
                h('div', { fontFamily: 'Big Shoulders Display', fontSize: 72, lineHeight: 0.95, textTransform: 'uppercase', color: PAPER }, title),
                h('div', { display: 'flex', marginTop: 24 }, [
                    h('div', { fontFamily: 'Big Shoulders Display', fontSize: 34, lineHeight: 1, color: YELLOW, border: `5px solid ${YELLOW}`, padding: '10px 16px', transform: 'rotate(-2deg)', textTransform: 'uppercase', letterSpacing: 1, maxWidth: 820 }, `Status: ${status}`),
                ]),
            ]),
        ]),
        h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 24, color: GREY, height: 44 }, [
            { type: 'img', props: { src: LOGO_URI, height: 44, width: Math.round((44 * LOGO.width) / LOGO.height), style: { display: 'flex' } } },
            h('div', {}, "AI killed our blog. We're keeping score."),
        ]),
        stripes(),
    ]);
    return satori(tree as any, {
        width: 1200,
        height: 630,
        fonts: [
            { name: 'Big Shoulders Display', data: f.display, weight: 900, style: 'normal' },
            { name: 'JetBrains Mono', data: f.mono, weight: 600, style: 'normal' },
        ],
    });
}

/** The page card: the share image for every page that is not an incident (archive posts, the archive, the lists).
 *  Text first: the kind of page on a yellow plate, the page's title large, a status stamp with the page's joke and a
 *  line under it, then the mark and the live count along the bottom, over the hazard stripes. */
export interface PageCard { kind: string; title: string; stamp: string; line?: string; days: number }

export async function pageCardSvg(c: PageCard): Promise<string> {
    const f = await loadFonts();
    const title = c.title.length > 110 ? c.title.slice(0, 107).trimEnd() + '...' : c.title;
    const size = title.length <= 26 ? 118 : title.length <= 44 ? 96 : title.length <= 70 ? 78 : 64;
    const digits = String(Math.max(0, c.days)).padStart(2, '0').split('');
    const tile = (d: string) => h('div', { width: 46, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#161616', borderRadius: 5, fontFamily: 'Big Shoulders Display', fontSize: 54, color: YELLOW }, d);
    const tree = h('div', { width: 1088, height: 544, display: 'flex', flexDirection: 'column', background: BLACK, color: PAPER, padding: '40px 56px 46px', position: 'relative', overflow: 'hidden' }, [
        h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
            { type: 'img', props: { src: LOGO_URI, height: 46, width: Math.round((46 * LOGO.width) / LOGO.height), style: { display: 'flex' } } },
            h('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 3, color: BLACK, background: YELLOW, padding: '8px 14px', textTransform: 'uppercase' }, c.kind),
        ]),
        h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }, [
            h('div', { fontFamily: 'Big Shoulders Display', fontSize: size, lineHeight: 0.94, textTransform: 'uppercase', color: PAPER, maxWidth: 1060 }, title),
            h('div', { display: 'flex', alignItems: 'center', gap: 26, marginTop: 30 }, [
                h('div', { display: 'flex', fontFamily: 'Big Shoulders Display', fontSize: 34, lineHeight: 1, color: YELLOW, border: `5px solid ${YELLOW}`, padding: '9px 16px', transform: 'rotate(-2deg)', textTransform: 'uppercase', letterSpacing: 1 }, `Status: ${c.stamp}`),
                c.line ? h('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 23, color: GREY, maxWidth: 560 }, c.line) : h('div', { display: 'flex' }, ''),
            ]),
        ]),
        h('div', { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, height: 62 }, [
            h('div', { display: 'flex', gap: 5 }, digits.map(tile)),
            h('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 21, color: GREY, width: 300, lineHeight: 1.25 }, 'days since the last Git or AI fuck-up'),
        ]),
        stripes(),
    ]);
    return satori(tree as any, {
        width: 1200,
        height: 630,
        fonts: [
            { name: 'Big Shoulders Display', data: f.display, weight: 900, style: 'normal' },
            { name: 'JetBrains Mono', data: f.mono, weight: 600, style: 'normal' },
        ],
    });
}

export async function pageCard(c: PageCard): Promise<Uint8Array> {
    return new Resvg(await pageCardSvg(c), { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
