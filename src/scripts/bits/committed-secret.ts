import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa }) {
        gsap.set(q('.gone'), { color: 'var(--paper)', textDecorationLine: 'none' });
        gsap.set(q('.gone em'), { autoAlpha: 0 });
        gsap.set(q('.view'), { autoAlpha: 0.25 });
        gsap.set(qa('.view p'), { autoAlpha: 0 });
        gsap.set(q('.hand'), { autoAlpha: 0, x: 40, y: 30 });
        gsap.set(q('.head'), { left: '50%' });
        gsap.set(qa('.out .ln'), { autoAlpha: 0 });
    },
    play({ tl, q, qa, lines, cap }) {
        // deleted from the top
        tl.set(q('.gone'), { color: 'var(--grey)', textDecorationLine: 'line-through' }, 0.15);
        tl.to(q('.gone em'), { autoAlpha: 1, duration: 0.15 }, '<');
        // drag back one commit: the key is right there
        tl.to(q('.head'), { left: '0%', duration: 0.5, ease: 'power2.inOut' }, '>0.25');
        tl.to(q('.view'), { autoAlpha: 1, duration: 0.2 }, '>');
        tl.to(qa('.view p'), { autoAlpha: 1, duration: 0.2, stagger: 0.15 }, '<');
        // and forward to the day someone looked
        cap(2, '>0.15');
        tl.to(q('.head'), { left: '100%', duration: 0.6, ease: 'power2.inOut' }, '>0.1');
        tl.to(q('.hand'), { autoAlpha: 1, x: 0, y: 0, duration: 0.35, ease: 'power3.out' }, '>');
        lines(qa('.out .ln'), '>0.1', 0.3);
    },
};
export const { reset, play } = mod;
