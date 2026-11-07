// The anime cutscene's engine. One shot on screen at a time; each shot plays its effects in order when it comes on,
// then holds (with small loops: steam, glints, lines) until the reader advances. Click, tap, space, enter, the
// arrow keys and the scroll wheel advance; a skip control jumps to the end card. With reduced motion the end card
// shows as a still, stamp down.
import gsap from 'gsap';
import type { Shot, ShotList } from '../anime/types';
import { CutAudio, type Cue } from './cut-audio';

type El = SVGGraphicsElement;

interface Ctx { tl: gsap.core.Timeline; g: El; shot: Shot; svg: SVGSVGElement; loops: gsap.core.Animation[] }

const q = (g: Element, s: string) => g.querySelector<El>(s);
/** The middle of the active frame (800 450 for 16:9, 450 800 for 9:16). */
let CENTRE = '800px 450px';
const qa = (g: Element, s: string) => Array.from(g.querySelectorAll<El>(s));

// ---------- the kit: one function per effect; each starts at `at` seconds into its shot ----------
type Fx = (c: Ctx, at: number) => void;
const figs = (g: Element, who?: string) => qa(g, who ? `.fig[data-who="${who}"]` : '.fig');
const role = (g: Element, r: string) => q(g, `.fig[data-role="${r}"]`);
const agentsOnly = (g: Element) => figs(g, 'agent').filter((f) => !f.querySelector('.extra'));

