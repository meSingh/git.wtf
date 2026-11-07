// The anime cutscene's engine. One shot on screen at a time; each shot plays its effects in order when it comes on,
// then holds (with small loops: steam, glints, lines) until the reader advances. Click, tap, space, enter, the
// arrow keys and the scroll wheel advance; a skip control jumps to the end card. With reduced motion the end card
// shows as a still, stamp down.
import gsap from 'gsap';
import type { Shot, ShotList } from '../anime/types';

type El = SVGGraphicsElement;

interface Ctx { tl: gsap.core.Timeline; g: El; shot: Shot; svg: SVGSVGElement; loops: gsap.core.Animation[] }

const q = (g: Element, s: string) => g.querySelector<El>(s);
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
        loops.push(gsap.to(q(card, '.tl'), { rotation: 3, transformOrigin: '800px 450px', duration: 0.12, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    push({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { scale: 1, transformOrigin: focus(g) }, { scale: 1.12, duration: 2.6, ease: 'power1.inOut' }, at); },
    slowpush({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { scale: 1, transformOrigin: focus(g) }, { scale: 1.08, duration: 4.5, ease: 'sine.inOut' }, at); },
    devpush({ tl, g }, at) {
        const d = role(g, 'dev')!.parentElement!;
        const m = d.getAttribute('transform')!.match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;
        tl.to(q(g, '.cam'), { scale: 1.3, transformOrigin: `${m[1]}px ${Number(m[2]) - 360}px`, duration: 1.4, ease: 'power2.inOut' }, at);
    },
    zoom({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { scale: 1.6, transformOrigin: focus(g) }, { scale: 1, duration: 0.35, ease: 'power4.out' }, at); },
    shake({ tl, g }, at) {
        tl.to(q(g, '.cam'), { keyframes: [{ x: -18, y: 8 }, { x: 16, y: -10 }, { x: -10, y: 6 }, { x: 8, y: -4 }, { x: 0, y: 0 }], duration: 0.32, ease: 'none' }, at || 0.12);
    },
    whip({ tl, g }, at) { tl.fromTo(q(g, '.cam'), { x: -1500 }, { x: 0, duration: 0.28, ease: 'power3.out' }, at); },
    spin({ tl, g }, at) {
        // the camera goes once round the ring of pointing arms
        tl.fromTo(q(g, '.cam'), { rotation: 0, scale: 1.7, transformOrigin: '800px 450px' }, { rotation: 360, duration: 2.2, ease: 'power2.inOut' }, at);
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
        tl.fromTo(lines, { autoAlpha: 0, scale: 1.3, transformOrigin: '800px 450px' }, { autoAlpha: 1, scale: 1, duration: 0.2 }, at);
        loops.push(gsap.to(lines, { rotation: 2, transformOrigin: '800px 450px', duration: 0.08, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    extralines({ tl, g, loops }, at) {
        // for the first time, speed lines behind THE EXTRA
        const lines = q(g, '.lines');
        if (!lines) return;
        tl.set(lines, { autoAlpha: 0 }, 0);
        // centred on THE EXTRA, wherever the shot puts it
        const ex = role(g, 'extra')?.parentElement?.getAttribute('transform')?.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
        const o = ex ? `${ex[1]}px ${Number(ex[2]) - 360}px` : '800px 450px';
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
        if (t) tl.fromTo(t, { visibility: 'visible', y: -10, opacity: 0 }, { y: 70, opacity: 1, duration: 1.4, ease: 'power1.in' }, at || 0.4);
    },
    sweat({ tl, g }, at) {
        const drops = qa(g, '.sweat');
        tl.fromTo(drops, { visibility: 'visible', y: -30, scale: 0.4, transformOrigin: '50% 0%' }, { y: 0, scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.05 }, at || 0.4);
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
    sip({ tl, g }, at) {
        const d = role(g, 'dev')!;
        const mug = q(d, '.mug');
        if (!mug) return;
        tl.to(mug, { x: -120, y: -150, rotation: -30, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.inOut' }, at);
        tl.to(mug, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' }, at + 1.1);
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
    endcard({ tl, g }, at) {
        const card = q(g, '.endcard')!;
        const t = at || 1.6;
        // freeze frame: the picture drains, the arrow slides in, the stamp slams
        tl.to(q(g, '.cam'), { filter: 'grayscale(1) contrast(1.25)', duration: 0.3 }, t);
        tl.fromTo(q(card, '.tbc-in'), { x: -700 }, { x: 0, duration: 0.35, ease: 'power3.out' }, t + 0.2);
        tl.fromTo(q(card, '.stampmark'), { autoAlpha: 0, scale: 3.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power4.in' }, t + 0.8);
        tl.to(q(g, '.cam'), { keyframes: [{ y: 12 }, { y: -6 }, { y: 0 }], duration: 0.18, ease: 'none' }, '>');
    },
};

function focus(g: Element) {
    const [x, y] = (g.getAttribute('data-focus') || '800 450').split(' ').map(Number);
    return `${x}px ${y}px`;
}

/** Words and lines come in after their picture, at the time the shot list gives them. */
function common({ tl, g, loops }: Ctx) {
    const wg = q(g, '.word');
    const word = q(g, '.word text');
    if (word) tl.fromTo(word, { autoAlpha: 0, scale: 2.4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: 'power4.in' }, Number(wg?.getAttribute('data-at') || 0.75));
    const lg = q(g, '.line');
    const line = q(g, '.line text');
    if (line) tl.fromTo(line, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, Number(lg?.getAttribute('data-at') || 0.9));
    const counter = q(g, '.counter');
    if (counter) {
        const o = { v: 0 };
        const to = Number(counter.getAttribute('data-to') || 0);
        tl.to(o, { v: to, duration: 2.2, ease: 'power2.in', onUpdate: () => { counter.textContent = Math.round(o.v).toLocaleString('en-GB'); } }, 0.1);
    }
    const steam = qa(g, '.steam');
    if (steam.length) loops.push(gsap.fromTo(steam, { y: 0, opacity: 0.9 }, { y: -24, opacity: 0, duration: 1.4, repeat: -1, ease: 'sine.out', paused: true }));
}

export function mountCutscene(wrap: HTMLElement) {
    const svg = wrap.querySelector<SVGSVGElement>('svg.cutscene')!;
    const list = JSON.parse(svg.dataset.list || '{}') as ShotList;
    const shots = qa(svg, '.shot');
    const count = wrap.querySelector<HTMLElement>('[data-count]');
    const hint = wrap.querySelector<HTMLElement>('[data-hint]');
    const after = document.querySelector<HTMLElement>('[data-after]');
    let i = -1;
    let tl: gsap.core.Timeline | null = null;
    let loops: gsap.core.Animation[] = [];

    // a phone keeps the shot's focus in the middle and puts words above and lines below the picture
    const fit = () => {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        const aspect = w / Math.max(1, h);
        const g = shots[Math.max(0, i)];
        const [fx, fy] = (g?.getAttribute('data-focus') || '800 450').split(' ').map(Number);
        const words = qa(svg, '.word'), lines = qa(svg, '.line');
        const fits = Array.from(svg.querySelectorAll<SVGGElement>('.stampfit')), arrows = Array.from(svg.querySelectorAll<SVGGElement>('.tbc'));
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
        if (i >= 0) gsap.set(shots[i], { visibility: 'hidden' });
        i = n;
        const g = shots[i];
        gsap.set(g, { visibility: 'visible' });
        fit();
        const ctx: Ctx = { tl: gsap.timeline({ onComplete: () => loops.forEach((l) => l.play()) }), g, shot: list.shots[i], svg, loops };
        tl = ctx.tl;
        common(ctx);
        (list.shots[i].fx ?? []).forEach((f) => {
            const [name, t] = f.split('@');
            if (!FX[name]) console.warn(`anime: no effect "${name}"`);
            else FX[name](ctx, Number(t || 0));
        });
        // a hard cut reads as a cut: one white frame between shots
        if (!instant && n > 0) { const fl = q(svg, '.flash')!; gsap.fromTo(fl, { visibility: 'visible', fill: '#f2f0ea', opacity: 0.85 }, { opacity: 0, duration: 0.12, onComplete: () => gsap.set(fl, { visibility: 'hidden', opacity: 1 }) }); }
        if (instant) tl.progress(1);
        if (count) count.textContent = `${i + 1} / ${shots.length}`;
        const last = i === shots.length - 1;
        wrap.classList.toggle('at-end', last);
        if (hint) hint.hidden = last;
        if (after) after.classList.toggle('on', last);
    };
    const next = () => show(i + 1);
    const prev = () => show(i - 1);

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
    addEventListener('resize', fit);
    if (reduce) { show(shots.length - 1, true); wrap.classList.add('still'); return; }

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
    if (location.search.includes('debug')) (window as any).__cut = { show, get i() { return i; }, get tl() { return tl; }, n: shots.length };
    show(0);
}
