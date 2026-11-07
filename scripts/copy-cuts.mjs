#!/usr/bin/env node
// Serves what was rendered from each incident's cutscene: incidents/<id>/cut/* (stills, the exported video) is
// copied to public/cuts/<id>/ before every build (generated, not committed).
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FIXTURE = process.env.GITWTF_FIXTURE === '1';
const dir = path.join(root, FIXTURE ? 'tests/fixtures/incidents' : 'incidents');
let n = 0;
for (const id of readdirSync(dir)) {
    const cut = path.join(dir, id, 'cut');
    if (!existsSync(cut) || !statSync(cut).isDirectory()) continue;
    const dest = path.join(root, 'public/cuts', id);
    rmSync(dest, { recursive: true, force: true }); // stale renders go, so the page shows only what the cut has now
    cpSync(cut, dest, { recursive: true });
    n++;
}
console.log(`[cuts] ${n} incident${n === 1 ? '' : 's'} with rendered cuts`);
