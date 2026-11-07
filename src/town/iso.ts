// Isometric geometry for the toy town. A tile is 96 wide and 48 tall on screen; tile (0,0) has its top corner at
// the origin; +x runs down-right, +y down-left, z is height in screen pixels.
export const TW = 96, TH = 48;
export const P = (x: number, y: number, z = 0): [number, number] => [(x - y) * (TW / 2), (x + y) * (TH / 2) - z];
const pts = (a: [number, number][]) => 'M' + a.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';

/** The ground diamond of a footprint. */
export const floor = (x: number, y: number, w: number, d: number, z = 0) => pts([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)]);

/** A box: its top, its left face (the +y side) and its right face (the +x side). */
export function box(x: number, y: number, w: number, d: number, h: number, z = 0) {
    return {
        top: pts([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]),
        left: pts([P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)]),
        right: pts([P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)]),
    };
}

/** A pyramid roof on a box top: the two faces the eye sees. */
export function roof(x: number, y: number, w: number, d: number, z: number, rh: number) {
    const apex = P(x + w / 2, y + d / 2, z + rh);
    return {
        left: pts([P(x, y + d, z), P(x + w, y + d, z), apex]),
        right: pts([P(x + w, y, z), P(x + w, y + d, z), apex]),
        back: pts([P(x, y, z), P(x + w, y, z), apex, P(x, y + d, z)]),
    };
}

/** The middle of a footprint on the ground, in screen units. */
export const centre = (x: number, y: number, w = 1, d = 1, z = 0) => P(x + w / 2, y + d / 2, z);
