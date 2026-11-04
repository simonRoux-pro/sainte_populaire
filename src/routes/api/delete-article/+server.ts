import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin } from '$lib/server/auth';
import { deleteArticleById } from '$lib/server/db';
import { errorResponse, unauthorized } from '$lib/server/http';

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) return unauthorized();

	try {
		const { id } = await request.json();
		if (!id) {
			return json({ error: "L'identifiant de l'article est obligatoire." }, { status: 400 });
		}
		const deleted = await deleteArticleById(String(id));
		if (!deleted) return json({ error: 'Article introuvable' }, { status: 404 });
		return json({ success: true });
	} catch (error) {
		return errorResponse(error, "Erreur lors de la suppression de l'article");
	}
};
