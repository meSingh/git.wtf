import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa }) {
        gsap.set(q('.conflict'), { display: 'inline' });
        gsap.set(q('.done'), { display: 'none' });
        gsap.set(q('.drop'), { color: 'var(--yellow)', textDecorationLine: 'none', opacity: 1, height: 'auto' });
        gsap.set(q('.drop em'), { autoAlpha: 0 });
        gsap.set(qa('.out .ln:not(.pre)'), { autoAlpha: 0 });
        gsap.set(q('.fill'), { width: '0%' });
        gsap.set(q('.timeout .ln'), { autoAlpha: 0 });
    },
    play({ tl, q, qa, lines, cap }) {
        const out = qa('.out .ln:not(.pre)');
        lines(out.slice(0, 2), 0.05, 0.3);
        // the commit leaves the graph
        tl.to(q('.drop'), { x: 60, opacity: 0, duration: 0.35, ease: 'power2.in' }, '>0.05');
        tl.set(q('.drop'), { x: 0, color: 'var(--grey)', textDecorationLine: 'line-through' });
        tl.to(q('.drop'), { opacity: 0.6, duration: 0.2 });
        tl.to(q('.drop em'), { autoAlpha: 1, duration: 0.15 }, '<');
        tl.set(q('.conflict'), { display: 'none' }, '<');
        tl.set(q('.done'), { display: 'inline' }, '<');
        lines(out.slice(2), '>0.05', 0.3);
        cap(2, '<');
        if (q('.fill')) {
            cap(3, '>0.1');
            tl.to(q('.fill'), { width: '100%', duration: 1.1, ease: 'none' }, '>');
            tl.to(q('.timeout .ln'), { autoAlpha: 1, duration: 0.1 }, '>');
        }
    },
};
export const { reset, play } = mod;
