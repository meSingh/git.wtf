import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { shareImage } from '../../../lib/og';
import { formatDate } from '../../../lib/site';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function getStaticPaths() {
    const all = await getCollection('incidents');
    return all.map((incident) => ({ params: { id: incident.id }, props: { incident } }));
}

export const GET: APIRoute = async ({ props }) => {
    const { incident } = props;
    // the comic's own share image (panel 4 with its stamp, from video/comic.mjs) when the incident has one
    const own = path.join(process.cwd(), process.env.GITWTF_FIXTURE === '1' ? 'tests/fixtures/incidents' : 'incidents', incident.id, 'share.png');
    if (existsSync(own)) return new Response(new Uint8Array(await readFile(own)), { headers: { 'Content-Type': 'image/png' } });
    const png = await shareImage({ title: incident.data.title, status: incident.data.status, days: 0, date: formatDate(incident.data.date) });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
