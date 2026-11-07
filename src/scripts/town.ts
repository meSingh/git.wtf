// The toy town's engine. One beat at a time: the camera glides to the beat's subject, the beat's verbs play, and
// its line or caption lands after its picture and stays until the next beat's picture has played. A scroll,
// click, key or tap advances; an input while a beat is still playing finishes it, line and all. The poke beat
// waits for a poke, takes any input as one, and pokes itself after a short hold, so it never blocks the scroll.
// Hovering or tapping things makes them react without moving the story on. With reduced motion the town shows
// its final state: the scar and the stamp.
import gsap from 'gsap';
import type { Beat, TownEvent } from '../town/types';
import { P } from '../town/iso';

type El = SVGGraphicsElement;
interface Ctx { tl: gsap.core.Timeline; svg: SVGSVGElement; ev: TownEvent; beat: Beat; loops: gsap.core.Animation[] }

const q = (r: ParentNode, s: string) => r.querySelector<El>(s);
const qa = (r: ParentNode, s: string) => Array.from(r.querySelectorAll<El>(s));
const xy = (el: Element): [number, number] => { const m = (el.getAttribute('transform') || '').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/); return m ? [Number(m[1]), Number(m[2])] : [0, 0]; };
const data = (svg: SVGSVGElement, k: string) => JSON.parse(svg.dataset[k] || '[0,0]') as [number, number];
const pos = (el: El): [number, number] => [gsap.getProperty(el, 'x') as number, gsap.getProperty(el, 'y') as number];

/** Where things are, by name, for the camera and for lines. */
function anchor(svg: SVGSVGElement, on: string | [number, number]): [number, number] {
    if (Array.isArray(on)) return P(on[0], on[1]);
    const b = q(svg, `.bld[data-id="${on}"]`);
    if (b) return [Number(b.dataset.cx), Number(b.dataset.cy) - 40];
    const [tx, ty] = data(svg, 'target');
    if (on === 'extra') { const [x, y] = pos(q(svg, '.truck')!); return [x, y - 80]; }
    // DEV speaks from beside the giant hand that hovers over the house
    if (on === 'dev') return [tx + 230, ty - 190];
    if (on === 'ambulance') { const [x, y] = pos(q(svg, '.ambulance')!); return [x, y - 70]; }
    return [tx, ty - 150];
}

/** A toy drive: along the ground with a bounce in its step and a wobble on arrival. */
function drive(tl: gsap.core.Timeline, el: El, x: number, y: number, dur: number, at: number) {
    tl.to(el, { x, y, duration: dur, ease: 'power1.inOut' }, at);
    const veh = q(el, '.veh');
    if (!veh) return;
    tl.to(veh, { y: -4, duration: 0.12, yoyo: true, repeat: Math.max(1, Math.round(dur / 0.12) - 1), ease: 'sine.inOut' }, at);
    tl.to(veh, { keyframes: [{ rotation: -4 }, { rotation: 3 }, { rotation: 0 }], transformOrigin: '50% 100%', duration: 0.35, ease: 'none' }, at + dur);
}

