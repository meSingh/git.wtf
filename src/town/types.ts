// The event script: what the daily task writes for each incident in format C. The town (src/town/city.ts) stays;
// the script says which building the incident happens to, who comes, and what happens, beat by beat.
export interface Line {
    /** Who says it: a cast name (extra, dev, house, ambulance, dozers), or "caption" for a caption across the top. */
    who: string;
    text: string;
    /** Seconds into the beat, after the picture it answers. */
    after: number;
}
export interface Beat {
    id: string;
    /** Where the camera goes: a building id, a cast name, or [x, y] in tiles; zoom 1 is the whole town. */
    camera: { on: string | [number, number]; zoom: number };
    /** Verbs, each optionally at a time: "honk@1.6". See VERBS in src/scripts/town.ts. */
    do: string[];
    line?: Line;
    /** The reader's one poke: the beat waits for it, with this label on the prompt; after `pokeWait` seconds it pokes itself. */
    poke?: string;
    pokeWait?: number;
}
export interface TownEvent {
    incident: string;
    title: string;
    /** The building it happens to (an id in src/town/city.ts). */
    target: string;
    /** Radial streets into the target, each with a stop line: the bulldozers come down them. Replaces the grid streets. */
    roads?: number;
    cast: { agents: number; extra: boolean; dev: boolean };
    beats: Beat[];
}
