// The bit runtime. A bit's HTML is its end state: the fuck-up done, every caption shown, the status stamped. That is
// what reduced motion and no JavaScript get. With motion, a bit loads its script when it nears the viewport, sets
// its stage back to the start, and waits for the reader to press the control. One press builds one timeline: the
// bit's own action, the captions it reaches, then the remaining captions and the stamp. "Run it again" reverts the
// lot to the HTML, sets the start again and replays.
import gsap from 'gsap';

export interface BitApi {
    root: HTMLElement;
    gsap: typeof gsap;
    tl: gsap.core.Timeline;
    params: Record<string, any>;
    variant: string;
    q<T extends HTMLElement = HTMLElement>(sel: string): T | null;
    qa<T extends HTMLElement = HTMLElement>(sel: string): T[];
    /** Shows caption i (and any before it) at a point of the timeline. */
    cap(i: number, at?: gsap.Position): void;
    /** Prints lines one after another, like output arriving. */
    lines(els: Element[], at?: gsap.Position, gap?: number): void;
    /** Types an element's text out (its text in the HTML is the end). */
    type(el: Element | null, at?: gsap.Position, cps?: number): void;
    /** Rolls a number in an element's text from one value to another. */
    count(el: Element | null, from: number, to: number, duration?: number, at?: gsap.Position): void;
    /** Stops the timeline at a point until the reader presses a second control. */
    wait(btn: HTMLButtonElement | null, at?: gsap.Position): void;
}

export interface BitModule {
    /** Puts the stage at its start (gsap.set only, so a revert undoes it). */
    reset(api: Omit<BitApi, 'tl'>): void;
    /** Adds the action to api.tl. Kept within about two seconds. */
    play(api: BitApi): void;
}

const loaders: Record<string, () => Promise<BitModule>> = {
    'force-push': () => import('./force-push'),
    'reset-hard': () => import('./reset-hard'),
    'pushed-to-main': () => import('./pushed-to-main'),
    'committed-secret': () => import('./committed-secret'),
    'kept-both': () => import('./kept-both'),
    'wiped-worktree': () => import('./wiped-worktree'),
    'history-rewrite': () => import('./history-rewrite'),
    github: () => import('./github'),
    generic: () => import('./generic'),
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB');

export function reducedMotion(): boolean {
    return matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
}

/** Sets up every bit on the page as it comes near the viewport. */
export function bootBits(root: ParentNode = document) {
    if (reducedMotion()) return;
    const bits = Array.from(root.querySelectorAll<HTMLElement>('.bit[data-bit]'));
    const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            setup(e.target as HTMLElement);
        }),
        // only once it is actually on screen, so a bit just below the fold costs the first paint nothing
        { rootMargin: '0px 0px -10% 0px' },
    );
    bits.forEach((b) => io.observe(b));
}

const texts = new WeakMap<Element, string>();

async function setup(root: HTMLElement) {
    const load = loaders[root.dataset.bit ?? ''] ?? loaders.generic;
    const mod = await load();
    const q = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);
    const qa = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const caps = qa('.bit-caps li');
    const stamp = q('.stamp');
    const stage = q('.bit-stage');
    const go = q<HTMLButtonElement>('.bit-go');
    const again = q<HTMLButtonElement>('.bit-again');
    if (!go) return;
    const params = JSON.parse(root.dataset.params || '{}');
    const variant = root.dataset.variant || 'plain';
    // the end texts, read once before anything changes them
    qa('[data-type], [data-count]').forEach((el) => texts.set(el, el.textContent ?? ''));

    const base = { root, gsap, params, variant, q, qa };
    let ctx: gsap.Context | null = null;
    let tl: gsap.core.Timeline | null = null;

    const start = () => {
        ctx?.revert();
        ctx = gsap.context(() => {
            gsap.set(caps.slice(1), { autoAlpha: 0, y: 10 });
            if (stamp) gsap.set(stamp, { autoAlpha: 0, scale: 2.2, rotate: -14 });
            qa<HTMLButtonElement>('.bit-go2').forEach((b) => { b.hidden = true; });
            mod.reset(base);
        }, root);
        go.hidden = false;
        go.disabled = false;
        if (again) again.hidden = true;
        root.classList.add('ready');
        root.classList.remove('played', 'playing');
    };

    let focused = false;
    const run = () => {
        focused = root.contains(document.activeElement);
        root.classList.add('playing');
        go.disabled = true;
        let shown = 0;
        ctx!.add(() => {
            tl = gsap.timeline({ onComplete: done });
            const api: BitApi = {
                ...base,
                tl,
                cap(i, at = '>') {
                    for (let k = shown + 1; k <= Math.min(i, caps.length - 1); k++) tl!.to(caps[k], { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, k === shown + 1 ? at : '<0.12');
                    shown = Math.max(shown, Math.min(i, caps.length - 1));
                },
                lines(els, at = '>', gap = 0.12) {
                    if (!els.length) return;
                    tl!.set(els, { autoAlpha: 0 }, 0);
                    tl!.to(els, { autoAlpha: 1, duration: 0.01, stagger: gap }, at);
                },
                type(el, at = '>', cps = 70) {
                    if (!el) return;
                    const full = texts.get(el) ?? el.textContent ?? '';
                    const p = { n: 0 };
                    el.textContent = '';
                    tl!.to(p, { n: full.length, duration: full.length / cps, ease: 'none', onUpdate: () => { el.textContent = full.slice(0, Math.round(p.n)); } }, at);
                },
                count(el, from, to, duration = 0.8, at = '>') {
                    if (!el) return;
                    const p = { v: from };
                    el.textContent = fmt(from);
                    tl!.to(p, { v: to, duration, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(p.v); } }, at);
                },
                wait(btn, at = '>') {
                    if (!btn) return;
                    tl!.addPause(at, () => {
                        btn.hidden = false;
                        btn.onclick = () => { btn.hidden = true; tl!.play(); };
                        if (focused) btn.focus({ preventScroll: true });
                    });
                },
            };
            api.cap(1, 0);
            mod.play(api);
            // the rest of the retelling, then the punchline
            api.cap(caps.length - 1, '>0.15');
            if (stamp) {
                tl.to(stamp, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.22, ease: 'power4.in' }, '>0.1');
                if (stage) tl.fromTo(stage, { x: 0 }, { x: -4, duration: 0.03, yoyo: true, repeat: 3, ease: 'none' }, '<0.18');
                tl.to(stamp, { rotate: -2.6, scale: 1.01, duration: 0.08, ease: 'power2.out' });
                tl.to(stamp, { rotate: -2, scale: 1, duration: 0.1, ease: 'power2.inOut' });
            }
        });
    };

    function done() {
        root.classList.remove('playing');
        root.classList.add('played');
        go!.hidden = true;
        if (again) {
            again.hidden = false;
            // a keyboard reader who pressed the control lands on the replay, not at the top of the page
            if (focused) again.focus({ preventScroll: true });
        }
    }

    go.addEventListener('click', run);
    again?.addEventListener('click', () => { tl?.kill(); start(); run(); });
    start();
}