// ---------- the verbs ----------
type Verb = (c: Ctx, at: number) => void;
const VERBS: Record<string, Verb> = {
    glide() { /* the camera does it */ },
    rollIn({ tl, svg }, at) {
        // one bulldozer down each street, to its stop line, revving, every robot waving
        const ds = qa(svg, '.dozer');
        tl.set(ds, { visibility: 'visible' }, at);
        ds.forEach((d, i) => {
            const t = at + (i % 6) * 0.1 + Math.floor(i / 6) * 0.05;
            drive(tl, d, Number(d.dataset.ex), Number(d.dataset.ey), 1.5, t);
            tl.fromTo(q(d, '.b-arm'), { rotation: 0 }, { rotation: -60, transformOrigin: '0% 100%', duration: 0.15, yoyo: true, repeat: 3 }, t + 1.55);
        });
    },
    shiver({ tl, svg, ev }, at) {
        const body = q(svg, `.bld[data-id="${ev.target}"] .body`)!;
        tl.to(body, { keyframes: [{ x: -3 }, { x: 3 }, { x: -2 }, { x: 2 }, { x: 0 }], duration: 0.4, ease: 'none' }, at);
    },
    honk({ tl, svg }, at) {
        // the poked horn honks, and all twelve take it as a starting gun
        const ds = qa(svg, '.dozer');
        const first = ds[0];
        tl.to(q(first, '.horn'), { fill: '#ffd400', scale: 1.6, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1 }, at);
        const hk = q(first, '.honk')!;
        tl.set(hk, { visibility: 'visible' }, at);
        tl.fromTo(q(hk, '.h-in'), { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.18, ease: 'back.out(3)' }, at);
        ds.forEach((d, i) => tl.to(q(d, '.veh'), { keyframes: [{ x: -3 }, { x: 3 }, { x: -2 }, { x: 0 }], duration: 0.25, ease: 'none' }, at + 0.3 + (i % 4) * 0.04));
        tl.to(q(hk, '.h-in'), { scale: 0, duration: 0.15 }, at + 1.1);
        tl.set(hk, { visibility: 'hidden' }, at + 1.25);
    },
    pileup({ tl, svg, ev }, at) {
        const b = q(svg, `.bld[data-id="${ev.target}"]`)!;
        const [tx, ty] = data(svg, 'target');
        const ds = qa(svg, '.dozer');
        // all twelve reach the house at the same instant; it folds flat like a cardboard box
        ds.forEach((d) => { const ex = Number(d.dataset.ex), ey = Number(d.dataset.ey); tl.to(d, { x: tx + (ex - tx) * 0.45, y: ty + (ey - ty) * 0.45, duration: 0.3, ease: 'power3.in' }, at); });
        tl.to(q(b, '.body'), { scaleY: 0.1, scaleX: 1.3, transformOrigin: '50% 100%', duration: 0.24, ease: 'power4.in' }, at + 0.2);
        tl.to(q(b, '.label .l-in'), { y: 60, rotation: -24, duration: 0.35, ease: 'bounce.out' }, at + 0.28);
        tl.to(svg.querySelector('.world'), { keyframes: [{ y: 8 }, { y: -5 }, { y: 0 }], duration: 0.22, ease: 'none' }, at + 0.44);
        ds.forEach((d) => { const ex = Number(d.dataset.ex), ey = Number(d.dataset.ey); tl.to(d, { x: ex, y: ey, duration: 0.5, ease: 'power3.out' }, at + 0.46); });
    },
    rain({ tl, svg }, at) {
        // parcels burst out and land streets away, some on roofs
        const [tx, ty] = data(svg, 'target');
        const roofs = qa(svg, '.bld').filter((b) => b.dataset.id !== 'myfolder');
        qa(svg, '.parcel').forEach((p, i) => {
            let x: number, y: number;
            if (i % 3 === 0 && roofs.length) { const r = roofs[i % roofs.length]; x = Number(r.dataset.cx) + ((i * 7) % 20) - 10; y = Number(r.dataset.cy) - 50 - (i % 2) * 14; }
            else { [x, y] = P(1 + ((i * 7) % 14) + ((i * 3) % 5) * 0.17, 1 + ((i * 11) % 14) + ((i * 5) % 3) * 0.21); }
            const t = at + i * 0.025;
            tl.set(p, { visibility: 'visible', x: tx, y: ty - 20 }, t);
            tl.to(p, { x, duration: 1.2, ease: 'none' }, t);
            tl.to(p, { keyframes: [{ y: Math.min(ty, y) - 300 - (i % 5) * 40, ease: 'power2.out' }, { y, ease: 'bounce.out' }], duration: 1.2 }, t);
        });
    },
    counterFall({ tl, svg }, at) {
        // the roof counter lands on the road and spins up
        const n = q(svg, '.roofnum');
        const t = q(svg, '.roofnum .rn');
        if (!n || !t) return;
        const o = { v: 0 };
        tl.to(n, { y: '+=230', x: '-=190', rotation: 12, duration: 0.6, ease: 'bounce.out' }, at);
        tl.to(o, { v: 2309, duration: 1.5, ease: 'power2.in', onUpdate: () => { t.textContent = Math.round(o.v).toLocaleString('en-GB'); } }, at + 0.5);
        tl.fromTo(t, { scale: 1 }, { scale: 1.4, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, at + 2.0);
    },
    extraLoop({ tl, svg }, at) {
        // THE EXTRA leaves the kerb and drives a slow loop behind the pile-up, catching parcels in its open back
        const tr = q(svg, '.truck');
        if (!tr) return;
        const [tx, ty] = data(svg, 'target');
        const loads = qa(tr, '.load rect');
        const steps = 6;
        for (let k = 1; k <= steps; k++) {
            const a = -0.3 + (k / steps) * Math.PI * 2;
            drive(tl, tr, tx + Math.cos(a) * 250, ty + Math.sin(a) * 135, 0.42, at + (k - 1) * 0.42);
            if (loads[k - 1]) tl.set(loads[k - 1], { visibility: 'visible' }, at + k * 0.42);
        }
    },
    ambulance({ tl, svg, loops }, at) {
        // from the far edge, the whole width of the town, held up once at a junction by a stray parcel
        const a = q(svg, '.ambulance')!;
        const [jx, jy] = P(12.4, 7.4);
        const [ex, ey] = P(10.6, 9.6);
        drive(tl, a, jx, jy, 1.4, at);
        const stray = qa(svg, '.parcel')[1];
        if (stray) { tl.set(stray, { visibility: 'visible', x: jx - 34, y: jy + 18 }, at); tl.to(stray, { x: jx - 80, y: jy + 40, duration: 0.5, ease: 'power2.out' }, at + 1.9); }
        tl.to(q(a, '.veh'), { keyframes: [{ rotation: -3 }, { rotation: 3 }, { rotation: 0 }], transformOrigin: '50% 100%', duration: 0.4 }, at + 1.45);
        drive(tl, a, ex, ey, 1.2, at + 2.3);
        loops.push(gsap.to(q(a, '.siren'), { fill: '#f2f0ea', duration: 0.18, repeat: -1, yoyo: true, ease: 'none', paused: true }));
    },
    stretcher({ tl, svg }, at) {
        // a stretcher, one parcel on it, a sheet over it
        const s = q(svg, '.stretcher')!;
        tl.set(s, { visibility: 'visible' }, at);
        tl.fromTo(q(s, '.sx-in'), { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, at);
        tl.fromTo(q(s, '.one'), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'bounce.out' }, at + 0.7);
        tl.set(q(s, '.sheet'), { visibility: 'visible' }, at + 1.5);
        tl.fromTo(q(s, '.sheet'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.35, ease: 'power2.out' }, at + 1.5);
    },
    clock({ tl, svg }, at) {
        // every robot climbs onto its roof and points at the next: a clock face of arms round the flat house
        const ds = qa(svg, '.dozer');
        ds.forEach((d, i) => {
            const bot = q(d, '.bot')!;
            const a = Number(d.dataset.a);
            const flipped = (q(d, '.veh')!.getAttribute('transform') || '').includes('scale(-1');
            // the tangent, in screen degrees, mirrored for bulldozers drawn facing the other way
            const tan = (Math.atan2(Math.cos(a) * 0.5 + Math.cos(a) * 0.5, -Math.sin(a) + Math.cos(a)) * 180) / Math.PI;
            tl.to(bot, { y: -18, duration: 0.25, ease: 'back.out(2)' }, at + i * 0.05);
            tl.to(q(d, '.b-arm'), { rotation: flipped ? 180 - tan : tan, transformOrigin: '0% 50%', scale: 1.8, duration: 0.25, ease: 'back.out(2)' }, at + 0.3 + i * 0.05);
        });
    },
    handHover({ tl, svg }, at) {
        // DEV's giant hand comes in from the table's edge and hovers over the clock
        const h = q(svg, '.hand')!;
        tl.set(h, { visibility: 'visible' }, at);
        tl.fromTo(q(h, '.hd-in'), { y: -1200, x: -300 }, { y: 60, x: 0, duration: 0.8, ease: 'power3.out' }, at);
        tl.to(q(h, '.hd-in'), { y: 36, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, at + 0.8);
    },
    extraHome({ tl, svg }, at) {
        // out of the loop, past the clock, past the ambulance, all the way to the mug; a neat pile tipped out beside it
        const tr = q(svg, '.truck');
        if (!tr) return;
        const [mx, my] = data(svg, 'mug');
        const path: [number, number][] = [P(7.2, 10.6), P(4.6, 9.2), P(2.2, 6.6)];
        let t = at;
        path.forEach(([x, y]) => { drive(tl, tr, x, y, 0.55, t); t += 0.55; });
        drive(tl, tr, mx + 210, my + 40, 0.5, t);
        t += 0.6;
        tl.to(q(tr, '.veh'), { rotation: -12, transformOrigin: '0% 100%', duration: 0.2, yoyo: true, repeat: 1 }, t);
        tl.set(qa(tr, '.load rect'), { visibility: 'hidden' }, t + 0.2);
        qa(svg, '.pile .pl').forEach((p, k) => tl.fromTo(p, { visibility: 'visible', y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'bounce.out' }, t + 0.2 + k * 0.08));
        // the hand turns from the clock towards the mug
        const h = q(svg, '.hand .hd-in');
        // the palm's foot is 220 above the hand's origin: bring it to just above the truck by the mug
        if (h) tl.to(h, { x: mx + 330 - data(svg, 'target')[0], y: my - data(svg, 'target')[1] + 150, duration: 1.0, ease: 'power2.inOut' }, at + 0.4);
    },
    thumbsUp({ tl, svg }, at) {
        const h = q(svg, '.hand')!;
        tl.set(q(h, '.open'), { visibility: 'hidden' }, at);
        tl.set(q(h, '.thumb'), { visibility: 'visible' }, at);
        tl.fromTo(q(h, '.thumb'), { scale: 0.8, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at);
    },
    mugDown({ tl, svg }, at) {
        // the bulldozers head for the pile; the hand sets the mug down in front of it
        const [mx, my] = data(svg, 'mug');
        const dev = q(svg, '.dev')!;
        const h = q(svg, '.hand');
        if (h) tl.to(q(h, '.hd-in'), { y: -1400, duration: 0.5, ease: 'power2.in' }, at);
        tl.to(dev, { x: mx + 260, y: my + 120, duration: 0.6, ease: 'power2.inOut' }, at + 0.1);
        qa(svg, '.dozer .bot').forEach((b) => tl.to(b, { y: 0, duration: 0.2 }, at));
        qa(svg, '.dozer .b-arm').forEach((b) => tl.to(b, { rotation: 0, scale: 1, duration: 0.2 }, at));
    },
    dodgem({ tl, svg }, at) {
        // and they bonk off it one after another, like dodgems
        const [mx, my] = data(svg, 'mug');
        const cx = mx + 260, cy = my + 120;
        qa(svg, '.dozer').forEach((d, i) => {
            const t = at + i * 0.16;
            const ex = Number(d.dataset.ex), ey = Number(d.dataset.ey);
            tl.to(d, { x: cx + 110 + (i % 3) * 20, y: cy + 30 + (i % 4) * 14, duration: 0.45, ease: 'power2.in' }, t);
            tl.to(d, { x: (cx + ex) / 2 + 60, y: (cy + ey) / 2 + 40, duration: 0.5, ease: 'power3.out' }, t + 0.45);
            tl.to(q(d, '.veh'), { rotation: 360, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.out' }, t + 0.45);
        });
        tl.to(q(svg, '.dev .mug'), { keyframes: [{ x: -4 }, { x: 4 }, { x: 0 }], duration: 0.2, repeat: 5 }, at + 0.45);
    },
    stamp({ tl, svg }, at) {
        // a giant rubber stamp comes down from above onto the corner, and lifts away
        const s = q(svg, '.stamper')!;
        const im = q(svg, '.imprint')!;
        tl.set(s, { visibility: 'visible' }, at);
        tl.fromTo(q(s, '.sp-in'), { y: -1500 }, { y: 0, duration: 0.45, ease: 'power3.in' }, at);
        tl.set(im, { visibility: 'visible' }, at + 0.45);
        tl.to(svg.querySelector('.world'), { keyframes: [{ y: 14 }, { y: -8 }, { y: 4 }, { y: 0 }], duration: 0.3, ease: 'none' }, at + 0.45);
        tl.to(q(s, '.sp-in'), { y: -1600, duration: 0.6, ease: 'power2.in' }, at + 1.0);
    },
    scar({ tl, svg }, at) {
        const s = q(svg, '.scar')!;
        tl.fromTo(s, { visibility: 'visible', opacity: 0 }, { opacity: 1, duration: 0.4 }, at);
        tl.set(q(svg, '.roads .tracks'), { visibility: 'visible' }, at);
        tl.fromTo(q(svg, '.roads .tracks'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, at);
        tl.fromTo(q(s, '.statue .st-in'), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'bounce.out' }, at + 0.4);
    },
};

export function mountTown(wrap: HTMLElement) {
    const svg = wrap.querySelector<SVGSVGElement>('svg.town')!;
    const ev = JSON.parse(svg.dataset.event || '{}') as TownEvent;
    const count = wrap.querySelector<HTMLElement>('[data-count]');
    const hint = wrap.querySelector<HTMLElement>('[data-hint]');
    const pokeBtn = wrap.querySelector<HTMLButtonElement>('[data-poke]');
    const caption = wrap.querySelector<HTMLElement>('[data-caption]');
    const after = document.querySelector<HTMLElement>('[data-after]');
    const beats = ev.beats;
    let i = -1;
    let tl: gsap.core.Timeline | null = null;
    let loops: gsap.core.Animation[] = [];
    let waitingPoke = false;
    let autoPoke: gsap.core.Tween | null = null;

    // the camera: a point and a zoom, written into the viewBox; a tall screen works closer in
    const cam = { x: 0, y: 380, z: 1 };
    const view = () => {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        const aspect = w / Math.max(1, h);
        const W = (aspect >= 1 ? 1800 : 760) / cam.z, H = W / aspect;
        svg.setAttribute('viewBox', `${(cam.x - W / 2).toFixed(1)} ${(cam.y - H / 2).toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`);
    };
    addEventListener('resize', view);

    // lines: a bubble over its speaker, or a caption across the top; each stays until the next beat's picture
    const lineOn = (b: Beat, t: gsap.core.Timeline, at: number) => {
        if (!b.line) return;
        if (b.line.who === 'caption') {
            t.call(() => { if (caption) { caption.textContent = b.line!.text; caption.hidden = false; gsap.fromTo(caption, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }); } }, [], at);
            return;
        }
        const bub = q(svg, `.bubble[data-beat="${b.id}"]`);
        if (!bub) return;
        t.call(() => { const [x, y] = anchor(svg, b.line!.who); bub.setAttribute('transform', `translate(${x} ${y})`); }, [], at - 0.01);
        t.set(bub, { visibility: 'visible' }, at);
        t.fromTo(q(bub, '.b-in'), { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.25, ease: 'back.out(2.4)' }, at);
    };
    const linesOff = () => { qa(svg, '.bubble').forEach((b) => gsap.set(b, { visibility: 'hidden' })); if (caption) caption.hidden = true; };

    const playBeat = (b: Beat, t: gsap.core.Timeline, start: number) => {
        const ctx: Ctx = { tl: t, svg, ev, beat: b, loops };
        b.do.forEach((v) => {
            const [name, at] = v.split('@');
            if (!VERBS[name]) console.warn(`town: no verb "${name}"`);
            else VERBS[name](ctx, Number(at || 0) + start);
        });
        if (b.line) lineOn(b, t, b.line.after + start);
    };

    const show = (n: number, instant = false) => {
        if (n < 0 || n >= beats.length || n === i) return;
        tl?.progress(1);
        tl?.kill();
        autoPoke?.kill();
        loops.forEach((l) => l.kill());
        loops = [];
        waitingPoke = false;
        wrap.classList.remove('poking');
        if (pokeBtn) pokeBtn.hidden = true;
        i = n;
        const b = beats[i];
        tl = gsap.timeline({ onComplete: () => loops.forEach((l) => l.play()) });
        const [x, y] = anchor(svg, b.camera.on);
        tl.to(cam, { x, y: y + 40, z: b.camera.zoom, duration: 1.1, ease: 'power2.inOut', onUpdate: view }, 0);
        // the last beat's line stays until this beat's picture has played
        // (a beat that waits for its poke clears them after the poke's picture instead)
        if (!b.poke || instant) tl.call(linesOff, [], instant ? 0 : 1.4);
        if (b.poke && !instant) {
            waitingPoke = true;
            wrap.classList.add('poking');
            if (pokeBtn) { pokeBtn.hidden = false; pokeBtn.textContent = b.poke; }
            autoPoke = gsap.delayedCall(b.pokeWait ?? 3, () => poke());
        } else playBeat(b, tl, 0.6);
        if (instant) tl.progress(1);
        if (count) count.textContent = `${i + 1} / ${beats.length}`;
        const last = i === beats.length - 1;
        wrap.classList.toggle('at-end', last);
        if (hint) hint.hidden = last;
        if (after) after.classList.toggle('on', last);
    };

    function poke() {
        if (!waitingPoke || !tl) return;
        autoPoke?.kill();
        waitingPoke = false;
        wrap.classList.remove('poking');
        if (pokeBtn) pokeBtn.hidden = true;
        tl.progress(1);
        const t = gsap.timeline({ onComplete: () => loops.forEach((l) => l.play()) });
        tl = t;
        playBeat(beats[i], t, 0);
        t.call(linesOff, [], 1.0);
    }

    // an input during a beat finishes it; the poke beat takes the input as its poke
    const next = () => {
        if (waitingPoke) { poke(); return; }
        if (tl && tl.progress() < 1) { tl.progress(1); return; }
        show(i + 1);
    };

    // a clean town: every moved thing back where the markup put it
    const snapshot = qa(svg, '.world, .dozer, .truck, .ambulance, .parcel, .hand, .hand .hd-in, .hand .open, .hand .thumb, .stamper, .stamper .sp-in, .imprint, .scar, .statue .st-in, .bld .body, .label .l-in, .roofnum, .roofnum .rn, .load rect, .honk, .honk .h-in, .horn, .b-arm, .bot, .veh, .bubble, .bubble .b-in, .stretcher, .stretcher .sx-in, .stretcher .one, .stretcher .sheet, .pile .pl, .dev, .dev .mug, .roads .tracks, .siren')
        .map((el) => [el, el.getAttribute('transform'), el.getAttribute('style'), el.classList.contains('rn') ? el.textContent : null] as const);
    const reset = () => snapshot.forEach(([el, tr, st, tx]) => {
        gsap.killTweensOf(el);
        if (tr === null) el.removeAttribute('transform'); else el.setAttribute('transform', tr);
        if (st === null) el.removeAttribute('style'); else el.setAttribute('style', st);
        if (tx !== null) el.textContent = tx;
    });
    const replayTo = (n: number) => {
        tl?.kill(); autoPoke?.kill(); loops.forEach((l) => l.kill()); loops = [];
        reset();
        linesOff();
        for (let k = 0; k <= n; k++) { i = k - 1; show(k, true); }
    };
    const prev = () => { if (i > 0) replayTo(i - 1); };

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
    if (reduce) {
        // the final town: the scar and the stamp, nothing moving
        for (let k = 0; k < beats.length; k++) { i = k - 1; show(k, true); }
        linesOff();
        loops.forEach((l) => l.kill());
        wrap.classList.add('still');
        view();
        return;
    }

    // reactions, as Content listed them; a statue does nothing
    const react = (el: El) => {
        if (el.classList.contains('bld')) {
            const hard = el.dataset.id === ev.target;
            gsap.fromTo(q(el, '.body'), { x: 0 }, { keyframes: hard ? [{ x: -5 }, { x: 5 }, { x: -4 }, { x: 4 }, { x: 0 }] : [{ x: -2 }, { x: 2 }, { x: 0 }], duration: hard ? 0.5 : 0.3, ease: 'none' });
        } else if (el.classList.contains('tree')) gsap.fromTo(q(el, '.leaves'), { rotation: 0 }, { keyframes: [{ rotation: 8 }, { rotation: -6 }, { rotation: 0 }], transformOrigin: '50% 100%', duration: 0.5 });
        else if (el.classList.contains('mug')) gsap.fromTo(q(el, '.coffee'), { y: 0 }, { keyframes: [{ y: -6 }, { y: 2 }, { y: 0 }], duration: 0.4 });
        else if (el.classList.contains('truck')) gsap.fromTo(q(el, '.cap'), { y: 0, rotation: 0 }, { y: -8, rotation: -20, transformOrigin: '0% 100%', duration: 0.18, yoyo: true, repeat: 1 });
        else if (el.classList.contains('dozer')) { gsap.fromTo(q(el, '.veh'), { x: 0 }, { keyframes: [{ x: -3 }, { x: 3 }, { x: 0 }], duration: 0.2 }); gsap.fromTo(q(el, '.b-arm'), { rotation: 0 }, { rotation: -70, transformOrigin: '0% 100%', duration: 0.15, yoyo: true, repeat: 1 }); }
        else if (el.classList.contains('stretcher')) gsap.fromTo(q(el, '.sheet'), { scaleY: 1 }, { scaleY: 1.2, transformOrigin: '50% 100%', duration: 0.1, yoyo: true, repeat: 1 });
        else { const v = q(el, '.veh'); if (v) gsap.fromTo(v, { y: 0 }, { y: -14, duration: 0.14, yoyo: true, repeat: 1 }); }
    };
    q(svg, '.stretcher')?.classList.add('react');
    qa(svg, '.react').forEach((el) => {
        el.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') react(el); });
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            // on the poke beat, poking a bulldozer is the poke
            if (waitingPoke && el.classList.contains('dozer')) { poke(); return; }
            react(el);
        });
    });

    wrap.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a, button')) return; next(); });
    pokeBtn?.addEventListener('click', (e) => { e.stopPropagation(); poke(); });
    addEventListener('keydown', (e) => {
        if (e.target instanceof HTMLElement && e.target.closest('input, textarea, a, button')) return;
        const busy = waitingPoke || (tl !== null && tl.progress() < 1);
        if ([' ', 'Enter', 'ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) { if (i < beats.length - 1 || busy) { e.preventDefault(); next(); } }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { if (i > 0 && scrollY < 10) { e.preventDefault(); prev(); } }
    });
    let lastWheel = 0;
    wrap.addEventListener('wheel', (e) => {
        const busy = waitingPoke || (tl !== null && tl.progress() < 1);
        if (i >= beats.length - 1 && e.deltaY > 0 && !busy) return; // at the end the page scrolls on to the links
        e.preventDefault();
        const now = performance.now();
        if (now - lastWheel < 650) return;
        lastWheel = now;
        if (e.deltaY > 0) next(); else prev();
    }, { passive: false });
    document.querySelectorAll('[data-replay]').forEach((b) => b.addEventListener('click', () => { scrollTo({ top: 0, behavior: 'smooth' }); tl?.kill(); reset(); linesOff(); i = -1; show(0); }));
    if (location.search.includes('debug')) (window as any).__town = { show, next, poke, get i() { return i; }, get tl() { return tl; }, get waiting() { return waitingPoke; }, n: beats.length };
    view();
    show(0);
}
