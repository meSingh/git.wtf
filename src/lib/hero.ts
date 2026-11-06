import { getCollection } from 'astro:content';
import { daysBetween, happened, incidentPath, sortIncidents, todayIST } from './site';

/** What every hero shows: the live count, the day it counts from, the latest title, and the span since the first incident. */
export async function heroData() {
    const incidents = sortIncidents(await getCollection('incidents'));
    const latest = incidents[0] ?? null;
    const first = incidents.at(-1) ?? null;
    const today = todayIST();
    return {
        days: latest ? Math.max(0, daysBetween(happened(latest), today)) : 0,
        since: latest ? happened(latest) : null,
        firstSince: first ? happened(first) : null,
        total: first ? Math.max(0, daysBetween(happened(first), today)) : 99,
        title: latest?.data.title ?? 'No incident on record yet',
        path: latest ? incidentPath(latest) : '/incidents/',
    };
}
