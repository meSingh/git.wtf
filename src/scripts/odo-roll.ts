// The odometer's motion, apart from src/scripts/odometer.ts so the pages' base script never pulls in GSAP.
import gsap from 'gsap';
import { place } from './odometer';

/** Rolls a wheel from `from` to `to`, decelerating. Returns the tween so it can sit in a timeline. */
export function roll(el: HTMLElement, to: number, from: number, duration = 1.1, ease = 'power3.out', onSpeed?: (digitsPerSecond: number) => void) {
    const meter = { v: from };
    let last = from;
    let lastT = performance.now();
    place(el, from);
    return gsap.to(meter, {
        v: to,
        duration,
        ease,
        onUpdate() {
            place(el, meter.v);
            if (onSpeed) {
                const now = performance.now();
                onSpeed(Math.abs(meter.v - last) / Math.max(0.001, (now - lastT) / 1000));
                last = meter.v;
                lastT = now;
            }
        },
        onComplete() {
            place(el, to);
            onSpeed?.(0);
        },
    });
}
