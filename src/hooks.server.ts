import type { Handle } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.admin = isAdmin(event.cookies);

	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// Les adresses *.vercel.app (prévisualisations) ne doivent pas être indexées :
	// seul le vrai domaine doit apparaître dans Google.
	if (event.url.hostname.endsWith('.vercel.app')) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	if (event.url.pathname.startsWith('/admin') || event.url.pathname.startsWith('/api')) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
		response.headers.set('Cache-Control', 'no-store');
	}

	return response;
};
