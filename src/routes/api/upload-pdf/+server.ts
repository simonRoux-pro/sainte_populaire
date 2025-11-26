import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth';
import {
	StorageNotConfiguredError,
	saveArticle,
	uploadAsset
} from '$lib/server/db';
import { sanitizeFilename, slugify } from '$lib/server/strings';

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) {
		return json({ error: 'Non autorisé' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const date = formData.get('date') as string;
		const summary = formData.get('summary') as string;
		const imageFile = formData.get('image');
		const link = (formData.get('link') as string) || '';
		const pdfFile = formData.get('pdf');

		if (!title || !date || !summary || !pdfFile || typeof pdfFile === 'string') {
			return json({ error: 'Champs manquants' }, { status: 400 });
		}

		if (pdfFile.type !== 'application/pdf') {
			return json({ error: 'Le fichier doit être un PDF.' }, { status: 400 });
		}

		const id = Date.now().toString();
		const now = new Date().toISOString();

		const pdfArrayBuffer = await pdfFile.arrayBuffer();
		const pdfKey = `articles/${id}/${sanitizeFilename(pdfFile.name || 'article.pdf')}`;
		const pdfAsset = await uploadAsset(pdfKey, pdfArrayBuffer, 'application/pdf');

		let imageUrl: string | undefined;
		let imageStoragePath: string | undefined;

		if (imageFile && imageFile instanceof File) {
			if (!allowedImageTypes.includes(imageFile.type)) {
				return json({ error: "Format d'image non supporté" }, { status: 400 });
			}
			const imageArrayBuffer = await imageFile.arrayBuffer();
			const imgKey = `articles/${id}/${sanitizeFilename(imageFile.name)}`;
			const imgAsset = await uploadAsset(imgKey, imageArrayBuffer, imageFile.type || 'image/png');
			imageUrl = imgAsset.url;
			imageStoragePath = imgAsset.pathname;
		}

		const article = await saveArticle({
			id,
			type: 'pdf',
			title,
			date,
			summary,
			file: pdfAsset.url,
			image: imageUrl,
			link: link || undefined,
			slug: slugify(title),
			createdAt: now,
			updatedAt: now,
			storage: {
				file: pdfAsset.pathname,
				image: imageStoragePath
			}
		});

		return json({ success: true, article }, { status: 201 });
	} catch (error) {
		if (error instanceof StorageNotConfiguredError) {
			return json({ error: error.message }, { status: 503 });
		}

		console.error('Erreur upload article PDF', error);
		return json({ error: "Erreur lors de l'envoi du PDF" }, { status: 500 });
	}
};