// C. The odometer: a title sequence. The trip meter rolls down from the days since the first incident to the real
// count, decelerating with motion blur, the last digit landing with a thud; as it slows the headline locks in word
// by word from alternate sides, a band of hazard stripes wiping across between words; the logo comes with the last.
import gsap from 'gsap';
import { daysBetween, todayIST } from './flaps';
import { expose, jolt, startHero } from './hero-common';

if (startHero()) {
    const hero = document.querySelector<HTMLElement>('#hero')!;
    const odo = hero.querySelector<HTMLElement>('.hc-odo')!;
    const cols = Array.from(odo.querySelectorAll<HTMLElement>('.col'));
    const strips = cols.map((c) => c.querySelector<HTMLElement>('.strip')!);
    const blur = document.querySelector('#vblur feGaussianBlur')!;
    const words = gsap.utils.toArray<HTMLElement>('.hc-words .w');
    const wipe = hero.querySelector<HTMLElement>('.hc-wipe')!;
    const late = gsap.utils.toArray<HTMLElement>('.hc-late');
    const today = todayIST();
    const to = odo.dataset.since ? Math.max(0, daysBetween(odo.dataset.since, today)) : Number(odo.dataset.to || 0);
    const from = Math.max(to + 20, odo.dataset.first ? daysBetween(odo.dataset.first, today) : 99);

    // the strip holds 0 to 9 plus a second 0 so the ones column can wrap; positions are in tenths of the strip
    strips.forEach((s) => { if (s.children.length === 10) s.appendChild(s.firstElementChild!.cloneNode(true)); });
    const place = (v: number) => {
        const ones = ((v % 10) + 10) % 10;
        const tensBase = Math.floor(v / 10);
        const carry = Math.max(0, ones - 9); // tens moves only while ones crosses 9 to 0
        const tens = (tensBase + carry) % 10;
        strips[strips.length - 1].style.transform = `translateY(${-ones * (100 / 11)}%)`;
        if (strips.length > 1) strips[0].style.transform = `translateY(${-tens * (100 / 11)}%)`;
        cols[0].classList.toggle('dim', strips.length > 1 && Math.round(tens) === 0 && to < 10 && v < 10.5);
    };
    const meter = { v: from };
    let last = from, lastT = 0;
    place(from);
    odo.style.filter = 'url(#vblur)';

    const tl = gsap.timeline();
    tl.to(meter, {
        v: to,
        duration: 2.1,
        ease: 'power3.out',
        onUpdate() {
            place(meter.v);
            const t = tl.time();
            const speed = Math.abs(meter.v - last) / Math.max(0.001, t - lastT); // digits per second
            last = meter.v; lastT = t;
            blur.setAttribute('stdDeviation', `0 ${Math.min(28, speed * 0.55).toFixed(1)}`);
        },
        onComplete() { blur.setAttribute('stdDeviation', '0 0'); odo.style.filter = ''; },
    }, 0.15);
    jolt(hero, 2.25, tl);
    // the headline: each word from alternate sides, a stripe band wiping across as it locks
    words.forEach((w, i) => {
        const at = 1.25 + i * 0.24;
        const fromLeft = i % 2 === 0;
        tl.fromTo(wipe, { x: 0, xPercent: fromLeft ? -120 : 520 }, { x: 0, xPercent: fromLeft ? 520 : -120, duration: 0.26, ease: 'none' }, at - 0.06);
        tl.fromTo(w, { autoAlpha: 0, x: fromLeft ? '-60vw' : '60vw' }, { autoAlpha: 1, x: 0, duration: 0.2, ease: 'power4.out' }, at);
        tl.to(w, { keyframes: [{ x: fromLeft ? 6 : -6 }, { x: 0 }], duration: 0.08, ease: 'none' }, at + 0.2);
    });
    tl.fromTo(late, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out', stagger: 0.15 }, 1.25 + 5 * 0.24);
    expose(tl);
}
