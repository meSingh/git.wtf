import gsap from 'gsap';
import { syncCounters } from './flaps';

/** True when the sequence should run: the pre-paint flag is set and the failsafe has not fired. Marks the run as started. */
export function startHero(): boolean {
    syncCounters();
    const on = document.documentElement.classList.contains('js-anim');
    if (on) (window as any).__heroRan = true;
    return on;
}

/** A short 2 px jolt of the whole hero, used on every landing. */
export function jolt(el: Element, at: gsap.Position, tl: gsap.core.Timeline, px = 2) {
    tl.to(el, { keyframes: [{ x: -px, y: px / 2 }, { x: px, y: -px / 2 }, { x: -px / 2, y: 0 }, { x: 0, y: 0 }], duration: 0.14, ease: 'none' }, at);
}

/** ?debug holds the timeline at zero and exposes it, so frames can be seeked exactly. */
export function expose(tl: gsap.core.Timeline) {
    if (!location.search.includes('debug')) return;
    tl.pause(0);
    (window as any).__hero = { tl, gsap };
}
