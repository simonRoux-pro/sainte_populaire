import { expect, test } from '@playwright/test';
import {
	blobKeys,
	blockExternal,
	login,
	openMenuIfMobile,
	PDF_FILE,
	PNG_FILE,
	resetBlob,
	sameOrigin,
	trackErrors
} from './helpers';

test.beforeEach(async ({ page }) => {
	await resetBlob();
	await blockExternal(page);
});

test('publier puis supprimer un article PDF', async ({ page }) => {
	const errors = trackErrors(page);
	await login(page);
	await openMenuIfMobile(page);
	await page.getByRole('link', { name: 'Écrire' }).click();
	await expect(page).toHaveURL(/\/admin\/ajouter-pdf$/);

	await page.getByLabel('Titre *').fill('Lettre ouverte à la mairie');
	await page.getByLabel('Date *').fill('2026-03-01');
	await page.getByLabel('Résumé *').fill('Nos propositions pour les transports.');
	await page.getByLabel(/Fichier PDF/).setInputFiles(PDF_FILE);
	await page.getByLabel(/Image de couverture/).setInputFiles(PNG_FILE);
	await page.getByLabel(/Lien externe/).fill('https://exemple.fr/campagne');
	await page.getByRole('button', { name: "Publier l'article" }).click();
	await expect(page.getByRole('status')).toContainText('Article publié');

	const keys = await blobKeys();
	expect(keys.filter((k) => k.endsWith('.json'))).toHaveLength(1);
	expect(keys.some((k) => /articles\/\d+\/tract-[0-9a-f]+\.pdf$/.test(k))).toBe(true);
	expect(keys.some((k) => /articles\/\d+\/affiche-ete-[0-9a-f]+\.png$/.test(k))).toBe(true);

	await page.goto('/actualites');
	const card = page.getByRole('article').filter({ hasText: 'Lettre ouverte à la mairie' });
	await expect(card).toBeVisible();
	await expect(card.getByText('1 mars 2026')).toBeVisible();

	// Le PDF est servi depuis le site et dessiné page par page (lisible aussi sur Android).
	const pdfRes = await page.request.get(
		(await card.getByRole('link', { name: /nouvel onglet/ }).getAttribute('href'))!
	);
	expect(pdfRes.status()).toBe(200);
	expect(pdfRes.headers()['content-type']).toBe('application/pdf');

	await card.getByRole('button', { name: 'Lire' }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const pages = dialog.locator('canvas');
	await expect(pages).toHaveCount(2);
	await expect(pages.first()).toHaveAttribute('aria-label', /page 1 sur 2/);
	// La page est réellement dessinée : des pixels non blancs existent sur le canvas.
	await expect
		.poll(() =>
			pages.first().evaluate((c: HTMLCanvasElement) => {
				const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
				for (let i = 0; i < data.length; i += 4) if (data[i] < 200) return true;
				return false;
			})
		)
		.toBe(true);
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();

	page.once('dialog', (d) => d.accept());
	await card.getByRole('button', { name: /Supprimer/ }).click();
	await expect(page.getByText('Aucune actualité pour le moment')).toBeVisible();
	expect(await blobKeys()).toEqual([]);
	expect(errors).toEqual([]);
});

test('les erreurs de saisie sont affichées clairement', async ({ page, baseURL }) => {
	await login(page);
	await page.goto('/admin/ajouter-pdf');
	await page.getByLabel('Titre *').fill('Faux PDF');
	await page.getByLabel('Date *').fill('2026-03-01');
	await page.getByLabel('Résumé *').fill('Test');
	await page.getByLabel(/Fichier PDF/).setInputFiles({
		name: 'virus.pdf',
		mimeType: 'application/pdf',
		buffer: Buffer.from('<script>alert(1)</script>')
	});
	await page.getByRole('button', { name: "Publier l'article" }).click();
	await expect(page.getByRole('alert')).toContainText("n'est pas accepté");

	await page.getByLabel(/Fichier PDF/).setInputFiles(PDF_FILE);
	await page.getByLabel(/Lien externe/).fill('javascript:alert(1)');
	// Le champ url du navigateur bloque déjà cette valeur, on vérifie aussi côté serveur.
	const res = await page.request.post('/api/upload-pdf', {
		headers: sameOrigin(baseURL),
		multipart: {
			title: 'x',
			date: '2026-03-01',
			summary: 'x',
			pdf: PDF_FILE,
			link: 'javascript:alert(1)'
		}
	});
	expect(res.status()).toBe(400);
	expect(await blobKeys()).toEqual([]);
});

test('ajouter un événement, l’exporter, puis le supprimer', async ({ page }) => {
	const errors = trackErrors(page);
	await login(page);
	await page.goto('/calendrier');
	await page.getByRole('button', { name: 'Ajouter un événement' }).click();

	await page.getByLabel('Titre *').fill('Assemblée populaire, quartier Tarentaize');
	await page.getByLabel('Type *').selectOption('meeting');
	await page.getByLabel('Date *').fill('2099-06-12');
	await page.getByLabel('Heure *').fill('18:30');
	await page.getByLabel('Durée (heures) *').fill('2');
	await page.getByLabel('Lieu *').fill('Maison de quartier');
	await page.getByLabel('Description *').fill('Ordre du jour : transports et logement.');
	await page.getByRole('button', { name: "Ajouter l'événement" }).click();

	const card = page
		.getByRole('article')
		.filter({ hasText: 'Assemblée populaire, quartier Tarentaize' });
	await expect(card).toBeVisible();
	await expect(card.getByText('vendredi 12 juin 2099')).toBeVisible();
	await expect(card.getByText('18h30 (2 h)')).toBeVisible();

	const download = page.waitForEvent('download');
	await card.getByRole('button', { name: 'Apple / .ics' }).click();
	const file = await download;
	const content = await (await file.createReadStream()).toArray();
	const ics = Buffer.concat(content).toString();
	expect(ics).toContain('DTSTART;TZID=Europe/Paris:20990612T183000');
	expect(ics).toContain('DTEND;TZID=Europe/Paris:20990612T203000');
	expect(ics).toContain('SUMMARY:Assemblée populaire\\, quartier Tarentaize');

	const google = await card.getByRole('link', { name: 'Google' }).getAttribute('href');
	expect(google).toContain('ctz=Europe%2FParis');

	page.once('dialog', (d) => d.accept());
	await card.getByRole('button', { name: /Supprimer/ }).click();
	await expect(page.getByText('Aucun événement prévu pour le moment.')).toBeVisible();
	expect(await blobKeys()).toEqual([]);
	expect(errors).toEqual([]);
});

test('les événements passés sont repliés', async ({ page, baseURL }) => {
	await login(page);
	for (const [title, date] of [
		['Réunion passée', '2020-01-10'],
		['Réunion future', '2099-01-10']
	]) {
		const res = await page.request.post('/api/events', {
			headers: sameOrigin(baseURL),
			multipart: {
				title,
				date,
				time: '19:00',
				duration: '1',
				location: 'Local',
				description: 'x',
				type: 'meeting'
			}
		});
		expect(res.status()).toBe(201);
	}
	await page.goto('/actualites');
	const aside = page.getByRole('complementary', { name: 'Agir avec nous' });
	await expect(aside.getByText('Réunion future')).toBeVisible();
	await expect(aside.getByText('Réunion passée')).toHaveCount(0);

	await page.goto('/calendrier');
	await expect(page.getByText('Réunion future')).toBeVisible();
	await expect(page.getByText('Réunion passée')).toBeHidden();
	await page.getByRole('button', { name: /Voir les événements passés \(1\)/ }).click();
	await expect(page.getByText('Réunion passée')).toBeVisible();
});

test('la déconnexion retire les droits', async ({ page }) => {
	await login(page);
	await openMenuIfMobile(page);
	const loggedOut = page.waitForResponse(
		(r) => r.url().endsWith('/api/login') && r.request().method() === 'DELETE'
	);
	await page.getByRole('button', { name: 'Déconnexion' }).click();
	await loggedOut;
	await page.waitForLoadState('load');
	await openMenuIfMobile(page);
	await expect(page.getByRole('link', { name: 'Écrire' })).toHaveCount(0);
	expect((await (await page.request.get('/api/login')).json()).admin).toBe(false);
	await page.goto('/admin/tutoriel');
	await expect(page).toHaveURL(/\/admin\/login$/);
});
