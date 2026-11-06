// The homepage choreography: five beats, one scroll. Everything here is decoration on a page that already
// reads complete with scripts off; with reduced motion on, none of it runs.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { currentValue, reducedMotion, renderValue, rollTo } from './flaps';

gsap.registerPlugin(ScrollTrigger);

const q = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);

export function home() {
    const hero = q('#hero');
    const sign = q('#sign');
    const heroFlaps = q('#sign .flaps');
    const badge = q('#badge');
    if (!hero || !sign || !heroFlaps || !badge) return;

    const live = currentValue(heroFlaps);
    if (live !== null && String(live) !== heroFlaps.dataset.value) renderValue(heroFlaps, live);
    const value = live ?? Number(heroFlaps.dataset.value || 0);

    if (reducedMotion()) {
        document.body.classList.add('docked');
        return;
    }

    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const caption = q('.hero-caption');
        const next = q('.hero-next');
        const drift = q('.drift');
        const subs = Array.from(document.querySelectorAll<HTMLElement>('.hero-sub'));

        // Beat 1: the board rolls once on load and settles on the real number.
        const roll = rollTo(heroFlaps, value, 1.2).pause();
        gsap.set([caption, next], { autoAlpha: 0, y: 8 });
        const intro = gsap.timeline({ delay: 0.15 })
            .add(roll.play())
            .to(caption, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
            .to(next, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        (window as any).__gwIntro = intro;

        // Beat 1 to 2: the sign docks into the top bar as the live badge. Scrubbed, so scrolling back undocks it.
        const dock = () => {
            const x = (gsap.getProperty(sign, 'x') as number) || 0;
            const y = (gsap.getProperty(sign, 'y') as number) || 0;
            const s = sign.getBoundingClientRect();
            const b = badge.getBoundingClientRect();
            const scale = Math.max(0.04, b.height / sign.offsetHeight);
            return { scale, x: b.left - (s.left - x), y: b.top - (s.top - y) };
        };
        gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=75%',
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: (self) => document.body.classList.toggle('docked', self.progress > 0.96),
            },
        })
            .to([...subs, drift], { autoAlpha: 0, duration: 0.25, ease: 'none' }, 0)
            .to(sign, { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, duration: 1, ease: 'power2.inOut' }, 0)
            .to(sign, { autoAlpha: 0, duration: 0.04, ease: 'none' }, 0.96);

        // Beat 2: today's incident types out with the scroll, one sentence per band, then the status stamps in.
        const today = q('#today');
        const term = today && q('.term', today);
        if (today && term) {
            const chars = Array.from(term.querySelectorAll<HTMLElement>('.typed .ch'));
            const sents = Array.from(term.querySelectorAll<HTMLElement>('.typed .sent'));
            const stamp = q('.stamp', term)!;
            const meta = q('.term-meta', term)!;
            gsap.set(chars, { visibility: 'hidden' });
            gsap.set(stamp, { autoAlpha: 0, scale: 2.2, rotate: -14 });
            gsap.set(meta, { autoAlpha: 0, y: 8 });
            let shown = 0;
            const proxy = { n: 0 };
            const reveal = () => {
                const n = Math.max(0, Math.min(chars.length, Math.round(proxy.n)));
                if (n === shown) return;
                if (n > shown) for (let i = shown; i < n; i++) chars[i].style.visibility = 'visible';
                else for (let i = n; i < shown; i++) chars[i].style.visibility = 'hidden';
                chars[shown - 1]?.classList.remove('at');
                chars[n - 1]?.classList.add('at');
                shown = n;
            };
            const tl = gsap.timeline({
                scrollTrigger: { trigger: today, start: 'top top', end: () => `+=${sents.length * 70 + 110}%`, pin: true, scrub: 0.35, invalidateOnRefresh: true },
            });
            tl.to({}, { duration: 0.2 });
            let cum = 0;
            sents.forEach((s) => {
                const len = s.querySelectorAll('.ch').length;
                cum += len;
                tl.to(proxy, { n: cum, duration: len * 0.012, ease: 'none', onUpdate: reveal });
                tl.to({}, { duration: 0.22 });
            });
            tl.to(stamp, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.22, ease: 'power4.in' });
            tl.fromTo(term, { x: 0 }, { x: -4, duration: 0.03, yoyo: true, repeat: 3, ease: 'none' }, '<0.18');
            tl.to(stamp, { rotate: -2.6, scale: 1.01, duration: 0.08, ease: 'power2.out' });
            tl.to(stamp, { rotate: -2, scale: 1, duration: 0.1, ease: 'power2.inOut' });
            tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' }, '<');
            tl.to({}, { duration: 0.3 });
        }

        // Beat 3: the record scrolls sideways with the page on desktop; mobile stacks it.
        const wrap = q('#track-wrap');
        const track = q('#track');
        if (desktop && wrap && track) {
            const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);
            gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
            });
        }

        // Beat 4: the tally counts up once as it enters.
        document.querySelectorAll<HTMLElement>('.tally .n').forEach((el) => {
            const n = Number(el.dataset.n ?? 0);
            if (!n) return;
            gsap.from(el, { textContent: 0, snap: { textContent: 1 }, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // ?debug exposes the runtime so screenshots and frame strips can be driven deterministically.
    if (location.search.includes('debug')) (window as any).__gw = { gsap, ScrollTrigger, intro: (window as any).__gwIntro };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', home);
else home();
