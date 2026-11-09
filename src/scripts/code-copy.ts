// The archive's copy buttons: shown only when the clipboard is there, each copies its own text and says so.
export function codeCopy() {
    if (!navigator.clipboard) return;
    document.querySelectorAll<HTMLElement>('.code-acts').forEach((a) => (a.hidden = false));
    document.addEventListener('click', async (e) => {
        const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.code-copy');
        if (!b) return;
        const label = b.dataset.label ?? (b.dataset.label = b.textContent ?? 'Copy');
        try { await navigator.clipboard.writeText(b.dataset.copy ?? ''); b.textContent = 'Copied'; b.classList.add('done'); }
        catch { b.textContent = 'Press Ctrl+C'; }
        setTimeout(() => { b.textContent = label; b.classList.remove('done'); }, 1600);
    });
}
codeCopy();
