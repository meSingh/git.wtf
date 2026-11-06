// A. Lights on: an industrial sign switched on at night.
// 0.3 s a lamp flickers; 0.5 to 1.0 s the floodlights come up in three banks, left to right, each a warm bloom
// that resolves to flat yellow; 1.2 s the flaps cascade left to right; 2.4 s they settle and the screen jolts;
// then the logo and today's title. Afterwards a faint scan of light crosses the sign every 12 s (CSS).
import gsap from 'gsap';
import { currentValue, rollTo } from './flaps';
import { expose, jolt, startHero } from './hero-common';

if (startHero()) {
    const hero = document.querySelector<HTMLElement>('#hero')!;
    const dark = gsap.utils.toArray<HTMLElement>('.ha-dark i');
    const bloom = gsap.utils.toArray<HTMLElement>('.ha-bloom i');
    const flaps = hero.querySelector<HTMLElement>('.ha-flaps')!;
    const late = hero.querySelector<HTMLElement>('.ha-late')!;
    const value = currentValue(flaps) ?? Number(flaps.dataset.value || 0);

    const tl = gsap.timeline({ onComplete: () => hero.classList.add('lit') });
    // the lamp flicker: the first bank stutters before it catches
    tl.to(dark[0], { opacity: 0.55, duration: 0.04, ease: 'none' }, 0.3)
        .to(dark[0], { opacity: 1, duration: 0.05, ease: 'none' }, 0.35)
        .to(dark[0], { opacity: 0.72, duration: 0.03, ease: 'none' }, 0.42)
        .to(dark[0], { opacity: 1, duration: 0.04, ease: 'none' }, 0.45);
    // three banks: dark lifts, warm bloom swells and then resolves to the flat colour
    [0.5, 0.75, 1.0].forEach((t, i) => {
        tl.to(dark[i], { opacity: 0, duration: 0.32, ease: 'power2.out' }, t);
        tl.fromTo(bloom[i], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' }, t);
        tl.to(bloom[i], { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, t + 0.3);
    });
    // the flaps: a mechanical cascade from the left cell to the right, settling with the overshoot at 2.4 s
    tl.add(rollTo(flaps, value, 1.0, 0.2), 1.2);
    jolt(hero, 2.4, tl);
    tl.fromTo(late, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.45);
    expose(tl);
}
