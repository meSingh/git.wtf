import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa }) {
        gsap.set(qa('.mk'), { height: '1.65em', opacity: 1 });
        gsap.set(q('.slot'), { height: 0, opacity: 0 });
        gsap.set(qa('.err, .right'), { autoAlpha: 0 });
        gsap.set(q('.drop'), { opacity: 0, y: 0 });
    },
    play({ tl, q, qa, cap, count, params }) {
        // the markers go, the sides close up as written
        tl.to(qa('.mk'), { opacity: 0, duration: 0.15 }, 0.1);
        tl.to(qa('.mk'), { height: 0, duration: 0.35, ease: 'power2.inOut', stagger: 0.05 }, '>');
        // the brace the first test needed was the one shared brace, now below the second
        tl.fromTo(q('.drop'), { opacity: 1, y: -66 }, { y: 0, duration: 0.5, ease: 'bounce.out' }, '>0.05');
        tl.to(q('.drop'), { opacity: 0, duration: 0.1 }, '>');
        tl.to(q('.slot'), { height: '1.65em', opacity: 1, duration: 0.3, ease: 'power2.out' }, '>0.05');
        tl.to(q('.err'), { autoAlpha: 1, duration: 0.15 }, '>0.15');
        if (q('.right')) {
            cap(2, '>0.1');
            tl.to(q('.right'), { autoAlpha: 1, duration: 0.2 }, '<');
            count(q('.right .num'), 0, params.right ?? 0, 0.6, '<');
        }
    },
};
export const { reset, play } = mod;
