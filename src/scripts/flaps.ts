// The split-flap engine: a digit cell flips through values like a departure board.
// Every cell renders server-side with the right digit; this only adds the motion and keeps the number current.
import gsap from 'gsap';

export function todayIST(now = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function daysBetween(a: string, b: string): number {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}
export const reducedMotion = () => {
    if (location.search.includes('reduce')) document.documentElement.classList.add('reduce');
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('reduce');
};

type Flap = HTMLElement;
const digitsOf = (n: number, min: number) => String(Math.max(0, Math.floor(n))).padStart(min, '0').split('');

function parts(flap: Flap) {
    return {
        top: flap.querySelector<HTMLElement>('.flap-top .flap-digit')!,
        bottom: flap.querySelector<HTMLElement>('.flap-bottom .flap-digit')!,
        leafTop: flap.querySelector<HTMLElement>('.flap-leaf-top')!,
        leafTopDigit: flap.querySelector<HTMLElement>('.flap-leaf-top .flap-digit')!,
        leafBottom: flap.querySelector<HTMLElement>('.flap-leaf-bottom')!,
        leafBottomDigit: flap.querySelector<HTMLElement>('.flap-leaf-bottom .flap-digit')!,
    };
}

/** Sets a cell to a digit with no motion. */
export function setDigit(flap: Flap, d: string) {
    const p = parts(flap);
    p.top.textContent = p.bottom.textContent = p.leafTopDigit.textContent = p.leafBottomDigit.textContent = d;
    flap.dataset.digit = d;
    gsap.set(p.leafTop, { rotateX: 0 });
    gsap.set(p.leafBottom, { rotateX: 90 });
}

/** One flip from the current digit to `next`. */
export function flip(flap: Flap, next: string, dur = 0.09, overshoot = false): gsap.core.Timeline {
    const p = parts(flap);
    const tl = gsap.timeline();
    tl.call(() => {
        const cur = flap.dataset.digit ?? '0';
        p.leafTopDigit.textContent = cur;
        p.top.textContent = next;
        p.leafBottomDigit.textContent = next;
        gsap.set(p.leafTop, { rotateX: 0 });
        gsap.set(p.leafBottom, { rotateX: 90 });
    });
    tl.to(p.leafTop, { rotateX: -90, duration: dur, ease: 'power2.in' });
    if (overshoot) {
        tl.to(p.leafBottom, { rotateX: -7, duration: dur * 1.1, ease: 'power2.out' });
        tl.to(p.leafBottom, { rotateX: 0, duration: dur * 0.9, ease: 'power1.inOut' });
    } else {
        tl.to(p.leafBottom, { rotateX: 0, duration: dur, ease: 'power2.out' });
    }
    tl.call(() => {
        p.bottom.textContent = next;
        flap.dataset.digit = next;
        gsap.set(p.leafTop, { rotateX: 0 });
        p.leafTopDigit.textContent = next;
        gsap.set(p.leafBottom, { rotateX: 90 });
    });
    return tl;
}

function applyDim(flaps: HTMLElement) {
    const cells = Array.from(flaps.querySelectorAll<Flap>('.flap'));
    let dim = true;
    cells.forEach((c, i) => {
        if (c.dataset.digit !== '0' || i === cells.length - 1) dim = false;
        c.classList.toggle('dim', dim);
    });
}

/** Rolls every cell through a full turn and settles on `value`. About 1.2 s; the last flap overshoots a little. */
export function rollTo(flaps: HTMLElement, value: number, duration = 1.2, stagger = 0.07): gsap.core.Timeline {
    const cells = Array.from(flaps.querySelectorAll<Flap>('.flap'));
    const target = digitsOf(value, cells.length);
    const master = gsap.timeline();
    const steps = 10;
    // flip durations grow towards the end so the board slows down and settles
    const weights = Array.from({ length: steps }, (_, s) => 1 + 0.7 * (s / (steps - 1)));
    const unit = duration / weights.reduce((a, b) => a + b, 0) / 2;
    cells.forEach((flap, i) => {
        const end = target[i] ?? '0';
        const cur = Number(flap.dataset.digit ?? '0');
        const tl = gsap.timeline();
        for (let s = 1; s <= steps; s++) {
            const digit = s === steps ? end : String((cur + s) % 10);
            tl.add(flip(flap, digit, unit * weights[s - 1], s === steps));
        }
        master.add(tl, i * stagger);
    });
    master.call(() => applyDim(flaps));
    return master;
}

/** Static set of a whole counter. */
export function renderValue(flaps: HTMLElement, value: number) {
    const cells = Array.from(flaps.querySelectorAll<Flap>('.flap'));
    const digits = digitsOf(value, cells.length);
    cells.forEach((c, i) => setDigit(c, digits[i]));
    flaps.dataset.value = String(value);
    applyDim(flaps);
}

/** Days since the counter's data-since date, counted in IST. Computed here so the number climbs without a deploy. */
export function currentValue(flaps: HTMLElement): number | null {
    const since = flaps.dataset.since;
    if (!since) return null;
    return Math.max(0, daysBetween(since, todayIST()));
}

export function syncCounters() {
    document.querySelectorAll<HTMLElement>('.flaps[data-since]').forEach((f) => {
        const v = currentValue(f);
        if (v !== null && String(v) !== f.dataset.value) {
            renderValue(f, v);
            const owner = f.closest<HTMLElement>('[aria-label]');
            if (owner) owner.setAttribute('aria-label', (owner.getAttribute('aria-label') ?? '').replace(/^\S+/, String(v)));
        }
    });
}
