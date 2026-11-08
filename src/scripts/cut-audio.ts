// Sound for the anime cutscene, from Video's sound library (video/audio/, copied for the site to public/audio/ by
// scripts/sync-audio.mjs). Music bed, effects keyed to the engine's effect names, sounds for cuts, words and the
// stamp, and voice cuts keyed to incident and shot. Nothing is fetched until the viewer's first click, tap or key
// on the cutscene; a toggle mutes it and is remembered.
//
// The manifest is Video's (see video/audio/README.md):
//   sounds: [{ id, file, web, kind: sfx|music|voice, tags, duration, source, license, date, cost }]
//   fx:     { "<effect name>": "<sound id>" | null }       sounds for the engine's effects
//   sfx:    { "<sound name>": "<sound id>" }               a shot's own sounds ("clink@0.8")
//   music:  { "<state>": "<bed id>" | null }               a shot's music state; "none" is silence
//   events: { cut, word, stamp, tbc, music, musicEnd }: a sound id, or several played together
//   voices: { "<incident id>": { "<shot id>": "<sound id>" } }   (else a voice sound tagged [incident, shotId])
//   mix:    { music, sfx, voice, duckUnderVoice } in dB
// A sound tagged "loop" runs until its shot ends (beds run until the state changes).

export interface Sound { id: string; file?: string; web?: string; kind?: string; tags?: string[]; duration?: number; gain?: number }
type Ids = string | string[] | null | undefined;
export interface Manifest {
    sounds: Sound[];
    fx?: Record<string, string | null>;
    sfx?: Record<string, string | null>;
    music?: Record<string, string | null>;
    events?: Record<string, Ids>;
    voices?: Record<string, Record<string, string>>;
    mix?: { music?: number; sfx?: number; voice?: number; duckUnderVoice?: number };
}
/** A timed moment of the cut, as the page publishes it (shared with the video recorder). */
export interface Cue { t: number; kind: 'fx' | 'sfx' | 'line' | 'say' | 'word' | 'cut' | 'stamp' | 'tbc' | 'music'; name: string; shot: string }

const GAIN: Record<string, number> = { music: 0.32, voice: 1, sfx: 0.75 };
const db = (x: number) => Math.pow(10, x / 20);

/** The sounds a cue plays, if the library has them. */
export function soundsFor(m: Manifest | null, incident: string, c: Cue): Sound[] {
    if (!m) return [];
    const byId = (ids: Ids) => [ids ?? []].flat().map((id) => m.sounds.find((s) => s.id === id)).filter((s): s is Sound => !!s);
    if (c.kind === 'fx') return byId(m.fx?.[c.name]);
    if (c.kind === 'sfx') return byId(m.sfx?.[c.name]);
    if (c.kind === 'line' || c.kind === 'say') {
        const v = byId(m.voices?.[incident]?.[c.name]);
        return v.length ? v : m.sounds.filter((s) => s.kind === 'voice' && s.tags?.includes(incident) && s.tags?.includes(c.name)).slice(0, 1);
    }
    if (c.kind === 'music') {
        if (c.name === 'start') return byId(m.events?.music);
        if (c.name === 'end') return byId(m.events?.musicEnd);
        return byId(m.music?.[c.name]);
    }
    return byId(m.events?.[c.kind]);
}

export class CutAudio {
    on = true;
    private ctx: AudioContext | null = null;
    private m: Manifest | null = null;
    private buffers = new Map<string, AudioBuffer>();
    private master: GainNode | null = null;
    private musicBus: GainNode | null = null;
    private bed: { src: AudioBufferSourceNode; g: GainNode; name: string } | null = null;
    private pending: AudioBufferSourceNode[] = [];
    private ready: Promise<boolean> | null = null;

    constructor(private base: string, private incident: string, private cuesFor: (shot: number) => Cue[], private allCues: () => Cue[], opts: { defaultOn?: boolean } = {}) {
        const def = opts.defaultOn ?? true;
        try { const v = localStorage.getItem('gitwtf-sound'); this.on = v ? v === 'on' : def; } catch { this.on = def; }
    }

    /** Scrolled playback: the cues crossed between two moments play now; the bed follows the music state at t. */
    scrub(prev: number, t: number) {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') void this.ctx.resume();
        this.setBed(this.bedAt(t), 0);
        if (t <= prev || t - prev > 1.5) { this.stopPending(); return; }
        this.allCues().filter((c) => c.kind !== 'music' && c.t > prev && c.t <= t).forEach((c) => {
            soundsFor(this.m, this.incident, c).forEach((s) => { const p = this.play(s, 0, false); if (p) this.pending.push(p.src); });
        });
    }

