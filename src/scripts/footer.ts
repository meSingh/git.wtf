// The footer's motion: as the footer approaches, fetch the cast (its SVG and styles) and put the two drawings in
// place; when the credits come into view, roll them up once and let the cast rise after them. The arrival is done
// with the Web Animations API rather than stylesheet keyframes: an animation rule sitting in the page's CSS cost the
// hero's first paint about 150 ms under Lighthouse, measured. With reduced motion the cast still arrives, and
// everything is simply there. Called from the layout's script on every page, after the first frame.
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
export function mountFooter() {
    const foot = document.querySelector<HTMLElement>('[data-foot]');
    if (!foot || !('IntersectionObserver' in window)) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const roll = foot.querySelector<HTMLElement>('.roll');
    let big: SVGElement | null = null;
    let arrived = false;
    const hide = (el: Element | null) => { if (el && !reduce && !arrived) (el as HTMLElement).style.opacity = '0'; };
    hide(roll);
    let fetched = false;
    const cast = async () => {
        if (fetched) return; fetched = true;
        try {
            const html = await (await fetch(foot.dataset.cast!)).text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const style = doc.querySelector('style'), peek = doc.querySelector('.foot-peek');
            big = doc.querySelector<SVGElement>('.foot-cast');
            if (style) document.head.append(style);
            if (big) { hide(big); foot.querySelector('.foot-credits')?.append(big); }
            if (peek) foot.querySelector('.foot-card')?.prepend(peek);
        } catch { /* no cast, then */ }
    };
    const near = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { near.disconnect(); cast(); } }, { rootMargin: '1200px 0px' });
    near.observe(foot);
    if (reduce) return;
    const arrive = () => {
        arrived = true;
        if (roll) { roll.style.opacity = ''; roll.animate([{ opacity: 0, transform: 'translateY(60vh)' }, { opacity: 1, transform: 'none' }], { duration: 4500, easing: EASE, fill: 'backwards' }); }
        const rise = () => { if (!big) return; big.style.opacity = ''; big.animate([{ opacity: 0, transform: 'translate(-50%, 18%)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 1400, delay: 600, easing: EASE, fill: 'backwards' }); };
        if (big) rise(); else cast().then(rise);
    };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); arrive(); } }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(foot.querySelector('.foot-credits') ?? foot);
}
