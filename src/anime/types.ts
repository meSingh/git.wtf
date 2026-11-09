// The shot list: what the daily task writes for each incident in format B. The kit (src/components/anime/, the
// engine in src/scripts/anime.ts) reads it. Field names here are the contract with Content.
export type Pose = 'neutral' | 'shocked' | 'dramatic' | 'defeated' | 'terror' | 'asleep' | 'walk' | 'enter' | 'angry' | 'relieved' | 'happy' | 'hide';
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
    arm?: 'point' | 'palm' | 'up' | 'hold' | 'type' | 'salute' | 'broom';
    /** The pose it turns to on the "turn" effect. */
    turn?: Pose;
    /** A name effects can aim at (the hero, the thief, the catcher...). */
    role?: string;
    /** Soaked: drips and a darker screen. */
    wet?: boolean;
    /** DEV only: false draws no mug in the hand (after it has shattered, or when the mug is a prop). */
    mug?: boolean;
}
type At = { x: number; y: number; scale?: number };
/** Everything the kit can draw, placed in frame units. */
export interface Props {
    folder?: At & { label?: string; empty?: boolean };
    files?: boolean;
    /** The counter: a large number, with words under it (label), and a word that lands when the count stops (after). */
    counter?: { x: number; y: number; to?: number; from?: number; value?: number; label?: string; after?: string };
    /** The desk: a top, legs and a front. `laptop` is an open laptop on it, x relative to the desk's middle. */
    desk?: At & { laptop?: { x: number }; /** no front panel: the space under it shows */ open?: boolean };
    chair?: At;
    copier?: At;
    paper?: At & { ring?: boolean };
    stack?: At & { to?: [number, number]; grow?: [number, number]; ring?: boolean };
    branch?: At;
    rain?: boolean;
    lamp?: At;
    pages?: Partial<At> & { ring?: boolean; grow?: boolean; scatter?: boolean; puddles?: boolean };
    note?: At & { text: string; at?: number };
    door?: At;
    box?: At & { icon?: 'lifebuoy' };
    window?: At;
    skylight?: At;
    broom?: At;
    mug?: At;
    gate?: At & { sign?: string; tally?: boolean; at?: number };
    farwindow?: At & { folder?: string };
    /** A trail of wet footprints on the floor, from one point to another. */
    footprints?: { from: [number, number]; to: [number, number] };
    // ---- v3 kit (Mandeep, 8 Nov 2026: more props so every episode looks different) ----
    /** A yellow bulldozer (a force push). fx "doze" drives it in from the left to where it stands. */
    bulldozer?: At & { label?: string };
    /** A parcel with a label (a push). fx "ship" sends it up and out of the frame. */
    parcel?: At & { label?: string };
    /** An open logbook (the reflog). `blank` draws empty pages; fx "flip" turns its pages. */
    logbook?: At & { blank?: boolean; text?: string };
    /** A building with a sign and a roller shutter (a hosted service). fx "shutter" rolls the shutter down. */
    building?: At & { sign?: string; shut?: boolean };
    /** A potted plant (set dressing). fx "wilt" droops it. */
    plant?: At;
    /** A wall clock. fx "clockspin" spins its hands (time passing). */
    clock?: At;
    /** A whiteboard on the wall, with up to three rows of marker writing. */
    whiteboard?: At & { text?: string };
    /** A big monitor with a command on it. fx "typeon" types the command out. */
    terminal?: At & { text: string; prompt?: string; red?: boolean };
    /** A waste bin. */
    bin?: At;
    /** A framed poster on the wall with one word. */
    poster?: At & { text?: string };
}
export interface Shot {
    id: string;
    /** The ground behind: black, white, yellow, speed lines, or three diagonal panels. */
    bg?: 'black' | 'white' | 'yellow' | 'speedlines' | 'split' | 'split12' | 'dusk' | 'flat' | 'room' | 'night' | 'paper' | 'stack3'
        // v3 grounds: an office wall with blinds and a clock, a server room, a city at dusk, blueprint grid, comic halftone, a sunburst
        | 'office' | 'servers' | 'skyline' | 'blueprint' | 'halftone' | 'sunburst';
    /** The hook: big caption text at the top of the frame, there from the first frame (shorts style). "\n" breaks rows. */
    hook?: string;
    /** A small taped label in the corner: "26 MINUTES EARLIER", "16 DAYS LATER". */
    tag?: string;
    cast?: CastIn[];
    /** For bg "split": the three close-ups, top to bottom. */
    panels?: CastIn[];
    /** Props the kit can draw (see Props). */
    props?: Props;
    /** Effects, each optionally at a time: "impact@0.9". See FX in src/scripts/anime.ts. */
    fx?: string[];
    /** One impact word, huge and tilted, and when it lands (seconds into the shot, after its picture). */
    word?: string;
    wordAt?: number;
    /** Or one line, said by someone, and when. */
    line?: { who: string; text: string };
    lineAt?: number;
    /** Voice this shot's line or say. Off by default: an episode is mostly silent comedy, with a voice at a few
     *  chosen moments only (Mandeep, 8 Nov 2026). A line without it is drawn and not heard. */
    voice?: boolean;
    /** A voiced line with nothing drawn (a narrator), and when, in seconds into the shot.
     *  A shot has at most one voiced line: line or say. */
    say?: { who: string; text: string; at: number };
    /** Sounds, each optionally at a time: "clink@0.8"; with no time it starts with the shot. Names are Video's
     *  (manifest.sfx). A looped sound (typing, rain...) runs until the shot ends. When a shot has sfx, its fx make
     *  no sound, so nothing doubles. */
    sfx?: string[];
    /** The music for this shot and on, until a shot names another. "none" is silence. Names are Video's
     *  (manifest.music). */
    music?: 'heroic' | 'calm' | 'sad' | 'comic' | 'soft' | 'sneaky' | 'theme' | 'none' | (string & {});
    /** What a phone keeps in frame when the 16:9 frame has to be cropped. */
    focus?: [number, number];
    /** The vertical (9:16, 900 x 1600) staging: cast and props placed for the tall frame. Without it, a layout rule
     *  places them. Its fx, where given, replace the shared list for the tall frame (camera moves differ); the
     *  sound plan and timings stay the shared ones. Safe areas: no words above y 190 or below y 1200, nothing to
     *  read right of x 780 below y 700; words 400 to 900, lines 1000 to 1180. */
    v?: { cast?: CastIn[]; props?: Props; fx?: string[]; bg?: Shot['bg'] };
    /** Draw this shot as a still on the incident page, at stillAt seconds in (else just before it ends). */
    still?: boolean;
    stillAt?: number;
}
/** An episode's look: the room's colours. Each episode picks one, so no two look the same. */
export type Theme = 'midnight' | 'teal' | 'plum' | 'rust' | 'mint' | 'cobalt' | 'olive';
export interface ShotList {
    incident: string;
    /** "No. 67". Numbering carries on from the old blog's 66 posts; shown on the end card only, never up front. */
    episode: string;
    title: string;
    theme?: Theme;
    /** The one quiet music bed under the whole episode (a manifest music name); default "comic". */
    bed?: string;
    shots: Shot[];
}
