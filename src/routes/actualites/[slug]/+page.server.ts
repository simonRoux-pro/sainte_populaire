import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getArticleBySlug } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const article = await getArticleBySlug(params.slug);

	if (!article || article.type !== 'markdown' || !article.body) {
		error(404, 'Article introuvable');
	}

	return {
		title: article.title,
		date: article.date,
		summary: article.summary,
		content: article.body
	};
};
