import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { getArticles } from '$lib/server/db';

/** N'accepte que des fichiers venant du stockage Vercel Blob (ou du faux stockage des tests). */
const isStorageUrl = (raw: string) => {
	try {
		const url = new URL(raw);
		if (url.protocol === 'https:' && url.hostname.endsWith('.blob.vercel-storage.com')) return true;
		return Boolean(env.VERCEL_BLOB_API_URL) && raw.startsWith(env.VERCEL_BLOB_API_URL!);
	} catch {
		return false;
	}
};

/**
 * Sert le PDF d'un article depuis l'adresse du site.
 * Le lecteur intégré peut ainsi le charger sans restriction entre domaines.
 */
export const GET: RequestHandler = async ({ params }) => {
	const article = (await getArticles()).find((a) => a.id === params.id);
	if (!article?.file || !isStorageUrl(article.file)) error(404, 'PDF introuvable');

	const upstream = await fetch(article.file);
	if (!upstream.ok || !upstream.body) error(502, 'PDF indisponible');

	const filename = `${article.slug || 'article'}.pdf`;
	return new Response(upstream.body, {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `inline; filename="${filename}"`,
			'cache-control': 'public, max-age=300, s-maxage=3600'
		}
	});
};
