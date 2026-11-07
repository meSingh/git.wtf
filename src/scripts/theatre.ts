// The puppet theatre's engine. It reads the act script (src/theatre/acts/<id>.json, embedded on the stage) and
// builds one timeline from it: each act is a label, each beat a verb from VERBS below. The timeline is pinned and
// scrubbed by the scroll, both ways. Puppets move like puppets: a hop on every step, a wobble when they stop.
// With reduced motion the stage is set to the finale, stamp down, and nothing moves.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ActScript, Beat } from '../theatre/script';

gsap.registerPlugin(ScrollTrigger);

type El = SVGGraphicsElement;
interface Ctx {
    tl: gsap.core.Timeline;
    svg: SVGSVGElement;
    q: (s: string) => El;
    qa: (s: string) => El[];
    who: (name: string) => El[];
    act: string;
    script: ActScript;
}

const FLOOR = 760;
const DOOR = 800;

// ---------- puppet moves ----------

/** Where each puppet stands at the point of the timeline being built (the tweens only learn it when they play). */
const pos = new WeakMap<Element, number>();
const xOf = (p: El) => pos.get(p) ?? Number((p as SVGElement).dataset.x ?? 0);
const toX = (tl: gsap.core.Timeline, p: El, x: number, vars: gsap.TweenVars, at: gsap.Position) => { pos.set(p, x); return tl.to(p, { x, ...vars }, at); };

/** Walk a puppet to x: a hop per step, a lean into the walk, a wobble on arrival. */
function walk(tl: gsap.core.Timeline, p: El, from: number | null, to: number, at: gsap.Position = '>', speed = 520) {
    const bob = p.querySelector('.bob')!;
    const start = from ?? xOf(p);
    pos.set(p, to);
    const dist = Math.abs(to - start);
    const steps = Math.max(2, Math.round(dist / 70));
    const dur = Math.max(0.35, dist / speed);
    const dir = to > start ? 1 : -1;
    tl.addLabel('w', at);
    if (from !== null) tl.set(p, { x: from, visibility: 'visible' }, 'w');
    tl.to(p, { x: to, duration: dur, ease: 'none' }, 'w');
    tl.to(bob, { y: -14, duration: dur / steps / 2, ease: 'power1.out', yoyo: true, repeat: steps * 2 - 1 }, 'w');
    tl.to(bob, { rotation: 5 * dir, duration: 0.12, ease: 'power2.out' }, 'w');
    tl.to(bob, { keyframes: [{ rotation: -6 * dir }, { rotation: 4 * dir }, { rotation: -2 * dir }, { rotation: 0 }], duration: 0.45, ease: 'none' }, `w+=${dur}`);
}

/** A little hop on the spot. */
const hop = (tl: gsap.core.Timeline, p: El, at: gsap.Position = '>', h = 18) => tl.to(p.querySelector('.bob'), { y: -h, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1 }, at);

/** Turn an arm (around its shoulder) to an angle. */
const arm = (tl: gsap.core.Timeline, p: El, side: 'l' | 'r', deg: number, at: gsap.Position = '>', d = 0.2) =>
    tl.to(p.querySelector(`.arm-${side}`), { rotation: deg, transformOrigin: '50% 0%', duration: d, ease: 'back.out(2)' }, at);

/** Put a puppet somewhere, visible or not, in one go. */
const place = (tl: gsap.core.Timeline, p: El, x: number, at: gsap.Position, vis = true) => { pos.set(p, x); return tl.set(p, { x, y: 0, visibility: vis ? 'visible' : 'hidden' }, at); };

// ---------- the verbs a script can use ----------

