import type { PageServerLoad } from './$types';
import { getEvents } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	return { events: await getEvents() };
};
