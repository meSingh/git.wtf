// Images below the first screen carry data-src and get their source only as they come within a screen of view, and
// only once the first paint is well past: from the reader's first scroll, or 1.5 s after load. Pages without
// JavaScript show the noscript copies instead.
export function lateImages() {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-src]'));
    if (!imgs.length) return;
    const wake = (img: HTMLImageElement) => {
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.src = img.dataset.src!;
        img.removeAttribute('data-src');
    };
    let started = false;
    const start = () => {
        if (started) return;
        started = true;
        removeEventListener('scroll', start);
        const io = new IntersectionObserver((entries) => entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            wake(e.target as HTMLImageElement);
        }), { rootMargin: '100% 50%' });
        imgs.forEach((img) => io.observe(img));
    };
    addEventListener('scroll', start, { once: true, passive: true });
    const later = () => setTimeout(start, 1500);
    if (document.readyState === 'complete') later();
    else addEventListener('load', later, { once: true });
}
