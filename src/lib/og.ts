import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const YELLOW = '#F5C400';
const BLACK = '#111111';

let fontData: ArrayBuffer | null = null;
async function font(): Promise<ArrayBuffer> {
    if (!fontData) {
        // Read from the project root: at build time this module runs from dist/, so import.meta.url is no use.
        const buf = await readFile(path.join(process.cwd(), 'public/fonts/Anton-Regular.ttf'));
        fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    }
    return fontData;
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** 1200x630 share card: the yellow sign at 0, the incident title, the status line. */
export async function shareImage(opts: { title: string; status: string; days?: number; date?: string }): Promise<Uint8Array> {
    const days = String(opts.days ?? 0);
    const tree = h(
        'div',
        { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: BLACK, color: '#f2f2f2', fontFamily: 'Anton', padding: 48 },
        [
            h('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', background: YELLOW, color: BLACK, border: `14px solid ${BLACK}`, outline: `6px solid ${YELLOW}`, padding: '18px 36px', borderRadius: 6 }, [
                h('div', { fontSize: 40, letterSpacing: 2, textTransform: 'uppercase' }, 'Days since the last Git fuck-up'),
                h('div', { fontSize: 170, lineHeight: 1, marginTop: 6 }, days),
            ]),
            h('div', { display: 'flex', flexDirection: 'column', marginTop: 40, flexGrow: 1, justifyContent: 'center' }, [
                h('div', { fontSize: 56, lineHeight: 1.1, textTransform: 'uppercase' }, opts.title),
                h('div', { fontSize: 32, marginTop: 20, color: YELLOW }, `Status: ${opts.status}`),
            ]),
            h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#9a9a9a' }, [
                h('div', {}, 'git.wtf'),
                h('div', {}, opts.date ?? ''),
            ]),
        ],
    );
    const svg = await satori(tree as any, {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Anton', data: await font(), weight: 400, style: 'normal' }],
    });
    return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
