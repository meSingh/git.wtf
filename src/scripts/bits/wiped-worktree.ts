import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, q, qa, variant, params }) {
        gsap.set(qa('.out .ln'), { autoAlpha: 0 });
        if (variant === 'agents') {
            gsap.set(qa('.chip-a'), { autoAlpha: 0, scale: 0.6 });
            const [left, clock] = qa('.counts .num');
            left.textContent = Number(params.files).toLocaleString('en-GB');
            clock.textContent = '0';
        } else if (variant === 'wrongdir') {
            q('.here .num')!.textContent = String(params.files);
        } else {
            gsap.set(qa('.t'), { borderStyle: 'solid', borderColor: 'rgba(242,240,234,0.28)', backgroundColor: 'rgba(242,240,234,0.06)' });
            gsap.set(q('.t.live'), { borderColor: '#ffd400' });
            gsap.set(q('.fall'), { y: -140, autoAlpha: 0 });
            gsap.set(q('.broom'), { x: '-200%' });
            qa('.counts .num').forEach((n) => { n.textContent = '0'; });
        }
    },
    play({ tl, q, qa, lines, cap, count, variant, params }) {
        const out = qa('.out .ln');
        if (variant === 'agents') {
            tl.to(qa('.chip-a'), { autoAlpha: 1, scale: 1, duration: 0.18, stagger: 0.04, ease: 'back.out(2)' }, 0.05);
            const [left, clock] = qa('.counts .num');
            count(left, params.files, 0, 1.4, '>');
            count(clock, 0, params.minutes, 1.4, '<');
            lines(out.slice(0, 2), '<0.5', 0.35);
            cap(2, '>');
            lines(out.slice(2), '>0.1', 0.25);
            return;
        }
        if (variant === 'wrongdir') {
            lines(out.slice(0, 3), 0.05, 0.35);
            count(q('.here .num'), params.files, 0, 0.5, '<');
            cap(2, '>0.2');
            lines(out.slice(3), '>0.1', 0.25);
            return;
        }
        // the sweep: every worktree checks clean, every one goes, the one in use too
        lines(out, 0.05, 0.3);
        const grid = q('.grid')!;
        const sweep = 1.4;
        tl.addLabel('sweep', '>');
        tl.to(q('.broom'), { x: grid.clientWidth + 30, duration: sweep, ease: 'none' }, 'sweep');
        const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        qa('.t').forEach((t, i) => {
            tl.to(t, { borderStyle: 'dashed', borderColor: 'rgba(242,240,234,0.14)', backgroundColor: 'rgba(0,0,0,0)', duration: 0.12 }, `sweep+=${(((i % cols) + 0.5) / cols) * sweep}`);
        });
        tl.to(q('.fall'), { y: 0, autoAlpha: 0.55, duration: 0.5, ease: 'bounce.out' }, `sweep+=${sweep * 0.65}`);
        cap(2, '<');
        const nums = qa('.counts .num');
        const targets = [params.removed, params.ignored, params.rebuilt];
        nums.forEach((n, i) => count(n, 0, targets[i] ?? 0, 0.9, i ? '<0.1' : '>'));
    },
};
export const { reset, play } = mod;
