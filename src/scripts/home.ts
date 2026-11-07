// The homepage, in the odometer's language. Everything here is motion layered on a page that reads complete as a
// still; with reduced motion (no js-anim flag) none of it runs.
//
// 1 The opening: the trip meter rolls down from the days since the first incident to today's count with motion
//   blur, the headline locks in word by word behind sweeping stripes. On scroll the wheels shrink and dock into
//   the bar as the odometer badge (scrubbed, so scrolling back undocks).
// 2 About two seconds in, the page scrolls slowly to the cut with a hint; any input stops it. With reduced motion
//   there is no auto-scroll, only the hint.
// 3 The cut plays the whole story as the reader scrolls: the player fragment and the engine load after the first
//   paint, then a pinned stage scrubs the cut's clock. Sound is off until the reader turns it on.
// 4 The record's gaps and the score's wheels roll to their counts on entry. Headings lock in word by word, once.
// Between sections a band of hazard stripes wipes across, scrubbed to scroll.
import gsap from 'gsap';
import { syncOdos, target } from './odometer';
import { roll } from './odo-roll';

const q = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const qa = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));
const html = document.documentElement;
let introDone = false;
const rolled = new WeakSet<Element>();

/** Splits an element's text into word spans for the lock-in (only when motion runs). */
function splitWords(el: HTMLElement): HTMLElement[] {
    if (el.dataset.split) return qa('.lw', el);
    const words = (el.textContent ?? '').trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
        const s = document.createElement('span');
        s.className = 'lw';
        s.textContent = w;
        el.appendChild(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.split = '1';
    return qa('.lw', el);
}

/** The cut: the player fragment into the stage, the engine loaded, the clock handed to the scroll. After first paint. */
let cutReady: Promise<import('./anime').CutHandle | null> | null = null;
function mountCut() {
    if (cutReady) return cutReady;
    const stage = q('#cut-stage');
    const box = stage && q('[data-cut-box]', stage);
    if (!stage || !box) return;
    cutReady = (async () => {
        // after the fonts have landed and the largest paint is done with them; well before the auto-scroll arrives
        await (document.fonts?.ready ?? Promise.resolve());
        await new Promise((r) => setTimeout(r, 450));
        try {
            const [html, { mountCutscene }] = await Promise.all([fetch(stage.dataset.player!).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); }), import('./anime')]);
            box.innerHTML = html;
            const wrap = q('#cutscene', box);
            const handle = wrap ? mountCutscene(wrap, { mode: 'scroll', soundDefault: false }) : undefined;
            if (!handle) return null;
            stage.classList.add('live');
            return handle;
        } catch {
            const wait = q('[data-cut-wait]', box);
            if (wait) wait.textContent = 'The cut did not load. Open it full screen below.';
            return null;
        }
    })();
    return cutReady;
}

