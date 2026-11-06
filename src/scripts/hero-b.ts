// B. The crash: a calm session goes wrong and gets a sign slapped over it.
// 0 to 1.1 s checkout, pull, rebase, conflict; 1.2 s `git push --force`; then the output goes wrong, faster and
// faster, with a tear across the frame; at 2.0 s the sign slams down like a shutter, bounces twice, the number
// rolling on the way down and settling with it. The terminal keeps running faint behind the sign and never stops.
import gsap from 'gsap';
import { currentValue, rollTo } from './flaps';
import { expose, jolt, startHero } from './hero-common';

if (startHero()) {
    const hero = document.querySelector<HTMLElement>('#hero')!;
    const term = hero.querySelector<HTMLElement>('.hb-term')!;
    const box = hero.querySelector<HTMLElement>('.hb-lines')!;
    const shutter = hero.querySelector<HTMLElement>('.hb-shutter')!;
    const tear = hero.querySelector<HTMLElement>('.hb-tear')!;
    const flaps = hero.querySelector<HTMLElement>('.hb-flaps')!;
    const lines = Array.from(box.querySelectorAll<HTMLElement>('.ln:not(.live)'));
    const live = box.querySelector<HTMLElement>('.ln.live')!;
    const value = currentValue(flaps) ?? Number(flaps.dataset.value || 0);

    lines.forEach((l) => (l.hidden = true));
    // keep the newest line at the bottom edge once the session fills the screen
    const follow = () => {
        const over = box.scrollHeight - term.clientHeight;
        box.style.transform = over > 0 ? `translateY(${-over}px)` : '';
    };
    const show = (l: HTMLElement) => {
        l.hidden = false;
        box.insertBefore(l, live);
        follow();
    };
    const typeInto = (l: HTMLElement, at: number, dur: number) => {
        const tx = l.querySelector<HTMLElement>('.tx')!;
        const text = tx.textContent ?? '';
        const p = { n: 0 };
        tl.call(() => { tx.textContent = ''; show(l); live.hidden = true; }, [], at);
        tl.to(p, { n: text.length, duration: dur, ease: 'none', onUpdate: () => { tx.textContent = text.slice(0, Math.round(p.n)); } }, at);
        tl.call(() => { live.hidden = false; follow(); }, [], at + dur + 0.02);
    };

    const tl = gsap.timeline();
    let t = 0.05;
    let fast = 0.055;
    lines.forEach((l, i) => {
        if (l.classList.contains('cmd')) {
            const len = (l.textContent ?? '').length;
            const dur = l.textContent?.includes('--force') ? 0.24 : Math.min(0.24, len * 0.011);
            if (l.textContent?.includes('--force')) t += 0.12; // the pause before the push
            typeInto(l, t, dur);
            t += dur + 0.06;
        } else {
            tl.call(() => show(l), [], t);
            const afterPush = lines.slice(0, i).some((x) => x.textContent?.includes('--force'));
            if (afterPush) { t += fast; fast = Math.max(0.012, fast * 0.82); } else t += 0.05;
        }
    });
    // the tear: a band of the screen jumps sideways twice
    tl.set(tear, { autoAlpha: 1 }, 1.78)
        .fromTo(tear, { x: '-3vw' }, { x: '4vw', duration: 0.05, ease: 'none' }, 1.78)
        .to(tear, { x: '-1vw', duration: 0.04, ease: 'none' })
        .set(tear, { autoAlpha: 0 }, 1.9)
        .set(tear, { autoAlpha: 1, x: '2vw', top: '62%' }, 1.94)
        .set(tear, { autoAlpha: 0 }, 1.98);
    // the shutter: slams from above, bounces twice on a hard ease, the number rolling as it falls
    // y: 0 matters: GSAP reads the stylesheet's start transform as a pixel offset and would keep it
    gsap.set(shutter, { y: 0, yPercent: -112 });
    tl.fromTo(shutter, { y: 0, yPercent: -112 }, { y: 0, yPercent: 0, duration: 0.3, ease: 'power4.in' }, 2.0)
        .to(shutter, { yPercent: -5, duration: 0.12, ease: 'power2.out' })
        .to(shutter, { yPercent: 0, duration: 0.1, ease: 'power2.in' })
        .to(shutter, { yPercent: -1.6, duration: 0.07, ease: 'power2.out' })
        .to(shutter, { yPercent: 0, duration: 0.07, ease: 'power2.in' });
    tl.add(rollTo(flaps, value, 0.66, 0.06), 2.0);
    jolt(hero, 2.3, tl, 3);
    tl.to(term, { opacity: 0.3, duration: 0.25, ease: 'power1.out' }, 2.3);
    // after the slam the session keeps going, slowly, behind the sign
    tl.call(() => {
        const pool = lines.filter((l) => !l.classList.contains('cmd')).map((l) => l.textContent ?? '');
        let k = 0;
        setInterval(() => {
            const div = document.createElement('div');
            div.className = 'ln out';
            div.textContent = pool[k++ % pool.length];
            box.insertBefore(div, live);
            if (box.children.length > 80) box.firstElementChild?.remove();
            follow();
        }, 650);
    }, [], 2.9);
    expose(tl);
}
