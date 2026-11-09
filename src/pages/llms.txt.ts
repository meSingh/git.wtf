import type { APIRoute } from 'astro';
import { llmsTxt } from '../lib/llms';

// https://llmstxt.org: what the site is and where its answers are, for AI answer engines
export const GET: APIRoute = async () => new Response(await llmsTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