/** 2 The auto-scroll: slowly down to the cut after the opening, unless the reader has already moved. */
let moved = false;
const stopAuto = () => { moved = true; };
['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, stopAuto, { passive: true, once: true }));
function autoScroll(delay: number) {
    const to = q('#cut') ?? q('#today');
    if (!to) return;
    gsap.delayedCall(delay, () => {
        if (moved || scrollY > 10) return;
        const target = to.getBoundingClientRect().top + scrollY;
        const o = { y: scrollY };
        const tween = gsap.to(o, { y: target, duration: 3.2, ease: 'power1.inOut', onUpdate: () => { if (moved) { tween.kill(); return; } scrollTo(0, o.y); } });
    });
}

/** Rolls a wheel from its start value to its target once, when told to. */
function rollOnce(el: HTMLElement, duration = 1.0) {
    if (rolled.has(el)) return;
    rolled.add(el);
    roll(el, target(el), Number(el.dataset.from ?? target(el)), duration, 'power3.out');
}

/** 1 The opening, once per page load. Needs only GSAP core, so it starts before the scroll machinery has loaded. */
function opening(odo: HTMLElement, odoWrap: HTMLElement) {
    const words = qa('.hh-words .w');
    const today = q('.hh-today');
    const wipe = q('.hh-wipe')!;
    const blur = document.querySelector('#vblur feGaussianBlur')!;
    const to = target(odo);
    const from = Number(odo.dataset.from ?? to + 20);
    const intro = gsap.timeline();
    odo.style.filter = 'url(#vblur)';
    intro.add(roll(odo, to, from, 2.1, 'power3.out', (speed) => blur.setAttribute('stdDeviation', `0 ${Math.min(28, speed * 0.55).toFixed(1)}`)), 0.15);
    intro.call(() => { odo.style.filter = ''; }, [], 2.3);
    intro.to(odoWrap, { keyframes: [{ x: -2, y: 1 }, { x: 2, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }], duration: 0.14, ease: 'none' }, 2.25);
    words.forEach((w, i) => {
        const at = 1.25 + i * 0.24;
        const left = i % 2 === 0;
        intro.fromTo(wipe, { x: 0, xPercent: left ? -120 : 520 }, { x: 0, xPercent: left ? 520 : -120, duration: 0.26, ease: 'none' }, at - 0.06);
        intro.fromTo(w, { autoAlpha: 0, x: left ? '-60vw' : '60vw' }, { autoAlpha: 1, x: 0, duration: 0.2, ease: 'power4.out' }, at);
        intro.to(w, { keyframes: [{ x: left ? 6 : -6 }, { x: 0 }], duration: 0.08, ease: 'none' }, at + 0.2);
    });
    // revealed by a wipe, not a fade, so the line is never on screen at low contrast
    const after = 1.25 + words.length * 0.24 + 0.15;
    if (today) intro.fromTo(today, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power2.out' }, after);
    const hint = q('.hh-hint');
    if (hint) intro.fromTo(hint, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, after + 0.3);
    if (location.search.includes('debug')) { intro.pause(0); (window as any).__hero = { tl: intro, gsap }; }
}

/** The cut's clock on the scroll: progress through #cut is time through the cut. Without ScrollTrigger (reduced
 *  motion), a plain scroll listener does the same. */
function scrubByScroll(h: import('./anime').CutHandle, ST: typeof import('gsap/ScrollTrigger').ScrollTrigger | null) {
    const sec = q('#cut');
    const count = q('[data-cut-count]');
    if (!sec) return;
    const paint = (p: number) => {
        const k = h.frameAt(p * h.total);
        if (count) count.textContent = `${k + 1} / ${h.n}`;
    };
    if (ST) {
        ST.create({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.35, onUpdate: (self) => paint(self.progress) });
        return;
    }
    const onScroll = () => {
        const r = sec.getBoundingClientRect();
        const span = r.height - innerHeight;
        paint(Math.max(0, Math.min(1, -r.top / Math.max(1, span))));
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

export async function home() {
    syncOdos();
    const hero = q('#hero');
    const odoWrap = q('#hero-odo');
    const odo = q('.hh-odo');
    const badge = q('#badge');
    if (!hero || !odoWrap || !odo || !badge) return;

    if (!html.classList.contains('js-anim')) {
        // reduced motion: the finished page, the hint, the cut scrubbed by hand, no auto-scroll
        document.body.classList.add('docked');
        setTimeout(() => mountCut()?.then((h) => h && scrubByScroll(h, null)), 300);
        return;
    }
    (window as any).__heroRan = true;
    if (!introDone) { introDone = true; opening(odo, odoWrap); }
    // the cut and its engine come now, after the first paint (home() starts two frames after it)
    mountCut();
    autoScroll(3.2);

    // The scroll choreography loads after the opening has started: nobody scrolls in the first moment, and the
    // largest paint does not have to share the line with it.
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    // GSAP only runs the setup when a condition matches, so one condition is always true
    mm.add({ any: '(min-width: 0px)', desktop: '(min-width: 768px)' }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };

        // 1 to 2 The wheels dock into the bar as the badge. The hero pins without a spacer, so the card slides up over it.
        const badgeOdo = q('.odo', badge)!;
        const dock = () => {
            const x = (gsap.getProperty(odoWrap, 'x') as number) || 0;
            const y = (gsap.getProperty(odoWrap, 'y') as number) || 0;
            const s = (gsap.getProperty(odoWrap, 'scale') as number) || 1;
            const r = odoWrap.getBoundingClientRect();
            const b = badgeOdo.getBoundingClientRect();
            const natW = r.width / s;
            const natL = r.left - x - (r.width - natW) * 0; // transform-origin is top left
            const natT = r.top - y;
            return { scale: b.height / (r.height / s), x: b.left - natL, y: b.top - natT };
        };
        gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: () => (desktop ? '+=70%' : '+=55%'),
                pin: true,
                pinSpacing: false,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: (self) => document.body.classList.toggle('docked', self.progress > 0.97),
            },
        })
            // the wrappers fade here; the opening animates the words and the link inside them, so neither fights the other
            .to(['.hh-words', '.hh-foot'], { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0)
            .to(odoWrap, { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, duration: 1, ease: 'power2.inOut' }, 0)
            .to(odoWrap, { autoAlpha: 0, duration: 0.03, ease: 'none' }, 0.97);

        // 3 The cut: the stage is sticky in a tall section; the scroll through that section is the cut's clock
        mountCut()?.then((h) => h && scrubByScroll(h, ScrollTrigger));

        // Section headings lock in word by word, once.
        qa('[data-lock]').forEach((h) => {
            const ws = splitWords(h);
            gsap.set(ws, { autoAlpha: 0 });
            ScrollTrigger.create({
                trigger: h,
                start: 'top 85%',
                once: true,
                onEnter: () => ws.forEach((w, i) => {
                    const left = i % 2 === 0;
                    gsap.fromTo(w, { autoAlpha: 0, x: left ? -90 : 90 }, { autoAlpha: 1, x: 0, duration: 0.24, delay: i * 0.12, ease: 'power4.out' });
                }),
            });
        });

        // 4 The record's gaps roll as they come into view
        qa('.record .gap-odo').forEach((g) => ScrollTrigger.create({ trigger: g, start: 'top 90%', once: true, onEnter: () => rollOnce(g, 0.9) }));

        // 4 and 5 The score and the streak roll to their counts; the tool bars grow from nothing.
        qa('.score .odo').forEach((n, i) => ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true, onEnter: () => gsap.delayedCall((i % 3) * 0.12, () => rollOnce(n, 1.1)) }));

        // Wipes between sections, scrubbed: a band of stripes crosses the screen as the next section arrives.
        qa('.wipes i').forEach((band) => {
            const next = q(`#${band.dataset.wipe}`);
            if (!next) return;
            gsap.fromTo(band, { x: 0, xPercent: -110 }, {
                x: 0,
                xPercent: () => (window.innerWidth / band.offsetWidth) * 100 + 30,
                ease: 'none',
                // clamp: near the foot of the page the scroll may end before the section reaches its mark; the wipe
                // must still finish, and a band is only shown while it is actually crossing
                scrollTrigger: {
                    trigger: next,
                    start: 'clamp(top 98%)',
                    end: 'clamp(top 45%)',
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => gsap.set(band, { autoAlpha: self.progress > 0.001 && self.progress < 0.995 ? 1 : 0 }),
                    onToggle: (self) => { if (!self.isActive) gsap.set(band, { autoAlpha: 0 }); },
                },
            });
        });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', home);
else home();
