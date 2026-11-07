import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa }) {
        gsap.set(qa('.out .run'), { autoAlpha: 0 });
        gsap.set(qa('.remote .theirs'), { x: 0, opacity: 1, color: 'var(--paper)', textDecorationLine: 'none' });
        gsap.set(qa('.remote .theirs em'), { autoAlpha: 0 });
        gsap.set(q('.remote .mine'), { autoAlpha: 0, x: -30 });
    },
    play({ tl, q, qa, lines, cap, variant }) {
        const run = qa('.out .run');
        const theirs = qa('.remote .theirs');
        const n = variant === 'robots' ? 2 : run.length;
        lines(run.slice(0, n), 0.1, 0.32);
        // the remote takes the push: their commits slide off the end, the rebase takes their place
        tl.to(theirs, { x: 140, opacity: 0, duration: 0.45, ease: 'power2.in', stagger: 0.08 }, '>0.15');
        tl.set(theirs, { x: 0, color: 'var(--grey)', textDecorationLine: 'line-through' });
        tl.to(theirs, { opacity: 0.55, duration: 0.25 });
        tl.to(qa('.remote .theirs em'), { autoAlpha: 1, duration: 0.2 }, '<');
        tl.to(q('.remote .mine'), { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power3.out' }, '<');
        if (variant === 'robots') {
            cap(2, '>0.1');
            lines(run.slice(n), '>0.1', 0.4);
        }
    },
};
export const { reset, play } = mod;
