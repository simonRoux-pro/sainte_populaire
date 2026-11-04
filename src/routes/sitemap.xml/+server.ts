import type { RequestHandler } from './$types';
import { PUBLIC_PAGES, SITE } from '$lib/site';

export const prerender = true;

export const GET: RequestHandler = () => {
	const urls = PUBLIC_PAGES.map((path) => `\t<url><loc>${SITE.url}${path}</loc></url>`).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
