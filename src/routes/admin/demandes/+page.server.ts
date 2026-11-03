import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	deleteJoinRequest,
	joinRequestsEnabled,
	listJoinRequests,
	markJoinRequestDone
} from '$lib/server/join-requests';
import { formatPhone } from '$lib/server/phone';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.admin) redirect(303, '/admin/login');
	if (!joinRequestsEnabled()) return { configured: false, requests: [] };

	const requests = (await listJoinRequests()).map((r) => ({
		...r,
		phoneDisplay: formatPhone(r.phone),
		chatUrl:
			r.app === 'whatsapp'
				? `https://wa.me/${r.phone.slice(1)}`
				: `https://signal.me/#p/${encodeURIComponent(r.phone)}`
	}));
	return { configured: true, requests };
};

const withId = async (request: Request) => {
	const id = (await request.formData()).get('id');
	return typeof id === 'string' ? id : '';
};

export const actions: Actions = {
	done: async ({ request, locals }) => {
		if (!locals.admin) return fail(401);
		if (!(await markJoinRequestDone(await withId(request)))) return fail(404);
	},
	delete: async ({ request, locals }) => {
		if (!locals.admin) return fail(401);
		if (!(await deleteJoinRequest(await withId(request)))) return fail(404);
	}
};
