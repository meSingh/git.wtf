import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { shareImage } from '../lib/og';
import { daysBetween, formatDate, sortIncidents, todayIST } from '../lib/site';

// The site-wide card. The number is the count at build time; pages that have an incident use its own card.
export const GET: APIRoute = async () => {
    const latest = sortIncidents(await getCollection('incidents'))[0];
    const png = await shareImage({
        title: latest ? latest.data.title : 'One real Git fuck-up a day',
        status: latest ? latest.data.status : 'counting.',
        days: latest ? Math.max(0, daysBetween(latest.data.date, todayIST())) : 0,
        date: latest ? formatDate(latest.data.date) : '',
    });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
