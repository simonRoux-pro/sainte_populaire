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

export const PDF_FILE = {
	name: 'tract.pdf',
	mimeType: 'application/pdf',
	buffer: Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF')
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
