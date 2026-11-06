import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

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
            h('div', { display: 'flex', fontFamily: 'Big Shoulders Display', fontSize: 40, color: PAPER, letterSpacing: 0.5 }, [h('div', {}, 'GIT.WTF'), h('div', { color: YELLOW }, '!?!')]),
            h('div', {}, 'one real Git fuck-up a day'),
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
