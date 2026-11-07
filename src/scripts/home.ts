// The homepage, in the odometer's language. Everything here is motion layered on a page that reads complete as a
// still; with reduced motion (no js-anim flag) none of it runs.
//
// 1 The opening: the trip meter rolls down from the days since the first incident to today's count with motion
//   blur, the headline locks in word by word behind sweeping stripes. On scroll the wheels shrink and dock into
//   the bar as the odometer badge (scrubbed, so scrolling back undocks).
// 2 About two seconds in, the page scrolls slowly to the cut with a hint; any input stops it. With reduced motion
//   there is no auto-scroll, only the hint.
// 3 The episode plays full screen by itself while it is in view, shot after shot on its planned clock, and pauses
//   when it leaves; the page scrolls past it freely. Replay and Sound sit in the player bar. Sound is off until
//   turned on. With reduced motion nothing plays until Replay is pressed.
// 4 The record scrolls sideways on its own (swipe, drag, the arrows), newest first on the left; the score and the
//   streak roll to their counts on entry. Headings lock in word by word, once.
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

/** 3 The episode plays by itself: in view (most of it on screen), each shot runs at its planned length and the next
 *  follows; out of view, it pauses and the shot restarts on return; at the end it rests on the end card until
 *  Replay. The page's scroll is never held. Skip episode goes on to the next block and stops the run. */
function playCut(h: import('./anime').CutHandle, autoplay: boolean) {
    const sec = q('#cut');
    if (!sec) return;
    const count = q('[data-cut-count]');
    const down = q('[data-cut-down]');
    // the sound button comes with the player; it moves into the bar beside Replay
    const slot = q('[data-cut-sound-slot]');
    const sound = q('#cut-stage .cut-sound');
    if (slot && sound) slot.appendChild(sound);
    const n = h.n;
    let k = 0;
    let timer: gsap.core.Tween | null = null;
    let started = false, done = false, inView = false;
    const paint = () => {
        if (count) count.textContent = `${k + 1} / ${n}`;
        // the "keep scrolling" hint shows over the first shot and the end, never over the lines in between
        if (down) gsap.to(down, { autoAlpha: k === 0 || done ? 1 : 0, duration: 0.3, overwrite: true });
    };
    const stop = () => { timer?.kill(); timer = null; h.audio?.pause(); };
    const schedule = () => {
        timer?.kill();
        timer = gsap.delayedCall(h.plan[k]?.length ?? 3, () => {
            timer = null;
            if (k < n - 1) { k++; h.play(k); paint(); schedule(); }
            else { done = true; paint(); }
        });
    };
    const run = (from: number) => { done = false; started = true; k = from; h.play(k); paint(); schedule(); };
    paint();
    if (autoplay) {
        new IntersectionObserver(([e]) => {
            // a third of the stage in view starts it, so a reader who stops scrolling short still sees it play
            inView = e.intersectionRatio >= 0.35;
            if (inView) { if (!started) run(0); else if (!done && !timer) { h.play(k); schedule(); } }
            else if (e.intersectionRatio < 0.15) { if (timer) stop(); else h.audio?.pause(); }
        }, { threshold: [0, 0.15, 0.35, 0.6, 1] }).observe(sec);
        // leaving the page or the tab stops the sound as well
        addEventListener('pagehide', stop);
        document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (inView && started && !done && !timer) { h.play(k); schedule(); } });
    }
    q('[data-cut-replay]')?.addEventListener('click', () => { stop(); run(0); });
    const next = () => { const d = q('#detail'); scrollTo({ top: Math.round(d ? d.getBoundingClientRect().top + scrollY : sec.getBoundingClientRect().bottom + scrollY), behavior: 'smooth' }); };
    q('[data-cut-skip]')?.addEventListener('click', () => { stop(); done = true; started = true; paint(); next(); });
    down?.addEventListener('click', (e) => { e.preventDefault(); next(); });
}

/** 4 The record's own sideways scroll: the arrows step about a screen, a mouse can drag it, a trackpad swipes it.
 *  The page's up and down scroll passes it by. */
function recordNav() {
    const sc = q('#track-scroll');
    const nav = q('[data-track-nav]');
    if (!sc) return;
    const btns = qa<HTMLButtonElement>('[data-track-go]');
    const paint = () => {
        const max = sc.scrollWidth - sc.clientWidth;
        btns.forEach((b) => { b.disabled = Number(b.dataset.trackGo) < 0 ? sc.scrollLeft <= 2 : sc.scrollLeft >= max - 2; });
        if (nav) nav.hidden = max <= 2;
    };
    btns.forEach((b) => b.addEventListener('click', () => sc.scrollBy({ left: Number(b.dataset.trackGo) * Math.max(320, sc.clientWidth * 0.8), behavior: 'smooth' })));
    sc.addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint);
    paint();
    // a mouse drag scrolls it; a drag of more than a few pixels is not a click on a card
    let x0 = 0, left0 = 0, id = -1, moved = false;
    sc.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; id = e.pointerId; x0 = e.clientX; left0 = sc.scrollLeft; moved = false; });
    sc.addEventListener('pointermove', (e) => {
        if (e.pointerId !== id) return;
        const dx = e.clientX - x0;
        if (!moved && Math.abs(dx) > 6) { moved = true; sc.classList.add('dragging'); sc.setPointerCapture(id); }
        if (moved) sc.scrollLeft = left0 - dx;
    });
    const end = (e: PointerEvent) => { if (e.pointerId !== id) return; id = -1; if (moved) requestAnimationFrame(() => sc.classList.remove('dragging')); };
    sc.addEventListener('pointerup', end);
    sc.addEventListener('pointercancel', end);
    sc.addEventListener('dragstart', (e) => e.preventDefault());
}

export async function home() {
    syncOdos();
    const hero = q('#hero');
    const odoWrap = q('#hero-odo');
    const odo = q('.hh-odo');
    const badge = q('#badge');
    if (!hero || !odoWrap || !odo || !badge) return;
    recordNav();

    if (!html.classList.contains('js-anim')) {
        // no opening: the finished page. With reduced motion the cut is scrubbed by hand and nothing auto-scrolls;
        // when only the flag was lost (a slow cold load), the paced episode and the auto-scroll still run.
        document.body.classList.add('docked');
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
        if (reduce) { setTimeout(() => mountCut()?.then((h) => h && playCut(h, false)), 300); return; }
        mountCut()?.then((h) => h && playCut(h, true));
        autoScroll(1.2);
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
    // 3 The cut plays by itself while it is in view (once, outside matchMedia, so a rotation never starts a second run)
    mountCut()?.then((h) => h && playCut(h, true));
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

        // 4 The record scrolls itself sideways (recordNav); the gaps roll as it comes into view, the nearest first
        const wrap = q('#track-wrap');
        if (desktop && wrap) {
            ScrollTrigger.create({ trigger: wrap, start: 'top 75%', once: true, onEnter: () => qa('#track .gap .odo').forEach((g, i) => gsap.delayedCall(i * 0.15, () => rollOnce(g, 0.9))) });
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
