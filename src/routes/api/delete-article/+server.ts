import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth';
import { StorageNotConfiguredError, deleteArticleById } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) {
		return json({ error: 'Non autorisé' }, { status: 401 });
	}

	const { id } = await request.json();

	if (!id) {
		return json({ error: "L'identifiant de l'article est obligatoire." }, { status: 400 });
	}

	try {
		await deleteArticleById(String(id));
		return json({ success: true });
	} catch (error) {
		if (error instanceof StorageNotConfiguredError) {
			return json({ error: error.message }, { status: 503 });
		}

		console.error('Erreur suppression article', error);
		return json({ error: "Erreur lors de la suppression de l'article" }, { status: 500 });
	}
};
