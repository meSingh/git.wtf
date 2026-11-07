import type { BitModule } from './run';

type Round = { day: string; rows: string[]; took?: string; investigating?: boolean };

const mod: BitModule = {
    reset({ gsap, q, qa }) {
        gsap.set(q('.inv'), { autoAlpha: 0 });
        gsap.set(qa('.log li'), { autoAlpha: 0 });
        gsap.set(qa('.loop .ln:not(:first-child)'), { autoAlpha: 0 });
    },
    play({ tl, gsap, q, qa, cap, type, params }) {
        const rounds = params.rounds as Round[];
        const rows = (name: string) => q(`[data-row="${name}"] .st`);
        const logs = qa('.log li');
        const errs = qa('.loop .e');
        // the page flickers the whole time, and the banner never changes
        tl.to(q('.sp'), { keyframes: [{ opacity: 0.55 }, { opacity: 1 }, { opacity: 0.8 }, { opacity: 1 }], duration: 0.5, repeat: rounds.length * 2, ease: 'none' }, 0);
        let at = 0.1;
        rounds.forEach((r, i) => {
            const sts = r.rows.map(rows).filter(Boolean) as HTMLElement[];
            tl.call(() => sts.forEach((s) => { s.textContent = 'Degraded'; s.style.color = '#9a6700'; }), [], at);
            if (r.investigating) tl.set(q('.inv'), { autoAlpha: 1 }, at);
            tl.to(errs[i], { autoAlpha: 1, duration: 0.01 }, at + 0.15);
            tl.call(() => sts.forEach((s) => { s.textContent = 'Normal'; s.style.color = ''; }), [], at + 0.55);
            tl.to(logs[i], { autoAlpha: 1, duration: 0.15 }, at + 0.55);
            type(logs[i]?.querySelector('.said') ?? null, at + 0.6, 140);
            if (i === 1) cap(2, at + 0.6);
            at += 1.25;
        });
        cap(3, at - 0.4);
        tl.to(qa('.loop .ln.y'), { autoAlpha: 1, duration: 0.01 }, at);
        void gsap;
    },
};
export const { reset, play } = mod;
