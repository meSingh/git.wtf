import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES } from '../../content.config';
import { pageCard, type PageCard } from '../../lib/og';
import { categoryLabel, daysBetween, sortIncidents, todayIST } from '../../lib/site';

// The share images of every page that is not an incident, one per page, rendered at build time: /og/<name>.png.
// Archive posts and pages are named by their slug; the lists are archive, incidents and incidents-<category>.
export async function getStaticPaths() {
    const latest = sortIncidents(await getCollection('incidents'))[0];
    const days = latest ? Math.max(0, daysBetween(latest.data.date, todayIST())) : 0;
    const cards: { name: string; card: PageCard }[] = [];
    for (const e of await getCollection('archive')) {
        const post = e.data.type === 'post';
        cards.push({ name: e.id, card: post
            ? { kind: 'From the archive', title: e.data.title, stamp: 'still works.', line: 'Written before AI took over the fixing.', days }
            : { kind: 'The small print', title: e.data.title, stamp: 'read by nobody.', line: 'Short, as small print goes.', days } });
    }
    cards.push({ name: 'archive', card: { kind: 'The old blog', title: 'The archive', stamp: 'unchanged.', line: 'The commands still work. The jokes are older.', days } });
    cards.push({ name: 'incidents', card: { kind: 'The record', title: 'The fuck-ups', stamp: 'ongoing.', line: 'Every Git and AI fuck-up we have caught.', days } });
    const used = new Set(sortIncidents(await getCollection('incidents')).map((i) => i.data.category));
    for (const c of CATEGORIES.filter((x) => used.has(x))) cards.push({ name: `incidents-${c}`, card: { kind: 'Filed under', title: categoryLabel(c), stamp: 'filed.', line: 'More of these will come.', days } });
    return cards.map(({ name, card }) => ({ params: { name }, props: { card } }));
}

export const GET: APIRoute = async ({ props }) => new Response(await pageCard(props.card as PageCard), { headers: { 'Content-Type': 'image/png' } });
