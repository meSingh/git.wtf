// The act script: what the daily task writes for each incident. The kit (src/components/theatre/, the engine in
// src/scripts/theatre.ts) reads it. Field names here are the contract with Content.
export interface Line { who: string; text: string; x: number; y: number }
export interface Beat {
    /** A verb the engine knows (see VERBS in src/scripts/theatre.ts). */
    do: string;
    /** Run with the beat before it instead of after it. */
    with?: boolean;
    [param: string]: unknown;
}
export interface Act { id: string; line?: Line | null; beats: Beat[] }
export interface ActScript {
    incident: string;
    /** The set: which props stand on stage, and their words. */
    set: { house?: { sign: string; number?: number }; sock?: boolean };
    cast: { dev: boolean; agents: number };
    acts: Act[];
}
