import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa, variant, params }) {
        if (variant === 'asked') {
            gsap.set(q('.knob'), { x: '1.2rem' });
            gsap.set(q('.sw'), { backgroundColor: '#ffd400' });
            q('.state')!.textContent = 'on';
            gsap.set(q('.dialog'), { opacity: 1, textDecorationLine: 'none' });
            gsap.set(qa('.issue, .out .ln, .stop, .fixed'), { autoAlpha: 0 });
            return;
        }
        gsap.set(q('.leaf.l'), { rotateY: 0 });
        gsap.set(q('.leaf.r'), { rotateY: 0 });
        gsap.set(qa('.out .ln'), { autoAlpha: 0 });
        gsap.set(qa('.after .box'), { autoAlpha: 0, y: 10 });
        const st = q('.st');
        if (st) st.textContent = 'Building';
    },
    play({ tl, q, qa, lines, cap, type, count, variant, params }) {
        if (variant === 'asked') {
            tl.to(q('.issue'), { autoAlpha: 1, duration: 0.2 }, 0.1);
            type(q('.issue .t'), '>', 60);
            tl.to(q('.fixed'), { autoAlpha: 1, duration: 0.15 }, '>0.1');
            // the patch: the switch goes off, the question goes with it
            tl.to(q('.knob'), { x: 0, duration: 0.25, ease: 'power3.inOut' }, '>0.1');
            tl.to(q('.sw'), { backgroundColor: 'rgba(242,240,234,0.28)', duration: 0.25 }, '<');
            tl.call(() => { q('.state')!.textContent = 'off'; }, [], '<0.12');
            tl.to(q('.dialog'), { opacity: 0.3, duration: 0.3 }, '<');
            tl.set(q('.dialog'), { textDecorationLine: 'line-through' }, '<');
            cap(2, '>0.1');
            lines(qa('.out .ln'), '>0.05', 0.22);
            cap(3, '>0.1');
            tl.to(q('.stop'), { autoAlpha: 1, duration: 0.3 }, '>0.2');
            return;
        }
        const ln = qa('.out .ln');
        const opensAt = variant === 'test' ? 3 : 0;
        lines(ln.slice(0, opensAt + 1), 0.05, 0.3);
        // nobody touches the gate; it opens
        tl.to(q('.leaf.l'), { rotateY: -78, duration: 0.6, ease: 'power2.inOut' }, '>0.05');
        tl.to(q('.leaf.r'), { rotateY: 78, duration: 0.6, ease: 'power2.inOut' }, '<');
        lines(ln.slice(opensAt + 1), '<0.2', 0.3);
        if (variant === 'test') {
            cap(2, '<');
            const boxes = qa('.repos .box');
            tl.to(boxes, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.1 }, '>0.05');
            const repos = (params.repos ?? []) as [string, number][];
            qa('.repos .num').forEach((el, i) => count(el, 0, repos[i]?.[1] ?? 0, 0.9, '<'));
            tl.to(q('.deploy'), { autoAlpha: 1, y: 0, duration: 0.25 }, '>0.1');
            cap(3, '<');
            tl.call(() => { q('.st')!.textContent = 'Build failed'; }, [], '>0.6');
        }
    },
};
export const { reset, play } = mod;
