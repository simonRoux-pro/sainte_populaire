import type { PageServerLoad } from './$types';
import { isAdmin } from '$lib/server/auth';
import { getArticles } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	const articles = await getArticles();

	return {
		articles,
		admin: isAdmin(cookies)
	};
};