const VERBS: Record<string, (c: Ctx, b: Beat, at: gsap.Position) => void> = {
    curtainUp({ tl, q }, _b, at) {
        tl.to(q('.curtain'), { y: -1500, duration: 1.2, ease: 'power2.in' }, at);
    },

    walk({ tl, who }, b, at) {
        const [p] = who(String(b.who));
        walk(tl, p, (b.from as number) ?? null, b.to as number, at);
        if (b.yawn) tl.to(p.querySelector('.head'), { rotation: -14, transformOrigin: '50% 100%', duration: 0.3, yoyo: true, repeat: 1 }, '<0.2');
    },

    sip({ tl, who }, b, at) {
        const [p] = who(String(b.who));
        arm(tl, p, 'l', 70, at, 0.3);
        tl.to(p.querySelector('.head'), { rotation: 8, transformOrigin: '50% 100%', duration: 0.25 }, '<');
        arm(tl, p, 'l', 0, '>0.4', 0.3);
        tl.to(p.querySelector('.head'), { rotation: 0, transformOrigin: '50% 100%', duration: 0.25 }, '<');
    },

    hangSock({ tl, who, q }, b, at) {
        const [p] = who(String(b.who));
        const sock = q('.sock');
        // up on tiptoe, reach to the chimney, and the sock is there
        toX(tl, p, 760, { duration: 0.4, ease: 'power1.inOut' }, at);
        hop(tl, p, '<', 10);
        tl.to(p.querySelector('.bob'), { y: -120, duration: 0.35, ease: 'back.out(1.6)' }, '>');
        arm(tl, p, 'r', -150, '<', 0.3);
        tl.fromTo(sock, { visibility: 'visible', scale: 0.2, transformOrigin: '50% 0%' }, { scale: 1, transformOrigin: '50% 0%', duration: 0.3, ease: 'back.out(3)' }, '>');
        tl.to(sock, { keyframes: [{ rotation: 14 }, { rotation: -10 }, { rotation: 5 }, { rotation: 0 }], transformOrigin: '50% 0%', duration: 0.6, ease: 'none' }, '>');
        arm(tl, p, 'r', 0, '<', 0.3);
        tl.to(p.querySelector('.bob'), { y: 0, duration: 0.3, ease: 'bounce.out' }, '<');
    },

    pat({ tl, who }, b, at) {
        const [p] = who(String(b.who));
        const times = (b.times as number) ?? 2;
        tl.addLabel('pat', at);
        for (let i = 0; i < times; i++) {
            arm(tl, p, 'r', -120, `pat+=${i * 0.3}`, 0.12);
            arm(tl, p, 'r', -95, `pat+=${i * 0.3 + 0.15}`, 0.1);
            tl.to('.house .shell', { scaleY: 0.97, transformOrigin: '50% 100%', duration: 0.08, yoyo: true, repeat: 1 }, `pat+=${i * 0.3 + 0.12}`);
        }
        arm(tl, p, 'r', 0, '>', 0.2);
    },

    queue({ tl, who }, b, at) {
        const agents = who('agents');
        const from = (b.from as number) ?? 1720;
        tl.addLabel('queue', at);
        agents.forEach((a, i) => {
            place(tl, a, from + i * 60, 'queue');
            // they shuffle up into a line from the wings, the first one nearest the door
            walk(tl, a, null, 980 + i * 64, `queue+=${i * 0.05}`, 900);
        });
    },

    squeezeIn({ tl, who, q }, b, at) {
        const agents = who('agents');
        const door = (b.door as number) ?? DOOR;
        const shell = q('.house .shell');
        const walls = q('.house .walls');
        tl.addLabel('sq', at);
        agents.forEach((a, i) => {
            const t = `sq+=${i * 0.55}`;
            const last = i === agents.length - 1;
            // the rest of the queue shuffles one place on
            agents.slice(i + 1).forEach((b2, k) => toX(tl, b2, 980 + k * 64, { duration: 0.3, ease: 'power1.inOut' }, t));
            walk(tl, a, null, door + 30, t, 900);
            if (i === 0) tl.to(a.querySelector('.arm-r'), { rotation: -150, transformOrigin: '50% 0%', duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.12 }, '>');
            if (!last) {
                tl.to(a.querySelector('.body'), { scaleX: 0.3, transformOrigin: '50% 100%', duration: 0.22, ease: 'power2.in' }, '>');
                tl.to(a, { x: door, duration: 0.22, ease: 'power2.in' }, '<');
                tl.set(a, { visibility: 'hidden' }, '>');
                tl.set(a.querySelector('.body'), { scaleX: 1 }, '>');
            } else {
                // the twelfth sticks halfway, legs kicking, until the door slams and it pops in
                tl.to(a.querySelector('.body'), { scaleX: 0.6, transformOrigin: '50% 100%', duration: 0.2, ease: 'power2.in' }, '>');
                tl.to(a, { x: door + 4, duration: 0.2, ease: 'power2.in' }, '<');
                tl.to(a.querySelectorAll('.leg'), { rotation: (k: number) => (k ? 40 : -40), transformOrigin: '50% 0%', duration: 0.09, yoyo: true, repeat: 7, ease: 'none' }, '>');
                tl.to(q('.house .door'), { scaleX: 0.15, transformOrigin: '0% 50%', duration: 0.08, yoyo: true, repeat: 1 }, '>');
                tl.to(a.querySelector('.body'), { scale: 0.1, transformOrigin: '50% 100%', duration: 0.12, ease: 'power3.in' }, '<0.06');
                tl.to(a, { x: door, duration: 0.12 }, '<');
                tl.set(a, { visibility: 'hidden' }, '>');
                tl.set(a.querySelector('.body'), { scale: 1, scaleX: 1 }, '>');
            }
            const k = (i + 1) / agents.length;
            tl.to(shell, { scaleX: 1 + 0.42 * k, scaleY: 1 + 0.3 * k, transformOrigin: '50% 100%', duration: 0.3, ease: 'elastic.out(1.2, 0.4)' }, '>-0.05');
            tl.to(walls, { attr: { rx: 6 + 104 * k }, duration: 0.3, ease: 'power2.out' }, '<');
            if (i === 0) tl.to(q('.house .walls-edge'), { opacity: 0, duration: 0.2 }, '<');
            tl.to(shell, { rotation: i % 2 ? 1.5 : -1.5, transformOrigin: '50% 100%', duration: 0.06, yoyo: true, repeat: 1 }, '<');
        });
    },

    chimneyArm({ tl, q }, _b, at) {
        const a = q('.chimney-arm');
        tl.fromTo(a, { visibility: 'visible', scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.25, ease: 'back.out(2)' }, at);
        tl.to(a, { rotation: 22, transformOrigin: '50% 100%', duration: 0.18, yoyo: true, repeat: 15, ease: 'sine.inOut' }, '>');
    },

    papers({ tl, qa, q }, b, at) {
        const papers = qa('.paper');
        const n = Math.min(papers.length, (b.count as number) ?? papers.length);
        const toSock = (b.toSock as number) ?? 0;
        const sock = q('.sock');
        tl.addLabel('pp', at);
        let t = 0;
        for (let i = 0; i < n; i++) {
            const p = papers[i];
            const intoSock = i % Math.max(1, Math.floor(n / Math.max(1, toSock))) === 3 && toSock > 0;
            // a few, then a stream, then a blizzard: the gaps shrink as it goes
            t += Math.max(0.035, 0.28 * Math.pow(0.9, i));
            const tx = intoSock ? 908 : 300 + ((i * 263) % 1000);
            const ty = intoSock ? 486 : 150 + ((i * 97) % 330);
            tl.set(p, { visibility: 'visible', x: 882, y: 444, rotation: 0, scale: 0.6 }, `pp+=${t}`);
            tl.to(p, { x: tx, duration: intoSock ? 1.1 : 1.6, ease: intoSock ? 'sine.inOut' : 'power1.out' }, `pp+=${t}`);
            tl.to(p, { y: intoSock ? ty : ty, scale: intoSock ? 0.5 : 1, rotation: (i % 2 ? 1 : -1) * (200 + i * 13), duration: intoSock ? 1.1 : 1.6, ease: intoSock ? 'power2.in' : 'power2.out' }, `pp+=${t}`);
            if (intoSock) {
                tl.set(p, { visibility: 'hidden' }, '>');
                tl.to(sock, { scaleX: '+=0.12', scaleY: '+=0.07', transformOrigin: '50% 0%', duration: 0.15, ease: 'back.out(3)' }, '<');
            }
        }
    },

    count({ tl, q, script }, _b, at) {
        const el = q('.roofnum');
        const to = script.set.house?.number ?? 0;
        if (!el) return;
        const o = { v: 0 };
        tl.to(o, { v: to, duration: 2.6, ease: 'power2.in', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-GB'); } }, at);
    },

    rescue({ tl, who, q, svg }, _b, at) {
        const [a, b] = who('agents');
        const door = q('.house .door');
        const stack = q('.stack');
        const bubble = svg.querySelector<El>('.bubble[data-act="rescue"]');
        tl.addLabel('rs', at);
        // the door bursts open; the first one carries out a neat stack, sets it down, salutes it
        tl.to(door, { scaleX: -0.2, transformOrigin: '0% 50%', duration: 0.15, ease: 'power3.out' }, 'rs');
        place(tl, a, DOOR, 'rs');
        tl.set(stack, { visibility: 'visible', x: DOOR, y: -30 }, 'rs');
        walk(tl, a, null, 650, 'rs+=0.1', 260);
        tl.to(stack, { x: 650, duration: 0.58, ease: 'none' }, 'rs+=0.1');
        tl.to(stack, { y: 0, duration: 0.25, ease: 'bounce.out' }, '>');
        if (bubble) tl.fromTo(bubble, { visibility: 'visible', scale: 0, transformOrigin: '50% 100%' }, { scale: 1, transformOrigin: '50% 100%', duration: 0.25, ease: 'back.out(2.4)' }, '<');
        toX(tl, a, 600, { duration: 0.25, ease: 'power1.out' }, '>');
        arm(tl, a, 'r', -130, '>', 0.15);
        tl.to({}, { duration: 0.5 });
        if (bubble) tl.to(bubble, { scale: 0, transformOrigin: '50% 100%', duration: 0.18, ease: 'power2.in' }, '>');
        arm(tl, a, 'r', 0, '<', 0.15);
        // the second sweeps it up and posts it up the chimney
        place(tl, b, DOOR, '<');
        walk(tl, b, null, 668, '>', 520);
        tl.to(stack, { y: -60, duration: 0.15 }, '>');
        tl.to(stack, { keyframes: [{ x: 760, y: -360 }, { x: 882, y: -330 }], duration: 0.6, ease: 'power1.inOut' }, '>');
        tl.set(stack, { visibility: 'hidden' }, '>');
        // a high five, and back in
        toX(tl, a, 660, { duration: 0.2 }, '<');
        toX(tl, b, 700, { duration: 0.2 }, '<');
        arm(tl, a, 'r', -160, '>', 0.1);
        arm(tl, b, 'l', 160, '<', 0.1);
        hop(tl, a, '>');
        hop(tl, b, '<');
        arm(tl, a, 'r', 0, '>', 0.12);
        arm(tl, b, 'l', 0, '<', 0.12);
        walk(tl, a, null, DOOR, '>', 700);
        walk(tl, b, null, DOOR, '<0.1', 700);
        tl.set([a, b], { visibility: 'hidden' }, '>');
        tl.to(door, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.1 }, '<');
        // and out of the top it comes, some of it into the sock
        const ps = Array.from(svg.querySelectorAll<El>('.paper')).slice(0, 8);
        ps.forEach((p, i) => {
            const toSock = i % 3 === 0;
            tl.set(p, { visibility: 'visible', x: 882, y: 444, rotation: 0, scale: 0.6 }, `>${i ? -0.25 : 0}`);
            tl.to(p, { x: toSock ? 908 : 700 + i * 70, y: toSock ? 486 : 150 - i * 30, rotation: 300, scale: toSock ? 0.4 : 1, duration: 0.6, ease: 'power2.out' }, '<');
            if (toSock) tl.to(q('.sock'), { scaleX: '+=0.1', scaleY: '+=0.06', transformOrigin: '50% 0%', duration: 0.12 }, '>-0.1');
        });
    },

    deflate({ tl, q, qa }, _b, at) {
        const shell = q('.house .shell');
        tl.addLabel('df', at);
        tl.to(qa('.paper'), { y: '+=1400', rotation: '+=120', duration: 1.2, ease: 'power2.in', stagger: 0.01 }, 'df');
        tl.to(shell, { scaleY: 1.5, scaleX: 1.35, transformOrigin: '50% 100%', duration: 0.3, ease: 'power2.out' }, 'df');
        tl.to(shell, { scaleY: 0.08, scaleX: 1.7, transformOrigin: '50% 100%', duration: 0.6, ease: 'power3.in' }, '>');
        tl.to([q('.roofnum'), q('.chimney-arm')], { autoAlpha: 0, duration: 0.2 }, '<');
        tl.set(q('.house .flatdoor'), { visibility: 'visible' }, '>');
        tl.to(q('.sock'), { x: 905, y: 742, rotation: 85, transformOrigin: '50% 0%', duration: 0.45, ease: 'bounce.out' }, '<');
    },

    peek({ tl, who, q }, b, at) {
        const [p] = who(String(b.who));
        const door = q('.house .flatdoor');
        toX(tl, p, 730, { duration: 0.4 }, at);
        hop(tl, p, '<', 10);
        tl.to(p.querySelector('.bob'), { rotation: 18, transformOrigin: '50% 100%', duration: 0.3 }, '>');
        tl.to(door, { rotation: -70, transformOrigin: '100% 50%', duration: 0.3, ease: 'back.out(2)' }, '<');
        tl.to({}, { duration: 0.4 });
        tl.to(p.querySelector('.bob'), { rotation: 0, transformOrigin: '50% 100%', duration: 0.25 }, '>');
        tl.to(door, { rotation: 0, transformOrigin: '100% 50%', duration: 0.2, ease: 'bounce.out' }, '<');
        toX(tl, p, 600, { duration: 0.3 }, '>');
    },

    ring({ tl, who }, _b, at) {
        const agents = who('agents');
        const n = agents.length;
        tl.addLabel('rg', at);
        // up through the flat roof, each pointing at the one beside it; then the pointing goes round like a clock
        agents.forEach((a, i) => {
            const ang = Math.PI - (i / (n - 1)) * Math.PI;
            const x = 800 + Math.cos(ang) * 250;
            const y = -40 - Math.sin(ang) * 70;
            pos.set(a, x);
            tl.set(a, { visibility: 'visible', x, y: 60, scale: 0.8 }, 'rg');
            tl.to(a, { y, duration: 0.4, ease: 'back.out(2.2)' }, `rg+=${i * 0.07}`);
            arm(tl, a, i % 2 ? 'l' : 'r', i % 2 ? 100 : -100, '>', 0.18);
        });
        agents.forEach((a, i) => {
            arm(tl, a, i % 2 ? 'l' : 'r', i % 2 ? 60 : -60, `rg+=${1.2 + i * 0.12}`, 0.15);
            arm(tl, a, i % 2 ? 'l' : 'r', i % 2 ? 120 : -120, '>', 0.15);
        });
    },

    pullPile({ tl, who, q, qa }, b, at) {
        const [p] = who(String(b.who));
        const sock = q('.sock');
        const sheets = qa('.pile .sheet');
        tl.addLabel('pl', at);
        // the agents drop back to the floor and wait in a row
        who('agents').forEach((a, i) => toX(tl, a, 860 + i * 46, { y: 0, scale: 0.8, duration: 0.5, ease: 'power2.inOut' }, `pl+=${i * 0.02}`));
        who('agents').forEach((a) => tl.to(a.querySelector('.bob'), { rotation: 0, duration: 0.3 }, 'pl'));
        who('agents').forEach((a) => arm(tl, a, 'l', 0, 'pl', 0.2));
        who('agents').forEach((a) => arm(tl, a, 'r', 0, 'pl', 0.2));
        // DEV notices the sock, picks it up, and pulls papers out like a handkerchief, on and on
        walk(tl, p, null, 860, 'pl+=0.2', 500);
        tl.to(p.querySelector('.bob'), { rotation: 30, transformOrigin: '50% 100%', duration: 0.2 }, '>');
        tl.to(sock, { x: 880, y: 640, rotation: 0, duration: 0.3, ease: 'power2.out' }, '>');
        tl.to(p.querySelector('.bob'), { rotation: 0, transformOrigin: '50% 100%', duration: 0.2 }, '<');
        walk(tl, p, null, 690, '>', 520);
        tl.to(sock, { x: 710, y: 640, duration: 0.4, ease: 'none' }, '<');
        tl.set(sheets, { scaleY: 0, transformOrigin: '50% 100%', visibility: 'visible' }, '<');
        sheets.forEach((s, i) => {
            arm(tl, p, 'r', i % 2 ? -40 : -10, `>${i ? -0.05 : 0.1}`, 0.1);
            tl.fromTo(s, { scaleY: 0, x: 120, y: -120 }, { scaleY: 1, x: 0, y: 0, transformOrigin: '50% 100%', duration: 0.18, ease: 'back.out(2)' }, '<');
        });
        arm(tl, p, 'r', 0, '>', 0.2);
    },

    palmBounce({ tl, who }, _b, at) {
        const [p] = who('dev');
        const agents = who('agents');
        tl.addLabel('pb', at);
        // they all reach for the pile; DEV raises one flat palm and they bounce off it, one after another
        arm(tl, p, 'r', -100, 'pb', 0.2);
        agents.forEach((a, i) => {
            const t = `pb+=${0.3 + i * 0.16}`;
            arm(tl, a, 'l', 80, t, 0.1);
            tl.to(a, { x: 760, duration: 0.22, ease: 'power2.in' }, t);
            tl.to(a, { x: 860 + i * 46, duration: 0.5, ease: 'power3.out' }, '>');
            tl.to(a.querySelector('.bob'), { rotation: 360, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.out' }, '<');
            arm(tl, a, 'l', 0, '<0.3', 0.1);
        });
    },

    stamp({ tl, q, svg }, _b, at) {
        const s = q('.stampmark');
        tl.addLabel('finale', at);
        tl.fromTo(s, { visibility: 'visible', scale: 3.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'power4.in' }, 'finale');
        tl.to(svg.querySelectorAll('.house, .puppet, .pile, .sock, .floor'), { y: '+=10', duration: 0.05, yoyo: true, repeat: 1 }, '>');
        tl.addLabel('stamped', '>');
        tl.to({}, { duration: 1.2 });
        tl.to(q('.curtain'), { y: 0, duration: 0.9, ease: 'bounce.out' }, '>');
    },
};

function lineFor(c: Ctx, act: string) {
    const b = c.svg.querySelector<El>(`.bubble[data-act="${act}"]`);
    if (!b || act === 'rescue') return; // the rescue times its own line
    // the line pops up early in its act and goes before the act ends
    const start = c.tl.labels[act] + 0.4;
    const end = Math.max(start + 1.6, c.tl.duration() - 0.3);
    c.tl.fromTo(b, { visibility: 'visible', scale: 0, transformOrigin: '50% 100%' }, { scale: 1, transformOrigin: '50% 100%', duration: 0.25, ease: 'back.out(2.4)' }, start);
    c.tl.to(b, { scale: 0, transformOrigin: '50% 100%', duration: 0.2, ease: 'power2.in' }, end);
    c.tl.set(b, { visibility: 'hidden' }, end + 0.2);
}

/** Build the play on a stage element. Returns the timeline (paused when scrubbed by the scroll). */
export function play(stageWrap: HTMLElement) {
    const svg = stageWrap.querySelector<SVGSVGElement>('svg.stage')!;
    const script = JSON.parse(svg.dataset.script || '{}') as ActScript;
    const q = (s: string) => svg.querySelector<El>(s)!;
    const qa = (s: string) => Array.from(svg.querySelectorAll<El>(s));
    const who = (name: string) => (name === 'agents' ? qa('.agent') : name === 'dev' ? qa('.dev') : name.startsWith('agent') ? [qa('.agent')[Number(name.slice(5)) || 0]] : qa(`.${name}`));

    // the stage keeps its middle on narrow screens: the viewBox follows the shape of the screen
    const valance = svg.querySelector<SVGGElement>('.valance');
    const fit = () => {
        const w = stageWrap.clientWidth, h = stageWrap.clientHeight;
        const aspect = w / Math.max(1, h);
        // 1200 x 750 of the set on a wide screen; on a tall one, at least 560 wide and as tall as it takes
        const vw = Math.max(560, Math.min(1200, 750 * aspect));
        const vh = Math.max(750, vw / aspect);
        const vx = 800 - vw / 2, vy = 900 - vh;
        svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
        valance?.setAttribute('transform', `translate(0 ${vy})`);
        // the sign and the stamp shrink to fit a narrow view
        const sign = svg.querySelector<SVGGElement>('.signfit');
        if (sign) sign.setAttribute('transform', `scale(${Math.min(1, (vw - 30) / Number(sign.dataset.w || 600)).toFixed(3)})`);
        svg.querySelector('.stampfit')?.setAttribute('transform', `scale(${Math.min(1, (vw - 20) / 960).toFixed(3)})`);
    };
    fit();
    addEventListener('resize', fit);

    qa('.puppet').forEach((p) => gsap.set(p, { x: Number((p as SVGElement).dataset.x ?? 0), y: 0 }));
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
    const ctx: Ctx = { tl, svg, q, qa, who, act: '', script };
    script.acts.forEach((act) => {
        ctx.act = act.id;
        tl.addLabel(act.id, '>');
        act.beats.forEach((b, i) => {
            const fn = VERBS[b.do];
            if (!fn) { console.warn(`theatre: no verb "${b.do}"`); return; }
            fn(ctx, b, i === 0 ? act.id : b.with ? '<' : '>');
        });
        if (act.line) lineFor(ctx, act.id);
        tl.to({}, { duration: 0.5 }); // a breath between acts
    });
    return { tl, svg };
}

export function mountTheatre(wrap: HTMLElement) {
    const { tl } = play(wrap);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
    if (reduce) {
        // the finale as a still: stamp down, curtain up
        tl.progress(1).seek('stamped');
        wrap.classList.add('still');
        return;
    }
    if (location.search.includes('debug')) (window as any).__play = { tl, gsap, ScrollTrigger, labels: tl.labels };
    const st = ScrollTrigger.create({
        trigger: wrap,
        // pinned just under the site's bar
        start: () => `top ${Math.round(document.querySelector('.bar')?.getBoundingClientRect().height ?? 0)}px`,
        end: () => `+=${Math.round(Math.max(3200, tl.duration() * 120))}`,
        pin: true,
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: false,
    });
    document.querySelectorAll<HTMLElement>('[data-replay]').forEach((btn) => btn.addEventListener('click', () => scrollTo({ top: st.start, behavior: 'smooth' })));
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
