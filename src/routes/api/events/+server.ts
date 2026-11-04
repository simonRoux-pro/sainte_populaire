import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin } from '$lib/server/auth';
import {
	EVENT_TYPES,
	deleteAssets,
	deleteEventById,
	getEvents,
	saveEvent,
	uploadAsset
} from '$lib/server/db';
import { errorResponse, unauthorized } from '$lib/server/http';
import { sanitizeFilename } from '$lib/server/strings';
import {
	IMAGE_TYPES,
	clockTime,
	durationHours,
	isoDate,
	oneOf,
	optionalFile,
	optionalUrl,
	text
} from '$lib/server/validation';

export const GET: RequestHandler = async () => {
	try {
		return json(await getEvents());
	} catch (error) {
		return errorResponse(error, 'Erreur lors du chargement des événements');
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) return unauthorized();

	const uploaded: string[] = [];
	try {
		const form = await request.formData();
		const title = text(form, 'title', 'Titre', 200);
		const date = isoDate(form, 'date', 'Date');
		const time = clockTime(form, 'time', 'Heure');
		const duration = durationHours(form, 'duration', 'Durée');
		const location = text(form, 'location', 'Lieu', 300);
		const description = text(form, 'description', 'Description', 3000);
		const type = oneOf(form, 'type', 'Type', EVENT_TYPES);
		const link = optionalUrl(form, 'link');
		const image = await optionalFile(form, 'image', 'Image', Object.keys(IMAGE_TYPES));

		const id = Date.now();
		let imageAsset: { url: string; pathname: string } | undefined;
		if (image) {
			imageAsset = await uploadAsset(
				`events/${id}/${sanitizeFilename(image.name, `image.${IMAGE_TYPES[image.type]}`)}`,
				image.buffer,
				image.type
			);
			uploaded.push(imageAsset.pathname);
		}

		const event = await saveEvent({
			id,
			title,
			date,
			time,
			duration,
			location,
			description,
			type,
			link,
			image: imageAsset?.url,
			createdAt: new Date().toISOString(),
			storage: { image: imageAsset?.pathname }
		});

		return json({ success: true, event }, { status: 201 });
	} catch (error) {
		await deleteAssets(uploaded);
		return errorResponse(error, "Erreur lors de la création de l'événement");
	}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) return unauthorized();

	try {
		const { id } = await request.json();
		const numericId = Number(id);
		if (!Number.isFinite(numericId)) {
			return json({ error: "ID d'événement manquant" }, { status: 400 });
		}
		const deleted = await deleteEventById(numericId);
		if (!deleted) return json({ error: 'Événement introuvable' }, { status: 404 });
		return json({ success: true });
	} catch (error) {
		return errorResponse(error, "Erreur lors de la suppression de l'événement");
	}
};
