// Git City: the town every incident happens in. Repositories are buildings, branches streets, worktrees houses.
// An incident's event script names the building it happens to; the rest of the town stands around it. Scars from
// past incidents can be added here as the record grows.
export type BuildingType = 'house' | 'office' | 'warehouse' | 'gate' | 'tower';
export interface Building { id: string; type: BuildingType; x: number; y: number; w: number; d: number; h: number; label?: string }

export const GRID = 16;
/** Streets: [x0, y0, x1, y1] in tiles, one tile wide. */
export const STREETS: [number, number, number, number][] = [
    [0, 7, 15, 7],
    [7, 0, 7, 15],
    [3, 11, 7, 11],
    [11, 3, 11, 7],
];
export const STREET_NAMES = [
    { text: 'main', x: 2.2, y: 7.5 },
    { text: 'feature/tidy', x: 7.5, y: 2.6 },
];
export const BUILDINGS: Building[] = [
    { id: 'repo', type: 'tower', x: 9, y: 1, w: 2, d: 2, h: 190, label: 'the repo' },
    { id: 'objects', type: 'warehouse', x: 1, y: 1, w: 3, d: 2, h: 70, label: '.git/objects' },
    { id: 'office', type: 'office', x: 13, y: 12, w: 2, d: 2, h: 110 },
    { id: 'gate', type: 'gate', x: 7, y: 14, w: 1, d: 1, h: 60, label: 'main' },
    { id: 'house-a', type: 'house', x: 3, y: 4, w: 1, d: 1, h: 40 },
    { id: 'house-b', type: 'house', x: 9, y: 3, w: 1, d: 1, h: 40 },
    { id: 'house-c', type: 'house', x: 3, y: 10, w: 1, d: 1, h: 40 },
    { id: 'house-d', type: 'house', x: 1, y: 13, w: 1, d: 1, h: 40 },
    { id: 'house-e', type: 'house', x: 13, y: 5, w: 1, d: 1, h: 40 },
    { id: 'house-f', type: 'house', x: 13, y: 8, w: 1, d: 1, h: 40 },
    { id: 'myfolder', type: 'house', x: 8, y: 8, w: 1, d: 1, h: 42, label: 'my folder' },
];
export const TREES: [number, number][] = [[1, 6], [6, 1], [13, 2], [15, 10], [11, 14], [3, 15], [10, 15], [5, 14], [15, 6], [0, 9]];
