// Sound for the anime cutscene, from Video's sound library (video/audio/, copied for the site to public/audio/ by
// scripts/sync-audio.mjs). Music bed, effects keyed to the engine's effect names, sounds for cuts, words and the
// stamp, and voice cuts keyed to incident and shot. Nothing is fetched until the viewer's first click, tap or key
// on the cutscene; a toggle mutes it and is remembered.
//
// The manifest is Video's (see video/audio/README.md):
//   sounds: [{ id, file, web, kind: sfx|music|voice, tags, duration, source, license, date, cost }]
//   fx:     { "<effect name>": "<sound id>" | null }
//   events: { cut, word, stamp, tbc, music, musicEnd }: sound ids
//   voices: { "<incident id>": { "<shot id>": "<sound id>" } }   (else a voice sound tagged [incident, shotId])

export interface Sound { id: string; file?: string; web?: string; kind?: string; tags?: string[]; duration?: number; gain?: number }
export interface Manifest {
    sounds: Sound[];
    fx?: Record<string, string | null>;
    events?: Partial<Record<'cut' | 'word' | 'stamp' | 'tbc' | 'music' | 'musicEnd', string | null>>;
    voices?: Record<string, Record<string, string>>;
}
/** A timed moment of the cut, as the page publishes it (shared with the video recorder). */
export interface Cue { t: number; kind: 'fx' | 'line' | 'word' | 'cut' | 'stamp' | 'tbc' | 'music'; name: string; shot: string }

const GAIN: Record<string, number> = { music: 0.32, voice: 1, sfx: 0.75 };

/** The sound a cue plays, if the library has one. */
export function soundFor(m: Manifest | null, incident: string, c: Cue): Sound | null {
    if (!m) return null;
    const byId = (id: string | null | undefined) => (id ? m.sounds.find((s) => s.id === id) ?? null : null);
    if (c.kind === 'fx') return byId(m.fx?.[c.name]);
    if (c.kind === 'line') return byId(m.voices?.[incident]?.[c.name]) ?? m.sounds.find((s) => s.kind === 'voice' && s.tags?.includes(incident) && s.tags?.includes(c.name)) ?? null;
    if (c.kind === 'music') return byId(c.name === 'end' ? m.events?.musicEnd : m.events?.music);
    return byId(m.events?.[c.kind as 'cut' | 'word' | 'stamp' | 'tbc']);
}

export class CutAudio {
    on = true;
    private ctx: AudioContext | null = null;
    private m: Manifest | null = null;
    private buffers = new Map<string, AudioBuffer>();
    private master: GainNode | null = null;
    private bed: AudioBufferSourceNode | null = null;
    private pending: AudioBufferSourceNode[] = [];
    private ready: Promise<boolean> | null = null;

    constructor(private base: string, private incident: string, private cuesFor: (shot: number) => Cue[], private allCues: () => Cue[]) {
        try { this.on = localStorage.getItem('gitwtf-sound') !== 'off'; } catch { /* private mode: on */ }
    }

    /** On the viewer's first click, tap or key: the manifest, then only this cut's sounds. */
    start(): Promise<boolean> {
        if (this.ready) return this.ready;
        this.ready = (async () => {
            try {
                const res = await fetch(`${this.base}/audio/manifest.json`);
                if (!res.ok) return false;
                this.m = (await res.json()) as Manifest;
                const need = new Map<string, Sound>();
                this.allCues().forEach((c) => { const s = soundFor(this.m, this.incident, c); if (s?.web) need.set(s.web, s); });
                if (!need.size) return false;
                this.ctx = new AudioContext();
                this.master = this.ctx.createGain();
                this.master.gain.value = this.on ? 1 : 0;
                this.master.connect(this.ctx.destination);
                await Promise.all([...need.keys()].map(async (f) => {
                    try {
                        const r = await fetch(`${this.base}/audio/${f}`);
                        if (r.ok) this.buffers.set(f, await this.ctx!.decodeAudioData(await r.arrayBuffer()));
                    } catch { /* a missing file is a silent cue */ }
                }));
                const bed = soundFor(this.m, this.incident, { t: 0, kind: 'music', name: 'start', shot: '' });
                if (bed) this.bed = this.play(bed, 0, true);
                return true;
            } catch {
                return false;
            }
        })();
        return this.ready;
    }

    private play(s: Sound, when: number, loop = false) {
        if (!this.ctx || !this.master || !s.web) return null;
        const b = this.buffers.get(s.web);
        if (!b) return null;
        const src = this.ctx.createBufferSource();
        src.buffer = b;
        src.loop = loop;
        const g = this.ctx.createGain();
        g.gain.value = s.gain ?? GAIN[s.kind ?? 'sfx'] ?? 0.75;
        src.connect(g).connect(this.master);
        src.start(this.ctx.currentTime + Math.max(0, when));
        return src;
    }

    /** A shot comes on: its sounds are scheduled from now, at their times in the shot. */
    shot(k: number, shotStart: number) {
        this.stopPending();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') void this.ctx.resume();
        this.cuesFor(k).forEach((c) => {
            if (c.kind === 'music') return;
            const s = soundFor(this.m, this.incident, c);
            const src = s ? this.play(s, c.t - shotStart) : null;
            if (src) this.pending.push(src);
        });
    }

    stopPending() {
        this.pending.forEach((s) => { try { s.stop(); } catch { /* already over */ } });
        this.pending = [];
    }

    toggle() {
        this.on = !this.on;
        try { localStorage.setItem('gitwtf-sound', this.on ? 'on' : 'off'); } catch { /* fine */ }
        if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.on ? 1 : 0, this.ctx.currentTime, 0.05);
        return this.on;
    }
}
