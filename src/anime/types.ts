// The shot list: what the daily task writes for each incident in format B. The kit (src/components/anime/, the
// engine in src/scripts/anime.ts) reads it. Field names here are the contract with Content.
export type Pose = 'neutral' | 'shocked' | 'dramatic' | 'defeated';
export interface CastIn {
    who: 'dev' | 'agent';
    pose?: Pose;
    /** Where the figure stands, in frame units (the frame is 1600 x 900), and how big. */
    x: number;
    y: number;
    scale?: number;
    /** An agent's chest number. */
    n?: number;
    /** Mirror it. */
    flip?: boolean;
    /** THE EXTRA: the small grey agent with no number and no glow. */
    extra?: boolean;
    /** Drawn as a black silhouette (eyes still glow). */
    silhouette?: boolean;
    /** An arm pose: pointing, a raised flat palm, a hand held high, holding something in front. */
    arm?: 'point' | 'palm' | 'up' | 'hold';
    /** The pose it turns to on the "turn" effect. */
    turn?: Pose;
    /** A name effects can aim at (the hero, the thief, the catcher...). */
    role?: string;
}
export interface Shot {
    id: string;
    /** The ground behind: black, white, yellow, speed lines, or three diagonal panels. */
    bg?: 'black' | 'white' | 'yellow' | 'speedlines' | 'split' | 'split12' | 'dusk' | 'flat';
    cast?: CastIn[];
    /** For bg "split": the three close-ups, top to bottom. */
    panels?: CastIn[];
    /** Props the kit can draw: the folder, the file blizzard, a counter. */
    props?: {
        folder?: { x: number; y: number; scale?: number };
        files?: boolean;
        counter?: { to: number; x: number; y: number };
        desk?: { x: number; y: number };
        copier?: { x: number; y: number };
        paper?: { x: number; y: number };
        stack?: { x: number; y: number; to?: [number, number] };
        branch?: { x: number; y: number };
        rain?: boolean;
    };
    /** Effects, each optionally at a time: "impact@0.9". See FX in src/scripts/anime.ts. */
    fx?: string[];
    /** One impact word, huge and tilted, and when it lands (seconds into the shot, after its picture). */
    word?: string;
    wordAt?: number;
    /** Or one line, said by someone, and when. */
    line?: { who: string; text: string };
    lineAt?: number;
    /** What a phone keeps in frame when the 16:9 frame has to be cropped. */
    focus?: [number, number];
    /** The vertical (9:16, 900 x 1600) staging: cast and props placed for the tall frame. Without it, a layout rule
     *  places them. Keep faces, words and the stamp inside the safe area x 54 to 740, y 240 to 1040. */
    v?: { cast?: CastIn[]; props?: Shot['props'] };
    /** Draw this shot as a still on the incident page. */
    still?: boolean;
}
export interface ShotList { incident: string; episode: string; title: string; shots: Shot[] }