const FX: Record<string, Fx> = {
    titlecard({ tl, g, loops }) {
        const card = q(g, '.titlecard')!;
        tl.fromTo(q(card, '.band'), { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.25, ease: 'power3.out' }, 0);
        tl.fromTo(q(card, '.ep'), { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 0.2);
        tl.fromTo(q(card, '.ttl'), { autoAlpha: 0, scale: 1.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power4.in' }, 0.3);
        tl.fromTo(q(card, '.tl'), { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.15 }, 0.55);
        loops.push(gsap.to(q(card, '.tl'), { rotation: 3, transformOrigin: CENTRE, duration: 0.12, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    push({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { scale: 1, svgOrigin: focus(g) }, { scale: 1.12, duration: 2.6, ease: 'power1.inOut' }, at); },
    slowpush({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { scale: 1, svgOrigin: focus(g) }, { scale: 1.08, duration: 4.5, ease: 'sine.inOut' }, at); },
    devpush({ tl, g }, at) {
        const d = role(g, 'dev')!.parentElement!;
        const m = d.getAttribute('transform')!.match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;
        tl.to(q(g, '.cam'), { scale: 1.3, svgOrigin: `${m[1]} ${Number(m[2]) - 360}`, duration: 1.4, ease: 'power2.inOut' }, at);
    },
    zoom({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { scale: 1.6, svgOrigin: focus(g) }, { scale: 1, duration: 0.35, ease: 'power4.out' }, at); },
    shake({ tl, g }, at) {
        tl.to(q(g, '.cam'), { keyframes: [{ x: -18, y: 8 }, { x: 16, y: -10 }, { x: -10, y: 6 }, { x: 8, y: -4 }, { x: 0, y: 0 }], duration: 0.32, ease: 'none' }, at || 0.12);
    },
    whip({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { x: -1500 }, { x: 0, duration: 0.28, ease: 'power3.out' }, at); },
    spin({ tl, g }, at) {
        // the camera goes once round the ring of pointing arms
        tl.fromTo(q(g, '.cam'), { rotation: 0, scale: 1.7, svgOrigin: CENTRE.replace(/px/g, '') }, { rotation: 360, duration: 2.2, ease: 'power2.inOut' }, at);
        tl.to(q(g, '.cam'), { scale: 1, duration: 0.6, ease: 'power2.out' }, at + 2.0);
    },
    rise({ tl, g, loops }, at) {
        const sil = figs(g, 'agent').filter((f) => f.querySelector('.sil'));
        tl.fromTo(sil, { y: 160 }, { y: 0, duration: 1.1, ease: 'power2.out', stagger: 0.06 }, at);
        const gleams = sil.flatMap((f) => qa(f, '.gleam'));
        tl.fromTo(gleams, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.03 }, at + 0.9);
        loops.push(gsap.to(gleams, { opacity: 0.5, duration: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.05, paused: true }));
    },
    wind({ tl, g, loops }, at) {
        const p = q(g, '.paper1 .p-in');
        if (!p) return;
        tl.fromTo(p, { x: 0, rotation: 0 }, { x: 40, y: -20, rotation: 18, duration: 1.2, ease: 'sine.inOut' }, at);
        loops.push(gsap.to(p, { x: 70, y: -40, rotation: -14, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }));
    },
    copier({ g, loops }) {
        const beam = q(g, '.copier .beam');
        if (beam) loops.push(gsap.fromTo(beam, { y: 0, opacity: 1 }, { y: 120, opacity: 0.2, duration: 0.9, repeat: -1, ease: 'none', paused: true }));
        const held = q(g, '.fig[data-role="extra"] .held');
        if (held) loops.push(gsap.to(held, { y: -10, duration: 0.45, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }));
    },
    dash({ tl, g }, at) {
        agentsOnly(g).forEach((f, i) => tl.fromTo(f, { x: (i % 2 ? 900 : -900) }, { x: 0, duration: 0.32, ease: 'power4.out' }, at + i * 0.04));
    },
    blink({ tl, g }, at) {
        // "nothing personnel", three times: gone, and there again a step to the side
        const a = agentsOnly(g);
        const who = a.length > 2 ? [a[0], a[a.length - 1], a[Math.floor(a.length / 2)]] : a;
        who.forEach((f, i) => {
            const t = at + i * 0.18;
            tl.set(f, { autoAlpha: 0 }, t);
            tl.set(f, { autoAlpha: 1, x: (i % 2 ? -50 : 50) }, t + 0.09);
            tl.to(f, { x: 0, duration: 0.12, ease: 'power3.out' }, t + 0.1);
        });
    },
    behind({ tl, g }, at) {
        const t = role(g, 'thief');
        if (!t) return;
        tl.set(t, { autoAlpha: 0 }, 0);
        tl.set(t, { autoAlpha: 1 }, at);
        tl.fromTo(t, { x: -60, scale: 1.08, transformOrigin: '50% 100%' }, { x: 0, scale: 1, duration: 0.14, ease: 'power4.out' }, at);
    },
    impact({ tl, g, svg }, at) {
        // a flash, the silhouettes in black on yellow for three frames, then the picture back
        const flash = q(svg, '.flash')!;
        const bg = q(g, '.bg')!;
        tl.set(flash, { visibility: 'visible', fill: '#f2f0ea' }, at);
        tl.set(flash, { fill: '#ffd400' }, at + 0.05);
        tl.call(() => g.classList.add('silhouette'), [], at + 0.05);
        tl.set(flash, { visibility: 'hidden' }, at + 0.1);
        tl.set(bg, { fill: '#ffd400' }, at + 0.1);
        tl.call(() => g.classList.remove('silhouette'), [], at + 0.3);
        tl.set(bg, { clearProps: 'fill' }, at + 0.3);
        tl.to(q(g, '.cam'), { keyframes: [{ x: -24 }, { x: 20 }, { x: -12 }, { x: 0 }], duration: 0.24, ease: 'none' }, at + 0.1);
    },
    speedlines({ tl, g, loops }, at) {
        const lines = q(g, '.lines');
        if (!lines) return;
        tl.fromTo(lines, { autoAlpha: 0, scale: 1.3, transformOrigin: CENTRE }, { autoAlpha: 1, scale: 1, duration: 0.2 }, at);
        loops.push(gsap.to(lines, { rotation: 2, transformOrigin: CENTRE, duration: 0.08, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    extralines({ tl, g, loops }, at) {
        // for the first time, speed lines behind THE EXTRA
        const lines = q(g, '.lines');
        if (!lines) return;
        tl.set(lines, { autoAlpha: 0 }, 0);
        // centred on THE EXTRA, wherever the shot puts it
        const ex = role(g, 'extra')?.parentElement?.getAttribute('transform')?.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
        const o = ex ? `${ex[1]}px ${Number(ex[2]) - 360}px` : CENTRE;
        tl.fromTo(lines, { autoAlpha: 0, scale: 1.4, transformOrigin: o }, { autoAlpha: 0.9, scale: 1, duration: 0.25 }, at);
        loops.push(gsap.to(lines, { rotation: 1.5, transformOrigin: o, duration: 0.08, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    glint({ tl, g, loops }) {
        const gleams = qa(g, '.gleam');
        tl.fromTo(qa(g, '.panel'), { x: (i: number) => (i % 2 ? 900 : -900) }, { x: 0, duration: 0.28, ease: 'power4.out', stagger: 0.14 }, 0);
        // one after another, the third last
        qa(g, '.panel').forEach((p, i) => tl.fromTo(qa(p, '.gleam'), { scaleX: 0, transformOrigin: '50% 50%' }, { scaleX: 1, duration: 0.16, ease: 'back.out(3)' }, 0.6 + i * 0.35));
        loops.push(gsap.to(gleams, { opacity: 0.55, duration: 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.1, paused: true }));
        // speed lines behind each face, flickering
        const pl = qa(g, '.plines');
        tl.fromTo(pl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, stagger: 0.14 }, 0.2);
        loops.push(gsap.to(pl, { opacity: 0.6, duration: 0.07, repeat: -1, yoyo: true, ease: 'none', stagger: 0.03, paused: true }));
    },
    files({ tl, g }, at) {
        const files = qa(g, '.file');
        const [fx, fy] = (g.querySelector('.files')?.getAttribute('data-from') || '800 450').split(' ').map(Number);
        files.forEach((f, i) => {
            const a = -Math.PI / 2 + ((i * 2.399) % 2.6) - 1.3;
            const r = 500 + ((i * 97) % 600);
            tl.fromTo(f, { visibility: 'visible', x: fx, y: fy, scale: 0.3, rotation: 0 }, { x: fx + Math.cos(a) * r * 1.3, y: fy + Math.sin(a) * r * 0.8, scale: 1 + (i % 3) * 0.25, rotation: (i % 2 ? 1 : -1) * (180 + i * 20), duration: 1.4, ease: 'power2.out' }, at + Math.pow(i / files.length, 1.6) * 1.2);
        });
    },
    catch({ tl, g }, at) {
        const held = q(g, '.fig[data-role="extra"] .held');
        if (!held) return;
        tl.set(held, { autoAlpha: 0 }, 0);
        tl.fromTo(held, { autoAlpha: 1, y: -260, rotation: 160 }, { y: 0, rotation: 0, duration: 0.45, ease: 'bounce.out' }, at);
    },
    rain({ g, loops }) {
        const r = q(g, '.rain');
        if (r) loops.push(gsap.fromTo(r, { x: 0, y: -100 }, { x: -20, y: 0, duration: 0.35, repeat: -1, ease: 'none', paused: true }));
        // the rain starts at once, not after the shot settles
        loops.at(-1)?.play();
    },
    drift({ tl, g }) {
        // slow motion: one paper down into the mourner's hands
        const p = q(g, '.paper1 .p-in');
        const held = q(g, '.fig[data-role="mourner"] .held');
        if (!p) return;
        if (held) tl.set(held, { autoAlpha: 0 }, 0);
        tl.fromTo(p, { y: 0, x: 0, rotation: -20 }, { y: 520, duration: 2.2, ease: 'sine.inOut' }, 0);
        tl.to(p, { keyframes: [{ x: 60, rotation: 20 }, { x: -50, rotation: -18 }, { x: 30, rotation: 10 }, { x: -20, rotation: -6 }], duration: 2.2, ease: 'none' }, 0);
        tl.set(p, { autoAlpha: 0 }, 2.2);
        if (held) tl.set(held, { autoAlpha: 1 }, 2.2);
        const others = agentsOnly(g).filter((f) => f.getAttribute('data-role') !== 'mourner');
        tl.fromTo(others.map((f) => q(f, '.monitor')), { rotation: 0 }, { rotation: 10, transformOrigin: '50% 100%', duration: 1.2, ease: 'power2.inOut', stagger: 0.04 }, 1.0);
    },
    tear({ tl, g }, at) {
        const t = q(g, '.fig[data-role="mourner"] .tear') ?? q(g, '.tear');
        if (t) tl.fromTo(t, { visibility: 'visible', y: -10, opacity: 0 }, { y: 70, opacity: 1, duration: 1.4, ease: 'power1.in', immediateRender: false }, at || 0.4);
    },
    sweat({ tl, g }, at) {
        const drops = qa(g, '.sweat');
        tl.set(drops, { visibility: 'hidden' }, 0);
        tl.fromTo(drops, { visibility: 'visible', y: -30, scale: 0.4, transformOrigin: '50% 0%' }, { y: 0, scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.05, immediateRender: false }, at || 0.4);
        tl.to(drops, { y: 26, duration: 1.4, ease: 'power1.in' }, '>');
    },
    snap({ tl, g }, at) {
        const b = q(g, '.branch');
        if (!b) return;
        tl.to(qa(b, '.half.a'), { rotation: 35, x: 40, y: 120, transformOrigin: '50% 0%', duration: 0.5, ease: 'power2.in' }, at);
        tl.to(qa(b, '.half.b, .twig'), { rotation: -40, x: -60, y: 200, transformOrigin: '50% 100%', duration: 0.5, ease: 'power2.in' }, at);
        tl.to(b, { opacity: 0.45, duration: 0.3 }, at + 0.2);
        const thief = role(g, 'thief');
        if (thief) tl.fromTo(thief, { y: 0 }, { y: -20, duration: 0.08, yoyo: true, repeat: 1 }, at);
    },
    door() {},
    sip({ tl, g, loops }, at) {
        const d = role(g, 'dev');
        const mug = d && (q(d, '.v-init .m-mug') ?? q(d, '.mug'));
        if (!mug) return;
        // already at the mouth in the relieved pose: a long tilt back, then down
        tl.to(mug, { rotation: -14, transformOrigin: '50% 50%', duration: 0.9, ease: 'sine.inOut' }, at);
        tl.to(mug, { rotation: 0, duration: 0.5, ease: 'sine.inOut' }, at + 1.6);
        const steam = qa(d!, '.v-init .m-steam');
        if (steam.length) loops.push(gsap.fromTo(steam, { y: 0, opacity: 0.9 }, { y: -20, opacity: 0, duration: 1.2, repeat: -1, ease: 'sine.out', paused: true }));
    },
    turn({ tl, g }, at) {
        // all of them at once, eyes on
        const fs = agentsOnly(g).filter((f) => f.querySelector('.face-turn'));
        tl.to(fs, { scaleX: 0.86, transformOrigin: '50% 100%', duration: 0.08, yoyo: true, repeat: 1 }, at);
        tl.set(fs.map((f) => q(f, '.face-init')), { visibility: 'hidden' }, at + 0.08);
        tl.set(fs.map((f) => q(f, '.face-turn')), { visibility: 'visible' }, at + 0.08);
    },
    slide({ tl, g }, at) {
        const st = q(g, '.stack');
        if (!st) return;
        const [tx] = (st.getAttribute('data-to') || '').split(' ').map(Number);
        const x0 = Number(st.getAttribute('transform')!.match(/translate\(([-\d.]+)/)![1]);
        tl.fromTo(q(st, '.s-in'), { x: 0 }, { x: tx - x0, duration: 0.7, ease: 'power3.out' }, at);
        tl.to(q(st, '.s-in'), { keyframes: [{ rotation: -3 }, { rotation: 2 }, { rotation: 0 }], transformOrigin: '50% 100%', duration: 0.3 }, '>');
    },
    charge({ tl, g }, at) {
        agentsOnly(g).forEach((f, i) => tl.fromTo(f, { x: -700 }, { x: 0, duration: 0.55, ease: 'power2.in' }, at + i * 0.05));
    },
    bounce({ tl, g }, at) {
        // off the palm in a fan, and caught mid-air when the frame freezes
        agentsOnly(g).forEach((f, i) => tl.to(f, { x: -260 - i * 90, y: -220 - (i % 2) * 160, rotation: -40 - i * 25, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.out' }, at + i * 0.03));
    },
    stamp({ tl, g }, at) {
        // the scene dims and the stamp slams over it on its own, so it reads in one look
        const card = q(g, '.endcard')!;
        tl.set(q(card, '.stampmark'), { autoAlpha: 0 }, 0);
        tl.to(q(g, '.cam'), { filter: 'brightness(0.35)', duration: 0.25 }, at - 0.1);
        tl.fromTo(q(card, '.stampmark'), { autoAlpha: 0, scale: 3.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power4.in', immediateRender: false }, at);
        tl.to(q(g, '.cam'), { keyframes: [{ y: 12 }, { y: -6 }, { y: 0 }], duration: 0.18, ease: 'none' }, at + 0.25);
    },
    continued({ tl, g }, at) {
        // freeze frame, the arrow alone
        const card = q(g, '.endcard')!;
        tl.set(q(card, '.tbc-in'), { autoAlpha: 0 }, 0);
        tl.to(q(g, '.cam'), { filter: 'grayscale(1) contrast(1.2) brightness(0.5)', duration: 0.3 }, at);
        tl.fromTo(q(card, '.tbc-in'), { autoAlpha: 0, scale: 1.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power4.in', immediateRender: false }, at + 0.1);
        tl.to(q(g, '.cam'), { keyframes: [{ x: 10 }, { x: -6 }, { x: 0 }], duration: 0.16, ease: 'none' }, at + 0.4);
    },
    endcard({ tl, g }, at) {
        const card = q(g, '.endcard')!;
        const t = at || 1.6;
        // freeze frame: the picture drains, the arrow slides in, the stamp slams
        tl.to(q(g, '.cam'), { filter: 'grayscale(1) contrast(1.2) brightness(0.5)', duration: 0.3 }, t);
        tl.fromTo(q(card, '.tbc-in'), { x: -700 }, { x: 0, duration: 0.35, ease: 'power3.out' }, t + 0.2);
        tl.fromTo(q(card, '.stampmark'), { autoAlpha: 0, scale: 3.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power4.in' }, t + 0.8);
        tl.to(q(g, '.cam'), { keyframes: [{ y: 12 }, { y: -6 }, { y: 0 }], duration: 0.18, ease: 'none' }, '>');
    },
};

// ---------- the v2 kit (script v2: the twelve agents and the folder) ----------
/** A figure's place in the frame: where it stands and its scale (x carries the flip). */
function placeOf(el: Element) {
    const p = el.closest('.place') ?? el.parentElement!;
    const t = p.getAttribute('transform') || '';
    const m = t.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
    const s = t.match(/scale\(([-\d.]+)(?: ([-\d.]+))?\)/);
    const sx = s ? Number(s[1]) : 1, sy = s ? Number(s[2] ?? s[1]) : 1;
    return { x: m ? Number(m[1]) : 0, y: m ? Number(m[2]) : 0, sx, sy };
}
/** Where a prop group stands, from its translate. */
function at(el: Element | null) {
    const m = el?.getAttribute('transform')?.match(/translate\(([-\d.]+) ([-\d.]+)\)(?: scale\(([-\d.]+)\))?/);
    return m ? { x: Number(m[1]), y: Number(m[2]), s: Number(m[3] ?? 1) } : { x: 0, y: 0, s: 1 };
}
// how many times an effect has run in this shot's timeline (popup, ring and bonk count their calls)
const calls = new WeakMap<object, Record<string, number>>();
const nth = (tl: object, k: string) => { const m = calls.get(tl) ?? {}; const v = m[k] ?? 0; m[k] = v + 1; calls.set(tl, m); return v; };
const fxCount = (g: Element, name: string) => (JSON.parse((g as HTMLElement).dataset.fx || '[]') as string[]).filter((f) => f.split('@')[0] === name).length;
const dev = (g: Element) => q(g, '.fig[data-who="dev"]');
const agentN = (g: Element, n: number) => q(g, `.fig[data-who="agent"][data-n="${n}"]`);
const swap = (tl: gsap.core.Timeline, f: Element | null, t: number) => {
    if (!f) return;
    // display, not visibility: an effect may have set a child visible, and that would show through a hidden group
    tl.set(qa(f, ':scope > .v-init'), { display: 'none' }, t);
    tl.set(qa(f, ':scope > .v-turn'), { display: 'inline', visibility: 'visible' }, t);
};
const vertical = (g: Element) => (g.closest('svg') as SVGSVGElement | null)?.dataset.frame === '9:16';
/** A burst of stars over a point, made once per shot. */
function stars(g: Element, x: number, y: number, key: string) {
    let s = g.querySelector<El>(`.bonkstar[data-key="${key}"]`);
    if (!s) {
        s = document.createElementNS('http://www.w3.org/2000/svg', 'g') as unknown as El;
        s.setAttribute('class', 'bonkstar');
        s.setAttribute('data-key', key);
        s.setAttribute('transform', `translate(${x} ${y})`);
        s.setAttribute('style', 'visibility:hidden');
        s.innerHTML = '<g class="st-in"><path d="M0 -54 L14 -16 L54 -14 L22 10 L34 50 L0 26 L-34 50 L-22 10 L-54 -14 L-14 -16Z"/><path class="small" d="M70 -40 l8 18 l20 2 l-15 12 l5 20 l-18 -11 l-18 11 l5 -20 l-15 -12 l20 -2Z"/></g>';
        q(g, '.cam')!.appendChild(s);
    }
    return s;
}
function pop(tl: gsap.core.Timeline, s: El, t: number) {
    tl.fromTo(s, { visibility: 'visible', scale: 0.2, rotation: -20, opacity: 1, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 0.14, ease: 'back.out(3)', immediateRender: false }, t);
    tl.to(s, { opacity: 0, duration: 0.2 }, t + 0.32);
    tl.set(s, { visibility: 'hidden' }, t + 0.52);
}

Object.assign(FX, {
    titlerows({ tl, g, loops }: Ctx) {
        const rows = qa(g, '.trow');
        rows.forEach((r, k) => {
            const t = 0.1 + k * 0.22;
            tl.fromTo(q(r, '.band'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.16, ease: 'power3.out' }, t);
            tl.fromTo(q(r, '.ttl'), { autoAlpha: 0, scale: 1.7, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.16, ease: 'power4.in' }, t + 0.06);
        });
        const lines = q(g, '.titlerows .tl');
        tl.fromTo(lines, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.15 }, 0.6);
        loops.push(gsap.to(lines, { rotation: 3, transformOrigin: CENTRE, duration: 0.12, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    tiltdown({ tl, g }: Ctx) {
        // from the lamp down to the desk
        const l = at(q(g, '.lamp'));
        tl.fromTo(q(g, '.cam'), { scale: 1.9, svgOrigin: `${l.x} ${l.y}` }, { scale: 1, duration: 1.3, ease: 'power2.inOut' }, 0);
    },
    type({ tl, g }: Ctx, t: number) {
        const hands = qa(dev(g) ?? g, '.v-init .m-hand');
        if (hands.length) tl.fromTo(hands, { y: 0 }, { y: -12, duration: 0.11, repeat: 27, yoyo: true, ease: 'none', stagger: 0.06 }, t);
    },
    ring({ tl, g }: Ctx, t: number) {
        const pile = q(g, '.pile');
        if (!pile) return;
        const k = nth(tl, 'ring') + 1;
        const sheets = qa(pile, '.sheet');
        if (pile.dataset.grow === '1' && k === 1) tl.set(sheets.slice(1), { visibility: 'hidden' }, 0);
        const sheet = sheets[Math.min(k, sheets.length - 1)];
        const mug = q(pile, '.pmug');
        tl.set(sheet, { visibility: 'visible' }, t - 0.2);
        tl.fromTo(sheet, { y: -30 }, { y: 0, duration: 0.14, ease: 'power2.in', immediateRender: false }, t - 0.2);
        // the mug rests on the top sheet: up, then down onto the new one
        const rest = (n: number) => 74 - 18 * Math.min(n, sheets.length - 1);
        if (mug && k === 1) tl.set(mug, { y: rest(0) }, 0);
        if (mug) tl.to(mug, { keyframes: [{ y: rest(k) - 60, duration: 0.12, ease: 'power2.out' }, { y: rest(k), duration: 0.16, ease: 'power2.in', delay: 0.08 }] }, t - 0.1);
        tl.fromTo(q(sheet, '.ring'), { opacity: 0 }, { opacity: 0.85, duration: 0.1, immediateRender: false }, t + 0.05);
    },
    tick({ tl, g }: Ctx, t: number) {
        const c = q(g, '.counter');
        if (!c || c.dataset.value) return;
        // the word that lands when the count stops
        const after = q(g, '.counter-after');
        if (after) tl.fromTo(after, { visibility: 'visible', scale: 2.2, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power4.in', immediateRender: false }, t + 2.4);
        // tweened on the element itself (not in onUpdate), so a seek with events off still shows the number
        tl.fromTo(c, { textContent: Number(c.dataset.from || 0) }, { textContent: Number(c.dataset.to || 0), duration: 2.4, ease: 'power1.in', modifiers: { textContent: (v: number) => Math.round(v).toLocaleString('en-GB') }, immediateRender: false }, t);
    },
    yawn({ tl, g }: Ctx, t: number) {
        const y = q(dev(g) ?? g, '.v-init .m-yawn');
        if (!y) return;
        tl.fromTo(y, { visibility: 'visible', scaleY: 0.2, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, t);
        tl.to(y, { scaleY: 0.2, duration: 0.25 }, t + 0.8);
        tl.set(y, { visibility: 'hidden' }, t + 1.05);
    },
    note({ tl, g }: Ctx, t: number) {
        const n = q(g, '.note .n-in');
        if (n) tl.fromTo(n, { visibility: 'visible', scale: 1.9, rotation: -16, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -4, opacity: 1, duration: 0.16, ease: 'power4.in', immediateRender: false }, t);
        if (n) tl.set(n, { visibility: 'hidden' }, 0);
    },
    popup({ tl, g }: Ctx, t: number) {
        // the rows come up from behind the desk, the front row first
        const ag = agentsOnly(g);
        const k = nth(tl, 'popup');
        const total = fxCount(g, 'popup');
        if (k === 0) tl.set(ag, { autoAlpha: 0 }, 0);
        if (ag.some((f) => f.dataset.role === 'stack')) {
            // towers: each pop raises one column from behind the desk, the bottom agent first, the top one landing last
            const xs = [...new Set(ag.map((f) => Number(f.dataset.x)))].sort((a, b) => a - b);
            const mine = k < total - 1 ? [xs[k]] : xs.slice(k);
            mine.forEach((x, j) => {
                const col = ag.filter((f) => Number(f.dataset.x) === x).sort((a, b) => Number(b.dataset.y) - Number(a.dataset.y));
                const tt = t + j * 0.18;
                col.forEach((f, i) => { const p = placeOf(f); tl.fromTo(f, { autoAlpha: 0, y: (300 + i * 120) / p.sy }, { autoAlpha: 1, y: 0, duration: 0.3 + i * 0.06, ease: 'back.out(1.6)', immediateRender: false }, tt + i * 0.05); });
                tl.to(col, { keyframes: [{ x: -4 }, { x: 4 }, { x: 0 }], duration: 0.3, ease: 'none' }, tt + 0.4);
            });
            return;
        }
        const ys = [...new Set(ag.map((f) => Number(f.dataset.y)))].sort((a, b) => b - a);
        const mine = k < total - 1 ? [ys[k]] : ys.slice(k);
        mine.forEach((y, j) => {
            const row = ag.filter((f) => Number(f.dataset.y) === y);
            tl.fromTo(row, { autoAlpha: 0, y: 260 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'back.out(2)', stagger: 0.04, immediateRender: false }, t + j * 0.18);
        });
    },
    salute({ tl, g }: Ctx, t: number) {
        const ag = agentsOnly(g).sort((a, b) => Number(b.dataset.y) - Number(a.dataset.y));
        const arms = ag.map((f) => q(f, '.arm-salute')).filter(Boolean) as El[];
        tl.set(arms, { rotation: 140, transformOrigin: '0% 100%' }, 0);
        tl.to(arms, { rotation: 0, duration: 0.12, ease: 'power4.out', stagger: 0.035 }, t);
    },
    exit({ tl, g }: Ctx, t: number) {
        const d = dev(g);
        if (!d) return;
        swap(tl, d, t);
        const p = placeOf(d);
        tl.to(d, { x: 900 / p.sx, duration: 1.1, ease: 'power1.in' }, t);
        tl.to(d, { keyframes: [{ y: -12 }, { y: 0 }, { y: -12 }, { y: 0 }], duration: 1.1, ease: 'none' }, t);
    },
    exitdown({ tl, g }: Ctx, t: number) {
        const d = dev(g);
        if (!d) return;
        swap(tl, d, t);
        const p = placeOf(d);
        tl.to(d, { y: 700 / p.sy, scale: 1.25, transformOrigin: '50% 100%', duration: 1.0, ease: 'power1.in' }, t);
    },
    door({ tl, g }: Ctx, t: number) {
        const d = q(g, '.door');
        const leaf = q(g, '.door .leaf');
        if (!d || !leaf) return;
        const opens = d.dataset.start === 'closed';
        tl.fromTo(leaf, { scaleX: opens ? 1 : 0.12, transformOrigin: '0% 50%' }, { scaleX: opens ? 0.12 : 1, duration: opens ? 0.35 : 0.14, ease: opens ? 'power2.out' : 'power4.in' }, t);
    },
    glintdown(c: Ctx, t: number) { FX.glint(c, t); },
    speedlinesdown(c: Ctx, t: number) {
        const s = q(c.g, '.streaks');
        if (s) c.tl.fromTo(s, { autoAlpha: 0.9, y: -500 }, { y: 500, duration: 0.3, repeat: 9, ease: 'none' }, t);
        FX.speedlines(c, t);
    },
    fall({ tl, g }: Ctx, t: number) {
        const s = q(g, '.streaks');
        if (s) tl.fromTo(s, { autoAlpha: 0.9, y: -500 }, { y: 500, duration: 0.3, repeat: 6, ease: 'none' }, t);
        agentsOnly(g).forEach((f, i) => {
            const p = placeOf(f);
            tl.fromTo(f, { y: -(p.y + 500) / p.sy, rotation: 0 }, { y: 0, rotation: 180, transformOrigin: '50% 60%', duration: 0.32, ease: 'power2.in' }, t + i * 0.07);
        });
    },
    dive({ tl, g }: Ctx, t: number) {
        const fo = at(q(g, '.folder'));
        agentsOnly(g).forEach((f, i) => {
            const p = placeOf(f);
            tl.to(f, { x: (fo.x - p.x) / p.sx, y: (fo.y - 60 * fo.s - p.y) / p.sy + 300, rotation: 180, scale: 0.3, transformOrigin: '50% 60%', duration: 0.3, ease: 'power2.in' }, t + i * 0.1);
            tl.set(f, { autoAlpha: 0 }, t + i * 0.1 + 0.3);
        });
    },
    squeeze({ tl, g }: Ctx, t: number) {
        const f = q(g, '.folder .f-in');
        if (!f) return;
        for (let k = 0; k < 6; k++) tl.to(f, { scaleX: 1.08 + k * 0.02, scaleY: 1.12 + k * 0.03, transformOrigin: '50% 100%', duration: 0.05, yoyo: true, repeat: 1, ease: 'power1.out' }, t + k * 0.1);
        tl.to(f, { keyframes: [{ rotation: -4 }, { rotation: 4 }, { rotation: -2 }, { rotation: 0 }], transformOrigin: '50% 100%', duration: 0.5, ease: 'none' }, t + 0.7);
    },
    scribble({ tl, g }: Ctx, t: number) {
        const a = agentN(g, 2);
        const l = a && q(a, '.held .lines');
        if (l) tl.fromTo(l, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.45, ease: 'none' }, t);
        if (a) tl.to(a, { keyframes: [{ x: -6 }, { x: 6 }, { x: -6 }, { x: 0 }], duration: 0.45, ease: 'none' }, t);
    },
    erase({ tl, g }: Ctx, t: number) {
        const a = agentN(g, 2), e = agentN(g, 9);
        const l = a && q(a, '.held .lines');
        if (e) tl.to(e, { keyframes: [{ x: -14 }, { x: 14 }, { x: -14 }, { x: 14 }, { x: 0 }], duration: 0.36, ease: 'none' }, t);
        if (l) tl.to(l, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.3, ease: 'power1.in' }, t + 0.05);
    },
    file({ tl, g }: Ctx, t: number) {
        const a = agentN(g, 4);
        const h = a && q(a, '.held');
        if (h) tl.to(h, { y: 160, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, t);
    },
    unfile({ tl, g }: Ctx, t: number) {
        const a = agentN(g, 4), b = agentN(g, 8);
        const h = a && q(a, '.held');
        if (b) tl.to(b, { keyframes: [{ x: 30 }, { x: 0 }], duration: 0.2 }, t);
        if (h) tl.to(h, { y: 0, autoAlpha: 1, duration: 0.16, ease: 'back.out(3)' }, t + 0.05);
    },
    bonk({ tl, g }: Ctx, t: number) {
        const k = nth(tl, 'bonk');
        const gate = q(g, '.gate');
        if (gate) {
            // the gate arm comes down on whoever is first in the queue
            const arm = q(gate, '.arm')!;
            const ga = at(gate);
            const queue = agentsOnly(g).sort((a, b) => Math.hypot(placeOf(a).x - ga.x, placeOf(a).y - ga.y) - Math.hypot(placeOf(b).x - ga.x, placeOf(b).y - ga.y));
            const f = queue[k % queue.length];
            tl.to(arm, { keyframes: [{ rotation: -38, duration: 0.07 }, { rotation: 14, duration: 0.06, ease: 'power4.in' }, { rotation: 0, duration: 0.12 }], transformOrigin: '0% 50%' }, t - 0.13);
            if (f) {
                const p = placeOf(f);
                tl.to(f, { keyframes: [{ scaleY: 0.72, scaleX: 1.12, duration: 0.05 }, { scaleY: 1, scaleX: 1, duration: 0.18, ease: 'back.out(3)' }], transformOrigin: '50% 100%' }, t);
                pop(tl, stars(g, p.x, p.y - 566 * Math.abs(p.sy) - 30, `b${k}`), t);
            }
            return;
        }
        const e = agentN(g, 9) ?? agentsOnly(g)[0];
        if (!e) return;
        const p = placeOf(e);
        tl.to(e, { keyframes: [{ y: 30, duration: 0.05 }, { y: 0, duration: 0.15, ease: 'back.out(3)' }] }, t);
        pop(tl, stars(g, p.x, p.y - 566 * Math.abs(p.sy) - 20, `b${k}`), t);
    },
    sweep({ tl, g }: Ctx, t: number) {
        const sw = role(g, 'sweeper');
        const b = sw && q(sw, '.broom');
        if (b) tl.to(b, { keyframes: [{ rotation: 40, duration: 0.12 }, { rotation: -70, duration: 0.14, ease: 'power4.in' }, { rotation: 0, duration: 0.4 }], transformOrigin: '30% 40%' }, t);
        const box = q(g, '.box .b-in');
        const up = vertical(g) || fxCount(g, 'sweepup') > 0;
        if (box) tl.to(box, { x: up ? 120 : 1100, y: up ? -900 : -260, rotation: up ? 380 : 260, duration: 0.5, ease: 'power2.in' }, t + 0.12);
        const hero = role(g, 'hero');
        if (hero) tl.to(hero, { keyframes: [{ x: -40, rotation: -8 }, { x: 0, rotation: 0 }], transformOrigin: '50% 100%', duration: 0.5 }, t + 0.1);
    },
    sweepup(c: Ctx, t: number) { FX.sweep(c, t); },
    filesup(c: Ctx, t: number) { blizzard(c, t, -Math.PI / 2, 1.1); },
    restore(c: Ctx, t: number) { gather(c, t, -0.4); },
    restoreup(c: Ctx, t: number) { gather(c, t, Math.PI / 2); },
    lift({ tl, g }: Ctx, t: number) {
        const m = role(g, 'mourner');
        const h = m && q(m, '.held');
        if (h) tl.to(h, { y: -70, duration: 0.7, ease: 'power2.out' }, t);
        const others = agentsOnly(g).filter((f) => f.dataset.role !== 'mourner');
        tl.to(others.map((f) => q(f, '.monitor')), { rotation: 12, transformOrigin: '50% 100%', duration: 1.2, ease: 'power2.inOut', stagger: 0.03 }, t);
    },
    limp({ tl, g }: Ctx, t: number) {
        const m = role(g, 'mourner');
        const s = m && q(m, '.held');
        if (s) tl.to(s, { skewX: 24, scaleY: 0.7, y: -30, transformOrigin: '50% 0%', duration: 0.8, ease: 'power2.in' }, t);
    },
    enter({ tl, g }: Ctx, t: number) {
        const d = dev(g);
        if (!d) return;
        const p = placeOf(d), door = at(q(g, '.door'));
        tl.fromTo(d, { autoAlpha: 0, x: (door.x - p.x) / p.sx, scale: 0.9, transformOrigin: '50% 100%' }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, t);
    },
    climb({ tl, g }: Ctx, t: number) {
        agentsOnly(g).forEach((f, i) => {
            const p = placeOf(f);
            tl.fromTo(f, { y: 160 / p.sy, rotation: -6 }, { y: 0, rotation: 0, transformOrigin: '50% 100%', duration: 0.5, ease: 'power2.out' }, t + i * 0.12);
        });
    },
    freeze({ tl, g }: Ctx, t: number) {
        tl.to(agentsOnly(g), { x: '+=6', duration: 0.04, yoyo: true, repeat: 3, ease: 'none' }, t);
    },
    terror({ tl, g }: Ctx, t: number) {
        const d = dev(g);
        swap(tl, d, t);
        if (d) tl.to(d, { keyframes: [{ scale: 1.05 }, { scale: 1 }], transformOrigin: '50% 60%', duration: 0.16 }, t);
    },
    drop({ tl, g }: Ctx, t: number) {
        const m = q(g, '.pmugfall');
        const mg = m && q(m, '.mg');
        if (!m || !mg) return;
        const a = at(m);
        const floor = vertical(g) ? 1560 : 1100;
        tl.to(mg, { y: (floor - a.y) / a.s, rotation: 220, duration: 0.6, ease: 'power2.in' }, t);
        tl.set(q(m, '.shards'), { y: (floor - a.y) / a.s }, 0);
    },
    followdown({ tl, g }: Ctx, t: number) {
        tl.to(q(g, '.cam'), { y: -560, duration: 0.6, ease: 'power2.in' }, t);
    },
    cutup({ tl, g }: Ctx, t: number) { tl.set(q(g, '.cam'), { y: 0 }, t); },
    shatter({ tl, g }: Ctx, t: number) {
        const m = q(g, '.pmugfall');
        if (!m) return;
        tl.set(q(m, '.mg'), { visibility: 'hidden' }, t);
        const sh = q(m, '.shards')!;
        tl.set(sh, { visibility: 'visible' }, t);
        tl.fromTo(qa(sh, 'path'), { x: 0, y: 0, scale: 0.4 }, { x: (k: number) => [-90, 80, -30, 120, -130][k], y: (k: number) => [-60, -80, -110, -30, -20][k], scale: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, t);
        tl.fromTo(q(sh, '.spill'), { scaleX: 0, transformOrigin: '50% 50%' }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, t);
        tl.to(q(g, '.cam'), { keyframes: [{ x: -14 }, { x: 12 }, { x: 0 }], duration: 0.18, ease: 'none' }, t);
    },
    jab({ tl, g }: Ctx, t: number) {
        const arms = agentsOnly(g).map((f) => q(f, '.arm-point')).filter(Boolean) as El[];
        tl.to(arms, { keyframes: [{ scaleX: 1.22, duration: 0.08 }, { scaleX: 1, duration: 0.16 }], transformOrigin: '0% 50%', stagger: 0.02 }, t);
    },
    ringspin({ tl, g }: Ctx, t: number) {
        const r = q(g, '.ring');
        if (!r) return;
        tl.to(r, { rotation: 360, transformOrigin: '50% 50%', duration: 1.7, ease: 'power2.inOut' }, t);
        tl.to(agentsOnly(g), { rotation: -360, transformOrigin: '50% 60%', duration: 1.7, ease: 'power2.inOut' }, t);
    },
    cough({ tl, g }: Ctx, t: number) {
        figs(g).filter((f) => f.dataset.role !== 'extra').forEach((f) => { const p = placeOf(f); tl.to(f, { y: 14 / p.sy, duration: 0.12, yoyo: true, repeat: 1 }, t); });
    },
    grow({ tl, g }: Ctx, t: number) {
        const st = q(g, '.stack');
        if (!st) return;
        const [a, b] = (st.dataset.grow || '120 180').split(' ').map(Number);
        const slabs = qa(st, '.slab');
        const n0 = Math.max(1, Math.round(a / 22));
        const rest = slabs.slice(n0);
        tl.set(rest, { visibility: 'hidden' }, 0);
        const dur = 2.2;
        rest.forEach((s, k) => tl.set(s, { visibility: 'visible' }, t + Math.pow((k + 1) / rest.length, 0.8) * dur));
        const top = q(st, '.top');
        if (top) tl.fromTo(top, { y: (slabs.length - n0) * 22 }, { y: 0, duration: dur, ease: 'power1.in' }, t);
        void b;
    },
    tiltup({ tl, g }: Ctx, t: number) {
        const cam = q(g, '.cam')!;
        const ex = role(g, 'extra');
        if (q(g, '.stack') && ex) {
            // from the smallest one up the stack to DEV's face
            const p = placeOf(ex);
            tl.fromTo(cam, { scale: 1.7, svgOrigin: `${p.x} ${p.y - 200}` }, { scale: 1, duration: 2.4, ease: 'power2.inOut' }, t);
            return;
        }
        const w = at(q(g, '.farwindow'));
        tl.to(cam, { scale: 1.35, svgOrigin: `${w.x} ${w.y}`, duration: 0.9, ease: 'power2.inOut' }, t);
    },
    gatedrop({ tl, g }: Ctx, t: number) {
        const gi = q(g, '.gate .g-in');
        if (!gi) return;
        const a = at(q(g, '.gate'));
        tl.fromTo(gi, { y: -(a.y + 600) / a.s }, { y: 0, duration: 0.22, ease: 'power4.in' }, t);
        tl.to(gi, { keyframes: [{ y: -30 }, { y: 0 }], duration: 0.2, ease: 'power2.out' }, t + 0.22);
    },
    tiptoe({ tl, g, loops }: Ctx) {
        const v = vertical(g);
        agentsOnly(g).forEach((f, i) => {
            const p = placeOf(f);
            tl.fromTo(f, { x: v ? 0 : 260 / p.sx, y: v ? 260 / p.sy : 0 }, { x: 0, y: 0, duration: 0.75, ease: 'power1.out' }, i * 0.05);
            tl.to(f, { keyframes: [{ y: -14 / p.sy }, { y: 0 }, { y: -14 / p.sy }, { y: 0 }], duration: 0.75, ease: 'none' }, i * 0.05);
        });
        const z = qa(g, '.m-zzz text');
        if (z.length) loops.push(gsap.to(z, { y: -20, opacity: 0.4, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3, paused: true }));
        if (z.length) tl.to(z, { y: -20, duration: 0.9, repeat: 3, yoyo: true, ease: 'sine.inOut', stagger: 0.3 }, 0);
    },
    angry({ tl, g }: Ctx, t: number) {
        const d = dev(g);
        if (!d) return;
        tl.set(qa(d, ':scope > .v-init, :scope > .v-turn'), { display: 'none' }, t);
        tl.set(qa(d, ':scope > .v-angry'), { display: 'inline', visibility: 'visible' }, t);
        tl.fromTo(d, { scale: 0.96 }, { scale: 1, transformOrigin: '50% 60%', duration: 0.18, ease: 'back.out(3)', immediateRender: false }, t);
    },
    steam({ tl, g, loops }: Ctx, t: number) {
        const st = qa(g, '.v-angry .m-steam-head');
        if (!st.length) return;
        tl.set(st, { visibility: 'visible' }, t);
        tl.fromTo(qa(g, '.v-angry .m-steam-head path'), { y: 20, opacity: 0 }, { y: -30, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'sine.out', immediateRender: false }, t);
        loops.push(gsap.fromTo(qa(g, '.v-angry .m-steam-head path'), { y: -30, opacity: 1 }, { y: -80, opacity: 0, duration: 1.0, repeat: -1, stagger: 0.2, ease: 'sine.out', paused: true }));
    },
    peek({ tl, g }: Ctx, t: number) {
        // the hiding agents' eyes dart to the side and back
        const faces = qa(g, '.a-agent.hide .face');
        if (faces.length) tl.to(faces, { keyframes: [{ x: 18, duration: 0.15 }, { x: 18, duration: 0.5 }, { x: 0, duration: 0.15 }], stagger: 0.08 }, t);
    },
    eyes({ tl, g, loops }: Ctx, t: number) {
        // in the dark, cursor eyes light up
        const gl = qa(g, '.a-agent.sil .gleam');
        if (!gl.length) return;
        tl.set(gl, { opacity: 0 }, 0);
        tl.to(gl, { opacity: 1, duration: 0.25, stagger: 0.06, immediateRender: false }, t);
        loops.push(gsap.to(gl, { opacity: 0.6, duration: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }));
    },
    tally({ tl, g }: Ctx, t: number) {
        const marks = qa(g, '.gate .tally path');
        tl.set(marks, { visibility: 'hidden' }, 0);
        marks.forEach((m, k) => tl.set(m, { visibility: 'visible' }, t + Math.pow(k / marks.length, 0.55) * 1.9));
    },
    glance({ tl, g }: Ctx, t: number) {
        const a = agentN(g, 7);
        if (a) tl.to(q(a, '.monitor'), { rotation: -14, transformOrigin: '50% 100%', duration: 0.3, ease: 'power2.out' }, t);
        if (!vertical(g)) {
            const w = at(q(g, '.farwindow'));
            tl.to(q(g, '.cam'), { scale: 1.12, svgOrigin: `${w.x} ${w.y}`, duration: 0.8, ease: 'power2.inOut' }, t);
        }
    },
});
const FXglint = FX.glint;
FX.glint = (c: Ctx, t: number) => {
    if (q(c.g, '.panel')) return FXglint(c, t);
    const s = q(c.g, '.farwindow .spark');
    if (!s) {
        const gl = qa(c.g, '.a-agent.sil .gleam');
        if (gl.length) c.tl.fromTo(gl, { scaleX: 1.6, scaleY: 0.5, transformOrigin: '50% 50%' }, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, t);
        return;
    }
    c.tl.fromTo(s, { visibility: 'visible', scale: 0, rotation: -45, transformOrigin: '50% 50%' }, { scale: 1.3, rotation: 0, duration: 0.18, ease: 'back.out(3)', immediateRender: false }, t);
    c.tl.to(s, { scale: 1, duration: 0.2 }, t + 0.18);
    c.tl.set(s, { visibility: 'hidden' }, 0);
};
const FXfiles = FX.files;
FX.files = (c: Ctx, t: number) => (vertical(c.g) ? blizzard(c, t, -Math.PI / 2, 1.1) : q(c.g, '.window') ? blizzard(c, t, -0.35, 0.9) : FXfiles(c, t));
FX.behind = ({ tl, g }: Ctx, t: number) => {
    const w = role(g, 'thief') ?? role(g, 'sweeper');
    if (!w) return;
    tl.set(w, { autoAlpha: 0 }, 0);
    tl.set(w, { autoAlpha: 1 }, t);
    tl.fromTo(w, { x: -60, scale: 1.08, transformOrigin: '50% 100%' }, { x: 0, scale: 1, duration: 0.14, ease: 'power4.out', immediateRender: false }, t);
};
FX.devpush = ({ tl, g }: Ctx, t: number) => {
    const d = dev(g);
    if (!d) return;
    const p = placeOf(d);
    tl.to(q(g, '.cam'), { scale: 1.3, svgOrigin: `${p.x} ${p.y - 560 * Math.abs(p.sy)}`, duration: 1.4, ease: 'power2.inOut' }, t);
};
FX.turn = ({ tl, g }: Ctx, t: number) => {
    const fs = agentsOnly(g).filter((f) => f.querySelector('.face-turn'));
    if (fs.length) {
        tl.to(fs, { scaleX: 0.86, transformOrigin: '50% 100%', duration: 0.08, yoyo: true, repeat: 1 }, t);
        tl.set(fs.map((f) => q(f, '.face-init')), { visibility: 'hidden' }, t + 0.08);
        tl.set(fs.map((f) => q(f, '.face-turn')), { visibility: 'visible' }, t + 0.08);
    }
    swap(tl, dev(g), t);
};

/** Pages out in a blizzard, fanned around a direction (radians). */
function blizzard({ tl, g }: Ctx, t: number, dir: number, spread: number) {
    const files = qa(g, '.file');
    const [fx, fy] = (g.querySelector('.files')?.getAttribute('data-from') || '800 450').split(' ').map(Number);
    files.forEach((f, i) => {
        const a = dir + (((i * 2.399) % 2) - 1) * spread;
        const r = 700 + ((i * 97) % 700);
        tl.fromTo(f, { visibility: 'visible', x: fx, y: fy, scale: 0.4, rotation: 0 }, { x: fx + Math.cos(a) * r, y: fy + Math.sin(a) * r, scale: 1 + (i % 3) * 0.3, rotation: (i % 2 ? 1 : -1) * (180 + i * 20), duration: 1.2, ease: 'power2.out', immediateRender: false }, t + Math.pow(i / files.length, 1.6) * 0.9);
    });
    tl.set(files, { visibility: 'hidden' }, 0);
}
/** The blizzard backwards: pages from all round fly home into the folder. */
function gather({ tl, g }: Ctx, t: number, dir: number) {
    const files = qa(g, '.file');
    const [fx, fy] = (g.querySelector('.files')?.getAttribute('data-from') || '800 450').split(' ').map(Number);
    tl.set(files, { visibility: 'hidden' }, 0);
    files.forEach((f, i) => {
        const a = dir + (((i * 2.399) % 2) - 1) * 1.3;
        const r = 800 + ((i * 97) % 600);
        const s = t + (i / files.length) * 1.2;
        tl.fromTo(f, { visibility: 'visible', x: fx + Math.cos(a) * r, y: fy + Math.sin(a) * r, scale: 1.2, rotation: (i % 2 ? 1 : -1) * 200 }, { x: fx, y: fy, scale: 0.3, rotation: 0, duration: 0.7, ease: 'power2.in', immediateRender: false }, s);
        tl.set(f, { visibility: 'hidden' }, s + 0.7);
    });
}

function focus(g: Element) {
    const [x, y] = (g.getAttribute('data-focus') || '800 450').split(' ').map(Number);
    return `${x} ${y}`;
}

/** Words and lines come in after their picture, at the time the shot list gives them. */
function common({ tl, g, loops }: Ctx) {
    const wg = q(g, '.word');
    const word = q(g, '.word text');
    if (word) tl.fromTo(word, { autoAlpha: 0, scale: 2.4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: 'power4.in' }, Number(wg?.getAttribute('data-at') || 0.75));
    const lg = q(g, '.line');
    const line = qa(g, '.line text');
    if (line.length) tl.fromTo(line, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, Number(lg?.getAttribute('data-at') || 0.9));
    const counter = q(g, '.counter');
    if (counter && !counter.dataset.value && counter.dataset.to && !fxCount(g, 'tick')) {
        const to = Number(counter.getAttribute('data-to') || 0);
        tl.fromTo(counter, { textContent: 0 }, { textContent: to, duration: 2.2, ease: 'power2.in', modifiers: { textContent: (v: number) => Math.round(v).toLocaleString('en-GB') }, immediateRender: false }, 0.1);
    }
    const steam = qa(g, '.steam');
    if (steam.length) loops.push(gsap.fromTo(steam, { y: 0, opacity: 0.9 }, { y: -24, opacity: 0, duration: 1.4, repeat: -1, ease: 'sine.out', paused: true }));
}

/** A shot's timeline: its words and lines, its effects (this frame's list), and a cut flash. */
function build(g: El, svg: SVGSVGElement, shot: Shot, flash: boolean): Ctx {
    const loops: gsap.core.Animation[] = [];
    const ctx: Ctx = { tl: gsap.timeline({ onComplete: () => loops.forEach((l) => l.play()) }), g, shot, svg, loops };
    common(ctx);
    const list: string[] = (g as unknown as HTMLElement).dataset.fx ? JSON.parse((g as unknown as HTMLElement).dataset.fx!) : shot.fx ?? [];
    list.forEach((f) => {
        const [name, t] = f.split('@');
        if (!FX[name]) console.warn(`anime: no effect "${name}"`);
        else FX[name](ctx, Number(t || 0));
    });
    // a hard cut reads as a cut: one white frame between shots
    if (flash) {
        const fl = q(svg, '.flash')!;
        ctx.tl.fromTo(fl, { visibility: 'visible', fill: '#f2f0ea', opacity: 0.85 }, { opacity: 0, duration: 0.12, immediateRender: false }, 0);
        ctx.tl.set(fl, { visibility: 'hidden', opacity: 1 }, 0.12);
    }
    return ctx;
}

export function mountCutscene(wrap: HTMLElement) {
    // the frame: ?frame=9:16 or 16:9, else the screen's shape (phones and anything tall get the staged vertical one)
    const want = new URLSearchParams(location.search).get('frame');
    const vertical = want ? want === '9:16' : wrap.clientWidth / Math.max(1, wrap.clientHeight) < 0.8;
    const tpl = wrap.querySelector<HTMLTemplateElement>('template[data-frame="9:16"]');
    const tall = tpl?.content.querySelector('svg.cutscene');
    let other: SVGSVGElement | null = null;
    if (vertical && tall) {
        other = wrap.querySelector<SVGSVGElement>('svg.cutscene');
        other!.replaceWith(document.importNode(tall, true));
    } else if (tall) {
        other = document.importNode(tall, true) as SVGSVGElement;
    }
    const svg = wrap.querySelector<SVGSVGElement>('svg.cutscene')!;
    const frame = (svg.dataset.frame as '16:9' | '9:16') || '16:9';
    wrap.dataset.frame = frame;
    CENTRE = (svg.dataset.centre || '800 450').split(' ').map((n) => `${n}px`).join(' ');
    const list = JSON.parse(svg.dataset.list || '{}') as ShotList;
    const shots = qa(svg, '.shot');
    const count = wrap.querySelector<HTMLElement>('[data-count]');
    const hint = wrap.querySelector<HTMLElement>('[data-hint]');
    const after = document.querySelector<HTMLElement>('[data-after]');
    let i = -1;
    let tl: gsap.core.Timeline | null = null;
    let loops: gsap.core.Animation[] = [];
    // ?play=auto (Video's recorder) or ?render: the cut runs by itself on the planned clock, no input, no sound
    const auto = /[?&](play=auto|render)\b/.test(location.search);
    const base = (wrap.dataset.base || '').replace(/\/$/, '');
    const soundBtn = wrap.querySelector<HTMLButtonElement>('[data-sound]');
    let audio: CutAudio | null = null;
    let starts: number[] = [];

    // a phone keeps the shot's focus in the middle and puts words above and lines below the picture
    const fit = () => {
        if (frame === '9:16') { svg.setAttribute('viewBox', '0 0 900 1600'); return; }
        const w = wrap.clientWidth, h = wrap.clientHeight;
        const aspect = w / Math.max(1, h);
        const g = shots[Math.max(0, i)];
        const [fx, fy] = (g?.getAttribute('data-focus') || '800 450').split(' ').map(Number);
        const words = qa(svg, '.word'), lines = qa(svg, '.line');
        // the arrow that stands alone (shot 'continued') keeps its centred place; the end card's arrow moves with the crop
        const fits = Array.from(svg.querySelectorAll<SVGGElement>('.stampfit')), arrows = Array.from(svg.querySelectorAll<SVGGElement>('.tbc:not(.alone)'));
        if (aspect >= 1.4) {
            svg.setAttribute('viewBox', '0 0 1600 900');
            [...words, ...lines, ...fits].forEach((el) => el.removeAttribute('transform'));
            svg.querySelectorAll('.stampspot').forEach((el) => el.setAttribute('transform', 'translate(800 650) rotate(-5)'));
            svg.querySelectorAll('.wordfit, .ttlfit').forEach((el) => el.removeAttribute('transform'));
            arrows.forEach((el) => el.setAttribute('transform', 'translate(120 840)'));
            return;
        }
        // a tall screen: 900 of the frame's width around the focus, as tall as the screen is
        const vw = Math.min(1600, Math.max(900, 900 * aspect));
        const vh = vw / aspect;
        const vx = Math.min(1600 - vw, Math.max(0, fx - vw / 2));
        const vy = fy - vh / 2;
        svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
        const dx = vx + vw / 2 - 800;
        words.forEach((el) => el.setAttribute("transform", `translate(${dx} ${vy + 270 - 200})`));
        // a line shrinks to the width seen (Geist 600 at 46 px: about 24 units a character)
        lines.forEach((el) => {
            const k = Math.min(1, (vw - 50) / (Number(el.dataset.len || 20) * 24));
            el.setAttribute('transform', `translate(${dx + 800} ${vy + vh - 150}) scale(${k.toFixed(3)}) translate(-800 -830)`);
        });
        // the end card's stamp keeps to the middle of what is seen
        svg.querySelectorAll('.stampspot').forEach((el) => el.setAttribute('transform', `translate(${vx + vw / 2} 650) rotate(-5)`));
        fits.forEach((el) => el.setAttribute('transform', `scale(${Math.min(1, (vw - 40) / 980).toFixed(3)})`));
        // long words and the episode title shrink to the width seen (Big Shoulders 900: about 0.5 em a letter)
        svg.querySelectorAll<SVGGElement>('.word').forEach((wd) => {
            const k = Math.min(1, (vw - 60) / (Number(wd.dataset.len || 8) * 98));
            wd.querySelector('.wordfit')?.setAttribute('transform', `translate(800 200) scale(${k.toFixed(3)}) translate(-800 -200)`);
        });
        svg.querySelectorAll('.ttlfit').forEach((el) => {
            const k = Math.min(1, (vw - 60) / (list.title.length * 62));
            el.setAttribute('transform', `translate(800 490) scale(${k.toFixed(3)}) translate(-800 -490)`);
        });
        arrows.forEach((el) => el.setAttribute('transform', `translate(${vx + 30} ${vy + vh - 260}) scale(${Math.min(1, (vw - 60) / 500).toFixed(3)})`));
    };

    const show = (n: number, instant = false) => {
        if (n < 0 || n >= shots.length || n === i) return;
        tl?.kill();
        loops.forEach((l) => l.kill());
        loops = [];
        if (i >= 0) gsap.set(shots[i], { display: 'none' });
        i = n;
        const g = shots[i];
        gsap.set(g, { display: 'inline', visibility: 'visible' });
        fit();
        const ctx = build(g, svg, list.shots[i], n > 0 && !instant);
        tl = ctx.tl;
        loops = ctx.loops;
        if (!instant) audio?.shot(i, starts[i] ?? 0);
        if (instant) tl.progress(1);
        if (count) count.textContent = `${i + 1} / ${shots.length}`;
        const last = i === shots.length - 1;
        wrap.classList.toggle('at-end', last);
        if (hint) hint.hidden = last;
        if (after) after.classList.toggle('on', last);
    };
    // an input while a shot is still playing finishes that shot, line and all; the next input moves on
    const next = () => {
        if (tl && tl.progress() < 1) { tl.progress(1); return; }
        show(i + 1);
    };
    const prev = () => show(i - 1);

    addEventListener('resize', fit);
    // The plan: each shot's length, decided once from its own timeline (Video's rule, shared with the recorder):
    // length = max(animation, lineAt + read(line), say.at + read(say), wordAt + 1.2) + 0.5 s,
    // read = max(1.4, 0.32 s a word + 0.6); the end card holds 3 s after the stamp lands.
    const words = (t: string) => t.split(/\s+/).filter(Boolean).length;
    const lens: number[] = [];
    const stampAt: (number | null)[] = [];
    // both frames stage the same shot differently; the plan takes the longer, so both play to one clock
    const animOf = (root: SVGSVGElement) => qa(root, '.shot').map((g, k) => {
        const c = build(g, root, list.shots[k], k > 0);
        const d = c.tl.duration();
        c.tl.kill();
        c.loops.forEach((l) => l.kill());
        return d;
    });
    const here = animOf(svg);
    let there: number[] = [];
    if (other) {
        other.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden');
        wrap.appendChild(other);
        there = animOf(other);
        other.remove();
    }
    for (let k = 0; k < shots.length; k++) {
        const s = list.shots[k];
        const anim = Math.max(here[k], there[k] ?? 0);
        const read = (t: string) => Math.max(1.4, 0.32 * words(t) + 0.6);
        const lineEnd = s.line ? (s.lineAt ?? 0.9) + read(`${s.line.text}`) : 0;
        const sayEnd = s.say ? (s.say.at ?? 0) + read(s.say.text) : 0;
        const wordEnd = s.word ? (s.wordAt ?? 0.75) + 1.2 : 0;
        const fxAt = (name: string, d: number) => { const f = (s.fx ?? []).find((x) => x.split('@')[0] === name); return f ? Number(f.split('@')[1] || d) : null; };
        const end = fxAt('endcard', 1.6), st = fxAt('stamp', 1), co = fxAt('continued', 1);
        // the stamp lands 0.25 s after its slam starts (0.8 s in on the end card); the card then holds to be read
        const stamp = end !== null ? end + 0.8 + 0.25 : st !== null ? st + 0.25 : co !== null ? co + 0.4 : null;
        const hold = end !== null || co !== null ? 3 : 2.5;
        stampAt.push(stamp);
        lens.push(Math.max(Math.max(anim, lineEnd, sayEnd, wordEnd) + 0.5, stamp !== null ? stamp + hold : 0));
    }
    i = -1;
    starts = lens.map((_, k) => lens.slice(0, k).reduce((x, y) => x + y, 0));
    const total = starts[starts.length - 1] + lens[lens.length - 1];
    const plan = list.shots.map((s, k) => ({ id: s.id, start: +starts[k].toFixed(3), length: +lens[k].toFixed(3) }));
    // The sound plan, shared with the recorder. A shot list that names music states gets a music cue wherever the
    // state changes; an older one keeps the single bed from start to end. A shot with sfx plays those, and its fx
    // stay silent so nothing doubles.
    const states = list.shots.some((s) => s.music);
    const cues: Cue[] = states ? [] : [{ t: 0, kind: 'music', name: 'start', shot: list.shots[0].id }];
    let state: string | undefined;
    list.shots.forEach((s, k) => {
        const t0 = starts[k];
        if (states && s.music && s.music !== state) { state = s.music; cues.push({ t: t0, kind: 'music', name: s.music, shot: s.id }); }
        if (k > 0) cues.push({ t: t0, kind: 'cut', name: 'cut', shot: s.id });
        (s.sfx ?? []).forEach((f) => { const [name, at] = f.split('@'); cues.push({ t: t0 + Number(at || 0), kind: 'sfx', name, shot: s.id }); });
        // a shot with its own sfx plays no fx sound and no event sound (cut, word, stamp, tbc), so nothing doubles
        const quiet = !!s.sfx?.length;
        (s.fx ?? []).forEach((f) => {
            const [name, at] = f.split('@');
            if (quiet) return;
            if (name === 'endcard') cues.push({ t: t0 + Number(at || 1.6) + 0.2, kind: 'tbc', name, shot: s.id });
            else if (name === 'continued') cues.push({ t: t0 + Number(at || 1) + 0.1, kind: 'tbc', name, shot: s.id });
            else if (name !== 'stamp') cues.push({ t: t0 + (name === 'titlecard' ? 0.3 : Number(at || 0)), kind: 'fx', name, shot: s.id });
        });
        if (s.word && !quiet) cues.push({ t: t0 + (s.wordAt ?? 0.75), kind: 'word', name: s.id, shot: s.id });
        if (s.line) cues.push({ t: t0 + (s.lineAt ?? 0.9), kind: 'line', name: s.id, shot: s.id });
        else if (s.say) cues.push({ t: t0 + (s.say.at ?? 0), kind: 'say', name: s.id, shot: s.id });
        if (stampAt[k] !== null && !quiet && !(s.fx ?? []).some((f) => f.startsWith('continued'))) cues.push({ t: t0 + stampAt[k]!, kind: 'stamp', name: 'stamp', shot: s.id });
    });
    if (!states) cues.push({ t: total, kind: 'music', name: 'end', shot: list.shots[list.shots.length - 1].id });
    cues.forEach((c) => { c.t = +c.t.toFixed(3); });
    cues.sort((x, y) => x.t - y.t);
    audio = auto ? null : new CutAudio(base, list.incident, (k) => cues.filter((c) => c.shot === list.shots[k].id), () => cues);

    if (auto) {
        // no input, no waiting: each shot comes on at its planned start, on GSAP's clock only
        wrap.classList.add('rendering');
        gsap.ticker.lagSmoothing(0);
        const master = gsap.timeline({ paused: true });
        plan.forEach((p, k) => master.call(() => show(k), [], p.start));
        master.to({}, { duration: 0.001 }, total);
        // a frame for any time, the same every time: for exporters that seek rather than run a clock
        const frameAt = (t: number) => {
            const k = Math.max(0, starts.findLastIndex((x) => x <= t));
            if (k !== i) show(k);
            tl!.pause();
            const local = t - starts[k];
            tl!.seek(Math.min(local, tl!.duration()), true);
            loops.forEach((l) => { l.pause(); l.totalTime(Math.max(0, local - tl!.duration())); });
            return k;
        };
        const ready = (document.fonts?.ready ?? Promise.resolve()).then(() => { master.play(0); });
        (window as any).__cut = { frame, plan, total, cues, ready, show, get i() { return i; }, get tl() { return tl; }, n: shots.length, master, frameAt };
        return;
    }

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
    if (reduce) { show(shots.length - 1, true); wrap.classList.add('still'); return; }

    // sound: fetched on the viewer's first click, tap or key (a gesture the browser lets audio start from)
    const startSound = () => { audio?.start().then((ok) => { if (soundBtn) soundBtn.hidden = !ok; if (ok) audio!.shot(Math.max(0, i), starts[Math.max(0, i)]); }); };
    const paintSound = () => { if (soundBtn && audio) { soundBtn.textContent = audio.on ? 'Sound on' : 'Sound off'; soundBtn.setAttribute('aria-pressed', String(audio.on)); } };
    paintSound();
    soundBtn?.addEventListener('click', (e) => { e.stopPropagation(); startSound(); audio?.toggle(); paintSound(); });
    wrap.addEventListener('pointerdown', startSound, { once: true });
    addEventListener('keydown', startSound, { once: true });

    // input: click or tap, space and the arrows, and the wheel (one shot per gesture)
    wrap.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a, button')) return; next(); });
    addEventListener('keydown', (e) => {
        if (e.target instanceof HTMLElement && e.target.closest('input, textarea, a, button')) return;
        if ([' ', 'Enter', 'ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) { if (i < shots.length - 1) { e.preventDefault(); next(); } }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { if (i > 0 && scrollY < 10) { e.preventDefault(); prev(); } }
    });
    let lastWheel = 0;
    wrap.addEventListener('wheel', (e) => {
        if (i >= shots.length - 1 && e.deltaY > 0) return; // at the end the page scrolls on to the links
        e.preventDefault();
        const now = performance.now();
        if (now - lastWheel < 650) return;
        lastWheel = now;
        if (e.deltaY > 0) next(); else prev();
    }, { passive: false });
    wrap.querySelector('[data-skip]')?.addEventListener('click', (e) => { e.stopPropagation(); show(shots.length - 1); });
    document.querySelectorAll('[data-replay]').forEach((b) => b.addEventListener('click', () => { scrollTo({ top: 0, behavior: 'smooth' }); i = -1; show(0); }));
    if (location.search.includes('debug')) (window as any).__cut = { frame, show, get i() { return i; }, get tl() { return tl; }, n: shots.length, plan, total, cues };
    show(0);
}
