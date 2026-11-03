import type { PageServerLoad } from './$types';
import { getArticles } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	return { articles: await getArticles() };
};
