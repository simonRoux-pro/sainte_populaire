import { expect, type Page } from '@playwright/test';
import { ADMIN, BLOB_URL } from '../../playwright.config';

export { ADMIN, BLOB_URL };

/** Bloque les ressources externes (polices, Framaforms, YouTube) pour des tests rapides et stables. */
export const blockExternal = async (page: Page) => {
	await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
};

/** Collecte les erreurs JS de la page, hors ressources externes bloquées. */
export const trackErrors = (page: Page) => {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('console', (m) => {
		if (m.type() === 'error' && !m.text().includes('net::ERR_FAILED')) errors.push(m.text());
	});
	return errors;
};

export const resetBlob = async () => {
	await fetch(`${BLOB_URL}/__reset`, { method: 'POST' });
};

export const blobKeys = async (): Promise<string[]> => (await fetch(`${BLOB_URL}/__list`)).json();

export const login = async (page: Page) => {
	await page.goto('/admin/login');
	await page.getByLabel('Identifiant').fill(ADMIN.username);
	await page.getByLabel('Mot de passe').fill(ADMIN.password);
	await page.getByRole('button', { name: 'Connexion' }).click();
	await page.waitForURL('**/actualites');
};

export const openMenuIfMobile = async (page: Page) => {
	const burger = page.getByRole('button', { name: 'Ouvrir le menu' });
	if (await burger.isVisible()) await burger.click();
};

export const expectNoHorizontalScroll = async (page: Page) => {
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(overflow).toBeLessThanOrEqual(1);
};

/** Génère un petit PDF valide, une page par texte. */
export const makePdf = (texts: string[]): Buffer => {
	const objects: string[] = [];
	const pageIds = texts.map((_, i) => 4 + i * 2);
	objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
	objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${texts.length} >>`;
	objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
	texts.forEach((text, i) => {
		const pageId = pageIds[i];
		const stream = `BT /F1 36 Tf 72 700 Td (${text}) Tj ET`;
		objects[pageId] =
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ` +
			`/Resources << /Font << /F1 3 0 R >> >> /Contents ${pageId + 1} 0 R >>`;
		objects[pageId + 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
	});
	let out = '%PDF-1.4\n';
	const offsets: number[] = [];
	for (let id = 1; id < objects.length; id++) {
		offsets[id] = out.length;
		out += `${id} 0 obj\n${objects[id]}\nendobj\n`;
	}
	const xref = out.length;
	out += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
	for (let id = 1; id < objects.length; id++)
		out += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
	out += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
	return Buffer.from(out, 'latin1');
};

export const PDF_FILE = {
	name: 'tract.pdf',
	mimeType: 'application/pdf',
	buffer: makePdf(['Sainte Populaire', 'Page deux'])
};

// PNG 1x1 valide
export const PNG_FILE = {
	name: 'Affiche Été.png',
	mimeType: 'image/png',
	buffer: Buffer.from(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
		'base64'
	)
};

/** En-tête Origin requis par la protection CSRF de SvelteKit pour les envois de formulaires. */
export const sameOrigin = (baseURL: string | undefined) => ({ origin: baseURL! });
