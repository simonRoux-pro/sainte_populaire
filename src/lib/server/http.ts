import { json } from '@sveltejs/kit';
import { StorageNotConfiguredError } from './db';
import { ValidationError } from './validation';

export const unauthorized = () => json({ error: 'Non autorisé' }, { status: 401 });

/** Transforme les erreurs connues en réponses JSON lisibles par l'interface admin. */
export const errorResponse = (error: unknown, fallback: string) => {
	if (error instanceof ValidationError) {
		return json({ error: error.message }, { status: 400 });
	}
	if (error instanceof StorageNotConfiguredError) {
		return json({ error: error.message }, { status: 503 });
	}
	console.error(fallback, error);
	return json({ error: fallback }, { status: 500 });
};
