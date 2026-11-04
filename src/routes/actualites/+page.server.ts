import type { PageServerLoad } from './$types';
import { getArticles, getEvents } from '$lib/server/db';
import { todayInParis } from '$lib/format';

export const load: PageServerLoad = async () => {
	const [articles, events] = await Promise.all([getArticles(), getEvents()]);
	const today = todayInParis();
	return {
		articles,
		nextEvents: events.filter((e) => e.date >= today).slice(0, 3)
	};
};