    /** On the viewer's first click, tap or key: the manifest, then only this cut's sounds. */
    start(): Promise<boolean> {
        if (this.ready) return this.ready;
        this.ready = (async () => {
            try {
                const res = await fetch(`${this.base}/audio/manifest.json`);
                if (!res.ok) return false;
                this.m = (await res.json()) as Manifest;
                const need = new Set<string>();
                this.allCues().forEach((c) => soundsFor(this.m, this.incident, c).forEach((s) => s.web && need.add(s.web)));
                if (!need.size) return false;
                this.ctx = new AudioContext();
                this.ctx.onstatechange = () => this.onState?.();
                this.master = this.ctx.createGain();
                this.master.gain.value = this.on ? 1 : 0;
                this.master.connect(this.ctx.destination);
                this.musicBus = this.ctx.createGain();
                this.musicBus.connect(this.master);
                await Promise.all([...need].map(async (f) => {
                    try {
                        const r = await fetch(`${this.base}/audio/${f}`);
                        if (r.ok) this.buffers.set(f, await this.ctx!.decodeAudioData(await r.arrayBuffer()));
                    } catch { /* a missing file is a silent cue */ }
                }));
                return true;
            } catch {
                return false;
            }
        })();
        return this.ready;
    }

    private level(s: Sound) {
        if (s.gain) return s.gain;
        const k = s.kind ?? 'sfx';
        const mix = this.m?.mix?.[k as 'music' | 'sfx' | 'voice'];
        return typeof mix === 'number' ? db(mix) : GAIN[k] ?? 0.75;
    }

    private play(s: Sound, when: number, loop = false, out: AudioNode | null = this.master) {
        if (!this.ctx || !out || !s.web) return null;
        const b = this.buffers.get(s.web);
        if (!b) return null;
        const src = this.ctx.createBufferSource();
        src.buffer = b;
        src.loop = loop;
        const g = this.ctx.createGain();
        g.gain.value = this.level(s);
        src.connect(g).connect(out);
        src.start(this.ctx.currentTime + Math.max(0, when));
        return { src, g };
    }

    /** The bed in effect at a moment: the last music cue at or before it ("end" and "none" are silence). */
    private bedAt(t: number) {
        let c: Cue | undefined;
        this.allCues().forEach((x) => { if (x.kind === 'music' && x.t <= t + 1e-3) c = x; });
        return c;
    }

    private setBed(c: Cue | undefined, when: number) {
        if (!this.ctx) return;
        const name = c?.name ?? 'none';
        if (this.bed?.name === name) return;
        const at = this.ctx.currentTime + Math.max(0, when);
        if (this.bed) {
            const old = this.bed;
            old.g.gain.setTargetAtTime(0, at, 0.12);
            try { old.src.stop(at + 0.8); } catch { /* over */ }
            this.bed = null;
        }
        const s = c ? soundsFor(this.m, this.incident, c)[0] : undefined;
        const p = s ? this.play(s, when, true, this.musicBus) : null;
        if (p && s) {
            p.g.gain.setValueAtTime(0, at);
            p.g.gain.setTargetAtTime(this.level(s), at, 0.12);
            this.bed = { ...p, name };
        }
    }

    /** A shot comes on: its sounds are scheduled from now, at their times in the shot. */
    shot(k: number, shotStart: number) {
        this.stopPending();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') void this.ctx.resume();
        this.setBed(this.bedAt(shotStart), 0);
        const duck = this.m?.mix?.duckUnderVoice;
        this.cuesFor(k).forEach((c) => {
            const when = c.t - shotStart;
            if (c.kind === 'music') { if (when > 1e-3) this.setBed(c, when); return; }
            soundsFor(this.m, this.incident, c).forEach((s) => {
                const p = this.play(s, when, !!s.tags?.includes('loop'));
                if (!p) return;
                this.pending.push(p.src);
                // the music steps back while someone speaks
                if ((c.kind === 'line' || c.kind === 'say') && typeof duck === 'number' && this.musicBus && this.ctx) {
                    const at = this.ctx.currentTime + Math.max(0, when);
                    const len = p.src.buffer?.duration ?? 1.5;
                    this.musicBus.gain.setTargetAtTime(db(duck), at, 0.08);
                    this.musicBus.gain.setTargetAtTime(1, at + len, 0.25);
                }
            });
        });
    }

    /** Out of view or off the page: everything stops, the music included; the next shot picks it up again. */
    pause() {
        this.stopPending();
        if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend();
    }

    stopPending() {
        this.pending.forEach((s) => { try { s.stop(); } catch { /* already over */ } });
        this.pending = [];
        if (this.musicBus && this.ctx) { this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime); this.musicBus.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1); }
    }

    /** Whether sound can actually be heard: a browser keeps audio suspended until the viewer clicks or presses a key. */
    get live() { return !!this.ctx && this.ctx.state === 'running'; }
    /** Called when the audio starts or stops being able to play, so the button can show the truth. */
    onState: (() => void) | null = null;
    /** After a click or key: start the sound the viewer chose (it is remembered across visits). */
    unlock() {
        if (!this.on) return Promise.resolve(false);
        return this.start().then((ok) => { if (ok && this.ctx && this.ctx.state !== 'running') return this.ctx.resume().then(() => true, () => false); return ok; });
    }

    toggle() {
        this.on = !this.on;
        try { localStorage.setItem('gitwtf-sound', this.on ? 'on' : 'off'); } catch { /* fine */ }
        if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.on ? 1 : 0, this.ctx.currentTime, 0.05);
        return this.on;
    }
}
