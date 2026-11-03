import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	checkCredentials,
	closeSession,
	isAdmin,
	isAuthConfigured,
	openSession
} from '$lib/server/auth';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAuthConfigured()) {
		console.error("ADMIN_PASSWORD n'est pas configuré");
		return json(
			{ error: 'Connexion indisponible : configuration serveur incomplète.' },
			{ status: 503 }
		);
	}

	let body: { username?: unknown; password?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Requête invalide' }, { status: 400 });
	}

	if (checkCredentials(body.username, body.password)) {
		openSession(cookies);
		return json({ success: true });
	}

	// Ralentit les tentatives de force brute.
	await wait(800);
	return json({ error: 'Identifiants invalides' }, { status: 401 });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	closeSession(cookies);
	return json({ success: true });
};

export const GET: RequestHandler = async ({ cookies }) => json({ admin: isAdmin(cookies) });
