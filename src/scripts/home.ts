// The homepage, in the odometer's language. Everything here is motion layered on a page that reads complete as a
// still; with reduced motion (no js-anim flag) none of it runs.
//
// 1 The opening: the trip meter rolls down from the days since the first incident to today's count with motion
//   blur, the headline locks in word by word behind sweeping stripes. On scroll the wheels shrink and dock into
//   the bar as the odometer badge (scrubbed, so scrolling back undocks).
// 2 Today's strip slides up beneath the docking wheels, its title locking in word by word; its four panels are
//   dealt in one by one on scroll, the stamp on panel 4 landing last.
// 3 The record scrolls sideways; each gap's wheels roll to its day count as it comes into view.
// 4 The score and the streak roll to their counts on entry, the tool bars grow. Headings lock in word by word, once.
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
    if (today) intro.fromTo(today, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power2.out' }, 1.25 + 5 * 0.24 + 0.15);
    if (location.search.includes('debug')) { intro.pause(0); (window as any).__hero = { tl: intro, gsap }; }
}

export async function home() {
    syncOdos();
    const hero = q('#hero');
    const odoWrap = q('#hero-odo');
    const odo = q('.hh-odo');
    const badge = q('#badge');
    if (!hero || !odoWrap || !odo || !badge) return;

    if (!html.classList.contains('js-anim')) {
        document.body.classList.add('docked');
        return;
    }
    (window as any).__heroRan = true;
    if (!introDone) { introDone = true; opening(odo, odoWrap); }

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

        // 2 Today's strip: the title locks in word by word as it slides up under the docking wheels, then the panels
        // are dealt in one by one with the scroll, a slide and a settle each, panel 4 and its stamp landing last.
        const todaySec = q('#today');
        if (todaySec) {
            const tws = qa('.today-title .tw', todaySec);
            if (tws.length) {
                const arrive = gsap.timeline({ scrollTrigger: { trigger: todaySec, start: 'top 92%', end: 'top 35%', scrub: 0.3 } });
                tws.forEach((w, i) => {
                    const left = i % 2 === 0;
                    arrive.fromTo(w, { autoAlpha: 0, x: left ? -80 : 80 }, { autoAlpha: 1, x: 0, duration: 0.25, ease: 'power4.out' }, i * 0.12);
                });
            }
            const panels = qa('.today-strip .panel', todaySec);
            const deal = (p: HTMLElement, i: number) => {
                const last = i === panels.length - 1;
                const from = desktop ? { x: i % 2 === 0 ? -120 : 120, y: 40, rotate: i % 2 === 0 ? -6 : 6 } : { x: i % 2 === 0 ? -60 : 60, y: 30, rotate: i % 2 === 0 ? -4 : 4 };
                return [
                    { autoAlpha: 0, scale: last ? 1.18 : 1, ...from },
                    { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.3, ease: last ? 'power4.in' : 'back.out(1.6)' },
                ] as const;
            };
            if (desktop) {
                // two by two: one timeline across the strip's arrival, a panel at a time
                const tl = gsap.timeline({ scrollTrigger: { trigger: '.today-strip', start: 'top 85%', end: 'top 15%', scrub: 0.4 } });
                panels.forEach((p, i) => {
                    const [a, b] = deal(p, i);
                    tl.fromTo(p, a, b, i * 0.36);
                });
                const p4 = panels[panels.length - 1];
                if (p4) tl.to(p4, { keyframes: [{ x: -5 }, { x: 4 }, { x: -2 }, { x: 0 }], duration: 0.12, ease: 'none' });
            } else {
                // stacked: each panel deals in as it comes up
                panels.forEach((p, i) => {
                    const [a, b] = deal(p, i);
                    gsap.fromTo(p, a, { ...b, scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 60%', scrub: 0.4 } });
                });
            }
        }

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

        // 3 The record: sideways on desktop, each gap rolling as it comes into view; stacked on phones.
        const wrap = q('#track-wrap');
        const track = q('#track');
        if (desktop && wrap && track) {
            const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);
            const sideways = gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                // about 350 px of scroll per card, whatever the track's length in days
                scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${qa('#track .tcard').length * 350}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
            });
            qa('#track .gap .odo').forEach((g) => ScrollTrigger.create({ trigger: g, containerAnimation: sideways, start: 'left 88%', once: true, onEnter: () => rollOnce(g, 0.9) }));
        } else {
            qa('.record-stack .odo').forEach((g) => ScrollTrigger.create({ trigger: g, start: 'top 90%', once: true, onEnter: () => rollOnce(g, 0.9) }));
        }

        // 4 and 5 The score and the streak roll to their counts; the tool bars grow from nothing.
        qa('.score .odo, .streak .odo').forEach((n, i) => ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true, onEnter: () => gsap.delayedCall((i % 3) * 0.12, () => rollOnce(n, 1.1)) }));
        const fills = qa('.score .tools .fill');
        if (fills.length) {
            gsap.set(fills, { scaleX: 0 });
            ScrollTrigger.create({ trigger: '.score .tools', start: 'top 88%', once: true, onEnter: () => gsap.to(fills, { scaleX: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07 }) });
        }

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
