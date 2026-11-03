import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin } from '$lib/server/auth';
import { deleteAssets, getArticles, saveArticle, uploadAsset } from '$lib/server/db';
import { errorResponse, unauthorized } from '$lib/server/http';
import { sanitizeFilename, slugify } from '$lib/server/strings';
import {
	IMAGE_TYPES,
	isoDate,
	optionalFile,
	optionalUrl,
	requiredFile,
	text
} from '$lib/server/validation';

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdmin(cookies)) return unauthorized();

	const uploaded: string[] = [];
	try {
		const form = await request.formData();
		const title = text(form, 'title', 'Titre', 200);
		const date = isoDate(form, 'date', 'Date');
		const summary = text(form, 'summary', 'Résumé', 1000);
		const link = optionalUrl(form, 'link');
		const pdf = await requiredFile(form, 'pdf', 'PDF', ['application/pdf']);
		const image = await optionalFile(form, 'image', 'Image', Object.keys(IMAGE_TYPES));

		const id = Date.now().toString();
		const now = new Date().toISOString();

		const pdfAsset = await uploadAsset(
			`articles/${id}/${sanitizeFilename(pdf.name, 'article.pdf')}`,
			pdf.buffer,
			pdf.type
		);
		uploaded.push(pdfAsset.pathname);

		let imageAsset: { url: string; pathname: string } | undefined;
		if (image) {
			imageAsset = await uploadAsset(
				`articles/${id}/${sanitizeFilename(image.name, `image.${IMAGE_TYPES[image.type]}`)}`,
				image.buffer,
				image.type
			);
			uploaded.push(imageAsset.pathname);
		}

		// Slug unique : on ajoute un suffixe si le titre existe déjà.
		const existing = new Set((await getArticles()).map((a) => a.slug));
		const base = slugify(title) || id;
		const slug = existing.has(base) ? `${base}-${id}` : base;

		const article = await saveArticle({
			id,
			type: 'pdf',
			title,
			date,
			summary,
			file: pdfAsset.url,
			image: imageAsset?.url,
			link,
			slug,
			createdAt: now,
			updatedAt: now,
			storage: { file: pdfAsset.pathname, image: imageAsset?.pathname }
		});

		return json({ success: true, article }, { status: 201 });
	} catch (error) {
		await deleteAssets(uploaded);
		return errorResponse(error, "Erreur lors de l'envoi du PDF");
	}
};
