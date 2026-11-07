import type { APIRoute } from 'astro';
import { llmsFullTxt } from '../lib/llms';

// every incident and archive answer as plain text, so an answer engine can quote it without parsing the pages
export const GET: APIRoute = async () => new Response(await llmsFullTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
