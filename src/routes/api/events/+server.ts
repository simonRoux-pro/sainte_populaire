import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth';
import {
	StorageNotConfiguredError,
	deleteEventById,
	getEvents,
	saveEvent,
	uploadAsset
} from '$lib/server/db';
import { sanitizeFilename } from '$lib/server/strings';

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export const GET: RequestHandler = async () => {
	try {
		const events = await getEvents();
		return json(events);
	} catch (error) {
		console.error('Erreur chargement événements', error);
		return json({ error: 'Erreur lors du chargement des événements' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) {
		return json({ error: 'Non autorisé' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const date = formData.get('date') as string;
		const time = formData.get('time') as string;
		const duration = formData.get('duration') as string;
		const location = formData.get('location') as string;
		const description = formData.get('description') as string;
		const type = formData.get('type') as string;
		const link = (formData.get('link') as string) || '';
		const imageFile = formData.get('image');

		if (!title || !date || !time || !duration || !location || !description || !type) {
			return json({ error: 'Champs obligatoires manquants' }, { status: 400 });
		}

		let imageUrl: string | undefined;
		let imageStoragePath: string | undefined;

		if (imageFile && imageFile instanceof File) {
			if (!allowedImageTypes.includes(imageFile.type)) {
				return json({ error: "Format d'image non supporté" }, { status: 400 });
			}
			const arrayBuffer = await imageFile.arrayBuffer();
			const imageKey = `events/${Date.now()}-${sanitizeFilename(imageFile.name)}`;
			const imgAsset = await uploadAsset(imageKey, arrayBuffer, imageFile.type || 'image/png');
			imageUrl = imgAsset.url;
			imageStoragePath = imgAsset.pathname;
		}

		const id = Date.now();
		const now = new Date().toISOString();

		const event = await saveEvent({
			id,
			title,
			date,
			time,
			duration,
			location,
			description,
			type,
			link: link || undefined,
			image: imageUrl,
			createdAt: now,
			storage: {
				image: imageStoragePath
			}
		});

		return json({ success: true, event }, { status: 201 });
	} catch (error) {
		if (error instanceof StorageNotConfiguredError) {
			return json({ error: error.message }, { status: 503 });
		}
		console.error('Erreur création événement', error);
		return json({ error: "Erreur lors de la création de l'événement" }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) {
		return json({ error: 'Non autorisé' }, { status: 401 });
	}

	try {
		const { id } = await request.json();

		if (!id) {
			return json({ error: "ID d'événement manquant" }, { status: 400 });
		}

		await deleteEventById(Number(id));
		return json({ success: true });
	} catch (error) {
		if (error instanceof StorageNotConfiguredError) {
			return json({ error: error.message }, { status: 503 });
		}
		console.error('Erreur suppression événement', error);
		return json({ error: "Erreur lors de la suppression de l'événement" }, { status: 500 });
	}
};

