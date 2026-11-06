import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { shareImage } from '../../../lib/og';
import { formatDate } from '../../../lib/site';

export async function getStaticPaths() {
    const all = await getCollection('incidents');
    return all.map((incident) => ({ params: { id: incident.id }, props: { incident } }));
}

export const GET: APIRoute = async ({ props }) => {
    const { incident } = props;
    const png = await shareImage({ title: incident.data.title, status: incident.data.status, days: 0, date: formatDate(incident.data.date) });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
