import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, incidentPath, sortIncidents } from '../lib/site';

export const GET: APIRoute = async (context) => {
    const incidents = sortIncidents(await getCollection('incidents'));
    return rss({
        title: SITE.name,
        description: SITE.description,
        site: context.site ?? SITE.url,
        items: incidents.map((i) => ({
            title: i.data.title,
            link: incidentPath(i),
            pubDate: new Date(`${i.data.date}T09:00:00+05:30`),
            description: `${i.data.summary ? i.data.summary + '\n\n' : ''}${i.body ?? ''}\n\nStatus: ${i.data.status}\nSource: ${i.data.source_url}`,
            categories: [i.data.category],
        })),
    });
};
