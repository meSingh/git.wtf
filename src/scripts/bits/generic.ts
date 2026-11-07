import type { BitModule } from './run';

const mod: BitModule = {
    reset({ gsap, qa }) {
        gsap.set(qa('.out .ln'), { autoAlpha: 0 });
    },
    play({ qa, lines }) {
        lines(qa('.out .ln'), 0.1, 0.5);
    },
};
export const { reset, play } = mod;
