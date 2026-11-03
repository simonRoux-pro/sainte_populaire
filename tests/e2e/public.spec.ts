import { expect, test } from '@playwright/test';
import {
	blockExternal,
	expectNoHorizontalScroll,
	openMenuIfMobile,
	resetBlob,
	trackErrors
} from './helpers';

const PAGES = [
	{ path: '/actualites', title: /Actualités/ },
	{ path: '/calendrier', title: /Calendrier/ },
	{ path: '/contact', title: /Contact/ },
	{ path: '/sainte-pop', title: /Sainte Pop/ },
	{ path: '/programme/grandes-thematiques', title: /Programme/ },
	{ path: '/sainte-pop/poles/communication', title: /Pôle Communication/ },
	{ path: '/mentions-legales', title: /Mentions légales/ },
	{ path: '/rejoindre', title: /Nous rejoindre/ },
	{ path: '/sainte-pop/poles/coordination', title: /Pôle Coordination/ }
];

test.beforeAll(resetBlob);
test.beforeEach(async ({ page }) => blockExternal(page));

test("l'accueil redirige vers les actualités", async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/actualites$/);
	await expect(page.getByText('Aucune actualité pour le moment')).toBeVisible();
});

for (const { path, title } of PAGES) {
	test(`la page ${path} s'affiche sans erreur`, async ({ page }) => {
		const errors = trackErrors(page);
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page).toHaveTitle(title);
		await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
		await expect(page.locator('h1').first()).toBeVisible();
		await expectNoHorizontalScroll(page);
		expect(errors).toEqual([]);
	});
}

test('aucun lien interne ne mène à une 404', async ({ page, request }) => {
	const seen = new Set<string>();
	for (const { path } of PAGES) {
		await page.goto(path);
		const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')!));
		hrefs.forEach((h) => seen.add(h.split('#')[0]));
	}
	for (const href of seen) {
		const res = await request.get(href, { maxRedirects: 0 });
		expect(res.status(), href).toBeLessThan(400);
	}
});

test('le menu fonctionne et donne accès aux pôles', async ({ page, isMobile }) => {
	await page.goto('/actualites');
	const nav = page.getByRole('navigation', { name: 'Navigation principale' });
	if (isMobile) {
		await expect(nav).toBeHidden();
		await openMenuIfMobile(page);
		await expect(nav).toBeVisible();
	} else {
		await nav.getByRole('link', { name: 'Sainte Pop' }).hover();
		await page.getByText('Les pôles').hover();
	}
	await nav.getByRole('link', { name: 'Pôle Garanties' }).click();
	await expect(page).toHaveURL(/\/sainte-pop\/poles\/garanties$/);
	if (isMobile) await expect(nav).toBeHidden();
});

test("pas de lien d'administration visible pour le public", async ({ page }) => {
	await page.goto('/actualites');
	await openMenuIfMobile(page);
	await expect(page.getByRole('link', { name: 'Écrire' })).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Déconnexion' })).toHaveCount(0);
});

test('les en-têtes de sécurité sont présents', async ({ request }) => {
	const res = await request.get('/actualites');
	expect(res.headers()['x-content-type-options']).toBe('nosniff');
	expect(res.headers()['x-frame-options']).toBe('SAMEORIGIN');
	const api = await request.get('/api/events');
	expect(api.headers()['x-robots-tag']).toContain('noindex');
});

test('le sitemap liste les pages publiques sur le vrai domaine', async ({ request }) => {
	const res = await request.get('/sitemap.xml');
	expect(res.status()).toBe(200);
	const xml = await res.text();
	expect(xml).toContain('<loc>https://saintepopulaire.fr/actualites</loc>');
	expect(xml).toContain('<loc>https://saintepopulaire.fr/rejoindre</loc>');
	expect(xml).not.toContain('/admin');
	const robots = await (await request.get('/robots.txt')).text();
	expect(robots).toContain('Sitemap: https://saintepopulaire.fr/sitemap.xml');
});

test('les boutons de la page contact restent dans leur carte', async ({ page }) => {
	await page.goto('/contact');
	for (const card of await page.locator('.contact-card').all()) {
		const box = (await card.boundingBox())!;
		for (const link of await card.locator('a').all()) {
			const l = (await link.boundingBox())!;
			expect(l.x).toBeGreaterThanOrEqual(box.x - 1);
			expect(l.x + l.width).toBeLessThanOrEqual(box.x + box.width + 1);
		}
	}
});

test("l'encadré « Agir avec nous » propose de rejoindre le groupe", async ({ page }) => {
	await page.goto('/actualites');
	const aside = page.getByRole('complementary', { name: 'Agir avec nous' });
	await aside.getByRole('link', { name: /Rejoindre le groupe/ }).click();
	await expect(page).toHaveURL(/\/rejoindre$/);
});
