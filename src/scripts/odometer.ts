// The odometer: wheels of 0 to 9 (plus a wrap 0) moved with carry, like a trip meter. Every number on the homepage
// uses it. A wheel's position is in digits; the strip has 11 cells, so one digit is 100/11 % of its height.

export function todayIST(now = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function daysBetween(a: string, b: string): number {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

const cols = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('.odo-col'));

/** Puts the wheels at a continuous value: the units wheel turns freely, each higher wheel only while the ones below cross 9 to 0. */
export function place(el: HTMLElement, v: number) {
    const cs = cols(el);
    const n = cs.length;
    const val = Math.max(0, v);
    cs.forEach((c, i) => {
        const k = n - 1 - i; // 0 for the units wheel
        const p = 10 ** k;
        let pos: number;
        if (k === 0) pos = val % 10;
        else {
            const whole = Math.floor(val / p);
            const rem = val - whole * p;
            pos = (whole % 10) + Math.max(0, rem - (p - 1));
        }
        c.style.setProperty('--pos', String(pos));
        (c.firstElementChild as HTMLElement).style.transform = `translateY(${(-pos * 100) / 11}%)`;
    });
    if (el.dataset.dim) dimLeading(el, Math.round(val));
}

function dimLeading(el: HTMLElement, v: number) {
    const cs = cols(el);
    const digits = String(v).padStart(cs.length, '0');
    let leading = true;
    cs.forEach((c, i) => {
        if (digits[i] !== '0' || i === cs.length - 1) leading = false;
        c.classList.toggle('dim', leading);
    });
}

/** The value a wheel should show now: live from data-since when it has one. */
export function target(el: HTMLElement): number {
    const since = el.dataset.since;
    return since ? Math.max(0, daysBetween(since, todayIST())) : Number(el.dataset.value || 0);
}

/** Sets every live wheel on the page to today's value, without motion. */
export function syncOdos(root: ParentNode = document) {
    root.querySelectorAll<HTMLElement>('.odo[data-since]').forEach((el) => {
        const v = target(el);
        if (String(v) !== el.dataset.value) {
            el.dataset.value = String(v);
            if (!el.dataset.from || !document.documentElement.classList.contains('js-anim')) place(el, v);
            const owner = el.closest<HTMLElement>('[aria-label]');
            if (owner && owner !== el) owner.setAttribute('aria-label', (owner.getAttribute('aria-label') ?? '').replace(/^\d+/, String(v)));
            el.setAttribute('aria-label', String(v));
        }
    });
}
