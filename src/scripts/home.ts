// The homepage, in the odometer's language. Everything here is motion layered on a page that reads complete as a
// still; with reduced motion (no js-anim flag) none of it runs.
//
// 1 The opening: the trip meter rolls down from the days since the first incident to today's count with motion
//   blur, the headline locks in word by word behind sweeping stripes. On scroll the wheels shrink and dock into
//   the bar as the odometer badge (scrubbed, so scrolling back undocks).
// 2 About two seconds in, the page scrolls slowly to the cut with a hint; any input stops it. With reduced motion
//   there is no auto-scroll, only the hint.
// 3 The episode plays full screen at the page's pace: the player fragment and the engine load after the first
//   paint; the stage sticks in a tall section, and each gesture (wheel, swipe, key) plays the next shot at its own
//   timing, input held while a shot plays, never more than one shot a gesture. Sound is off until turned on.
// 4 The record scrolls sideways, newest first; the score and the streak roll to their counts on entry. Headings lock in word by word, once.
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
        if (i < words.length - 1) el.appendChild(document.createTextNode(' ')); // the gap is the span's margin as well, so a font swap cannot swallow it
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

/** 2 The auto-scroll: slowly down to the cut after the opening, unless the reader has moved by then. Only a
 *  deliberate move counts: a wheel tick, a touch, a key or a click after the first moment of the load (a browser
 *  can fire a stray pointer or wheel event while the page settles), or a scroll the page did not make itself. */
