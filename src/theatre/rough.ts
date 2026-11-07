// Scissor-cut edges: a polygon's sides broken into short segments, each point nudged by a seeded amount, so paper
// shapes look cut by hand and look the same on every build.
export function rng(seed: number) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** A closed path through the points with jittered sides. `step` is the segment length, `amp` the wobble. */
export function rough(points: [number, number][], seed = 1, amp = 2.2, step = 26): string {
    const r = rng(seed);
    const out: [number, number][] = [];
    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];
        const len = Math.hypot(x2 - x1, y2 - y1);
        const n = Math.max(1, Math.round(len / step));
        for (let k = 0; k < n; k++) {
            const t = k / n;
            const j = k === 0 ? 0.4 : 1;
            out.push([x1 + (x2 - x1) * t + (r() - 0.5) * amp * 2 * j, y1 + (y2 - y1) * t + (r() - 0.5) * amp * 2 * j]);
        }
    }
    return 'M' + out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
}

export const rect = (x: number, y: number, w: number, h: number, seed = 1, amp = 2.2) => rough([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], seed, amp);
