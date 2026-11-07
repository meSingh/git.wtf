import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa }) {
        gsap.set(qa('.chat .msg, .tool, .fsck .ln, .clean'), { autoAlpha: 0 });
        gsap.set(qa('.files li'), { autoAlpha: 1, height: 'auto' });
    },
    play({ tl, q, qa, lines, cap, wait, variant }) {
        const files = qa('.files li');
        if (variant === 'asked') {
            // the reader's question goes out first
            tl.fromTo(q('.chat .you'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power3.out' }, 0);
            lines([q('.chat .agent')!], 0.35);
            lines([q('.tool')!], '>0.25');
        } else {
            lines([q('.tool')!], 0.1);
        }
        // everything after the commit goes, a line at a time
        tl.to(files.slice().reverse(), { autoAlpha: 0, x: -20, duration: 0.12, stagger: 0.05, ease: 'power1.in' }, '>0.15');
        tl.to(files, { height: 0, duration: 0.2, ease: 'power2.inOut' }, '>');
        lines([q('.clean')!], '>0.05');
        const blobs = qa('.fsck .ln');
        if (variant === 'asked') {
            cap(2, '>0.2');
            wait(q<HTMLButtonElement>('.bit-go2'), '>0.1');
            lines(blobs, '>0.05', 0.14);
        } else {
            lines(blobs, '>0.3', 0.14);
        }
    },
};
export const { reset, play } = mod;