let moved = false;
const armedAt = performance.now() + 900;
const stopAuto = () => { if (performance.now() > armedAt) moved = true; };
['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, stopAuto, { passive: true }));
function autoScroll(delay: number) {
    const to = q('#cut') ?? q('#today');
    if (!to) return;
    // start at the top whatever the browser remembered
    if (scrollY > 0) scrollTo(0, 0);
    gsap.delayedCall(delay, () => {
        if (moved || scrollY > 10) return;
        const target = to.getBoundingClientRect().top + scrollY;
        const o = { y: scrollY };
        let last = scrollY;
        const tween = gsap.to(o, { y: target, duration: 3.2, ease: 'power1.inOut', onUpdate: () => {
            // a scroll the page did not make is the reader's: stop
            if (moved || Math.abs(scrollY - last) > 40) { tween.kill(); return; }
            scrollTo(0, o.y);
            last = scrollY;
        } });
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
    if (hint) {
        // shown outright, not faded: a half-faded hint is unreadable, and an audit would catch it so
        intro.set(hint, { autoAlpha: 1 }, after + 0.3);
        // once the page has moved, the hint is gone outright (no half-faded state over the episode)
        addEventListener('scroll', () => gsap.set(hint, { autoAlpha: scrollY > 24 ? 0 : 1 }), { passive: true });
    }
    if (location.search.includes('debug')) { intro.pause(0); (window as any).__hero = { tl: intro, gsap }; }
}

/** Reduced motion: the cut's frames follow the scroll, nothing plays by itself. */
function scrubByScroll(h: import('./anime').CutHandle) {
    const sec = q('#cut');
    const count = q('[data-cut-count]');
    if (!sec) return;
    const onScroll = () => {
        const r = sec.getBoundingClientRect();
        const span = r.height - innerHeight;
        const k = h.frameAt(Math.max(0, Math.min(1, -r.top / Math.max(1, span))) * h.total);
        if (count) count.textContent = `${k + 1} / ${h.n}`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/** 3 The episode at the page's pace. The section is as tall as one step a shot; the stage sticks. Inside it, a
 *  gesture plays the next shot at its authored timing and moves the page one step; while a shot plays, input is
 *  held; a wheel's inertia or a long swipe counts once. At the last shot's end the page scrolls on as usual. */
function stepCut(h: import('./anime').CutHandle, ST: typeof import('gsap/ScrollTrigger').ScrollTrigger) {
    const sec = q('#cut');
    const count = q('[data-cut-count]');
    if (!sec) return;
    const n = h.n;
    const step = parseFloat(getComputedStyle(sec).getPropertyValue('--cut-step')) || 360;
    let k = -1;
    let holdUntil = 0;
    let wanted = 0; // a move that arrived while a shot was playing: taken when the shot is done
    const top = () => sec.getBoundingClientRect().top + scrollY;
    const inside = () => { const t = top(); return scrollY >= t - 1 && scrollY <= t + n * step + 1; };
    // a shot counts as done at its authored length (the plan's, loops or not), never by asking its timeline
    const held = () => performance.now() < holdUntil;
    // the "keep scrolling" hint shows over the first shot only and fades on the reader's first move
    const down = q('[data-cut-down]');
    const paint = () => { if (count) count.textContent = `${k + 1} / ${n}`; if (down) gsap.to(down, { autoAlpha: k > 0 ? 0 : 1, duration: 0.3, overwrite: true }); };
    const go = (to: number) => {
        to = Math.max(0, Math.min(n - 1, to));
        if (to === k && k === n - 1) return; // past the last shot there is nothing to play: the page scrolls on
        k = to;
        scrollTo({ top: Math.round(top() + k * step), behavior: 'auto' });
        h.play(k);
        holdUntil = performance.now() + Math.min(5000, Math.max(600, (h.plan[k]?.length ?? 1) * 1000));
        paint();
        // the reader kept scrolling during the shot: the next shot follows by itself when this one is done
        wanted = 0;
        gsap.delayedCall((holdUntil - performance.now()) / 1000 + 0.02, () => { if (wanted && inside()) { const d = wanted; wanted = 0; if (k + d >= 0 && k + d < n) go(k + d); } });
    };
    // a scroll the page did not make (the scrollbar, the auto-scroll arriving, a jump back): show that step's shot
    ST.create({
        trigger: sec, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => { const to = Math.min(n - 1, Math.round(self.progress * n)); if (to !== k) { k = to; h.play(k); paint(); } },
        onEnter: () => { if (k < 0) go(0); },
    });
    // arriving at the top by any route (the auto-scroll lands exactly there): the first shot plays
    const sync = () => { if (k < 0 && scrollY >= top() - 1 && scrollY <= top() + step) go(0); };
    addEventListener('scroll', sync, { passive: true });
    sync();
    const forward = (dir: number) => {
        if (held()) { wanted = k + dir >= 0 && k + dir < n ? dir : 0; return true; } // held: remembered, taken when the shot is done
        go(k + dir);
        return true;
    };
    // the wheel: while a shot plays, its events are eaten (and the direction remembered); once it is done, the
    // next event steps. Steady scrolling therefore advances one shot per authored length, a flick one shot.
    addEventListener('wheel', (e) => {
        if (!inside()) return;
        const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
        if (!dir) return;
        if (dir > 0 && k >= n - 1 && !held()) return; // the end: the page goes on
        if (dir < 0 && k <= 0 && scrollY <= top() + 1) return; // the start: back to the hero
        e.preventDefault();
        forward(dir);
    }, { passive: false });
    // a swipe: the touch moves nothing itself; on lift, its direction is one step
    let y0: number | null = null;
    addEventListener('touchstart', (e) => { y0 = inside() ? e.touches[0].clientY : null; }, { passive: true });
    addEventListener('touchmove', (e) => {
        if (y0 === null || !inside()) return;
        const dy = y0 - e.touches[0].clientY;
        if (dy > 0 && k >= n - 1 && !held()) return;
        if (dy < 0 && k <= 0) return;
        e.preventDefault();
    }, { passive: false });
    addEventListener('touchend', (e) => {
        if (y0 === null) return;
        const dy = y0 - e.changedTouches[0].clientY;
        y0 = null;
        if (Math.abs(dy) < 24 || !inside()) return;
        if (dy > 0 && k >= n - 1 && !held()) return;
        if (dy < 0 && k <= 0) return;
        forward(dy > 0 ? 1 : -1);
    }, { passive: true });
    addEventListener('keydown', (e) => {
        if (!inside() || (e.target instanceof HTMLElement && e.target.closest('input, textarea, button, a'))) return;
        const dir = [' ', 'ArrowDown', 'PageDown', 'Enter'].includes(e.key) ? 1 : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0;
        if (!dir) return;
        if (dir > 0 && k >= n - 1 && !held()) return;
        if (dir < 0 && k <= 0) return;
        e.preventDefault();
        forward(dir);
    });
    q('[data-cut-replay]')?.addEventListener('click', () => { k = -1; go(0); });
    q('[data-cut-skip]')?.addEventListener('click', () => go(n - 1));
    q('[data-cut-down]')?.addEventListener('click', (e) => { e.preventDefault(); if (k >= n - 1 && !held()) scrollTo({ top: top() + n * step + 1, behavior: 'smooth' }); else forward(1); });
}

export async function home() {
    syncOdos();
    const hero = q('#hero');
    const odoWrap = q('#hero-odo');
    const odo = q('.hh-odo');
    const badge = q('#badge');
    if (!hero || !odoWrap || !odo || !badge) return;

    if (!html.classList.contains('js-anim')) {
        // no opening: the finished page. With reduced motion the cut is scrubbed by hand and nothing auto-scrolls;
        // when only the flag was lost (a slow cold load), the paced episode and the auto-scroll still run.
        document.body.classList.add('docked');
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
        if (reduce) { setTimeout(() => mountCut()?.then((h) => h && scrubByScroll(h)), 300); return; }
        mountCut();
        autoScroll(1.2);
        const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ST);
        mountCut()?.then((h) => h && stepCut(h, ST));
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
        mountCut()?.then((h) => h && stepCut(h, ScrollTrigger));

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

        // 4 The record: sideways on desktop, each gap rolling as it comes into view; stacked on phones.
        const wrap = q('#track-wrap');
        const track = q('#track');
        if (desktop && wrap && track) {
            const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);
            // the track is anchored to the right edge (the newest card in view); the scroll slides it rightward, so
            // the older cards come in from the left, back in time
            const sideways = gsap.fromTo(track, { x: 0 }, {
                x: () => distance(),
                ease: 'none',
                scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${Math.max(1, qa('#track .tcard').length) * 350}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
            });
            void sideways;
            // the gaps roll as the record pins, the nearest first
            ScrollTrigger.create({ trigger: wrap, start: 'top 60%', once: true, onEnter: () => qa('#track .gap .odo').forEach((g, i) => gsap.delayedCall(i * 0.15, () => rollOnce(g, 0.9))) });
        } else {
            qa('.record-stack .odo').forEach((g) => ScrollTrigger.create({ trigger: g, start: 'top 90%', once: true, onEnter: () => rollOnce(g, 0.9) }));
        }

        // 4 and 5 The score and the streak roll to their counts; the tool bars grow from nothing.
        qa('.score .odo, .streak .odo').forEach((n, i) => ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true, onEnter: () => gsap.delayedCall((i % 3) * 0.12, () => rollOnce(n, 1.1)) }));


        // Wipes between sections: as a section arrives, a band of stripes crosses the screen once, in half a second,
        // and is gone. Never scrubbed, so it can never rest over the content at any scroll position.
        qa('.wipes i').forEach((band) => {
            const next = q(`#${band.dataset.wipe}`);
            if (!next) return;
            ScrollTrigger.create({
                trigger: next,
                start: 'top 85%',
                once: true,
                onEnter: () => gsap.fromTo(band, { autoAlpha: 1, x: 0, xPercent: -110 }, { xPercent: (window.innerWidth / band.offsetWidth) * 100 + 30, duration: 0.55, ease: 'power2.inOut', onComplete: () => gsap.set(band, { autoAlpha: 0 }) }),
            });
        });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', home);
else home();
