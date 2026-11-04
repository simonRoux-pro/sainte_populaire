import { expect, test, type Page } from '@playwright/test';
import {
	BLOB_URL,
	blobKeys,
	blockExternal,
	login,
	openMenuIfMobile,
	resetBlob,
	trackErrors
} from './helpers';

test.beforeEach(async ({ page }) => {
	await resetBlob();
	await blockExternal(page);
});

const fillForm = async (page: Page, phone = '06 12 34 56 78') => {
	await page.getByLabel('Signal').check();
	await page.getByLabel('Prénom *').fill('Léa');
	await page.getByLabel('Nom', { exact: true }).fill('Martin');
	await page.getByLabel('Numéro de téléphone *').fill(phone);
	await page.getByLabel('Quartier ou commune').fill('Tarentaize');
	await page.getByLabel(/Un mot pour nous/).fill('Dispo le samedi');
	await page.getByLabel(/J'accepte/).check();
};

test('le formulaire est accessible depuis le menu et la page contact', async ({ page }) => {
	await page.goto('/contact');
	await page.getByRole('link', { name: /Demander à être ajouté/ }).click();
	await expect(page).toHaveURL(/\/rejoindre$/);
	await page.goto('/actualites');
	await openMenuIfMobile(page);
	await page.getByRole('navigation').getByRole('link', { name: 'Nous rejoindre' }).click();
	await expect(page.getByRole('heading', { name: 'Nous rejoindre' })).toBeVisible();
});

test('les erreurs sont affichées et la saisie conservée', async ({ page }) => {
	await page.goto('/rejoindre');
	await page.getByLabel('Prénom *').fill('Léa');
	await page.getByLabel('Numéro de téléphone *').fill('123');
	await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
	await expect(page.getByText('Numéro invalide')).toBeVisible();
	await expect(page.getByText('Votre accord est nécessaire')).toBeVisible();
	await expect(page.getByLabel('Prénom *')).toHaveValue('Léa');
	expect(await blobKeys()).toEqual([]);
});

test('une demande est enregistrée chiffrée puis traitée par un admin', async ({ page }) => {
	const errors = trackErrors(page);
	await page.goto('/rejoindre');
	await fillForm(page);
	await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
	await expect(page.getByRole('heading', { name: 'Merci, demande bien reçue !' })).toBeVisible();

	const keys = await blobKeys();
	expect(keys).toHaveLength(1);
	expect(keys[0]).toMatch(/^demandes\/\d{13}-[0-9a-f]{24}\.json$/);
	const raw = await (await fetch(`${BLOB_URL}/files/${keys[0]}`)).text();
	expect(raw).not.toContain('612345678');
	expect(raw).not.toContain('Léa');

	await login(page);
	await page
		.getByRole('navigation', { name: 'Espace militant' })
		.getByRole('link', { name: 'Demandes' })
		.click();
	const item = page.getByRole('listitem').filter({ hasText: 'Léa Martin' });
	await expect(item).toContainText('+33 6 12 34 56 78');
	await expect(item).toContainText('Tarentaize');
	await expect(item).toContainText('Dispo le samedi');
	await expect(item.getByRole('link', { name: 'Ouvrir dans Signal' })).toHaveAttribute(
		'href',
		'https://signal.me/#p/%2B33612345678'
	);

	await item.getByRole('button', { name: 'Marquer comme ajouté' }).click();
	await expect(page.getByText('Aucune demande en attente.')).toBeVisible();
	await page.getByRole('tab', { name: 'Ajoutés (1)' }).click();
	page.once('dialog', (d) => d.accept());
	await page.getByRole('button', { name: 'Supprimer' }).click();
	await expect(page.getByText('Aucune demande traitée.')).toBeVisible();
	expect(await blobKeys()).toEqual([]);
	expect(errors).toEqual([]);
});

test('le lien WhatsApp est correct', async ({ page }) => {
	await page.goto('/rejoindre');
	await fillForm(page, '+33 7 00 00 00 01');
	await page.getByLabel('WhatsApp').check();
	await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
	await expect(page.getByRole('status')).toBeVisible();
	await login(page);
	await page.goto('/admin/demandes');
	await expect(page.getByRole('link', { name: 'Ouvrir dans WhatsApp' })).toHaveAttribute(
		'href',
		'https://wa.me/33700000001'
	);
});

test('le formulaire fonctionne sans JavaScript', async ({ browser, baseURL }) => {
	const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
	const page = await context.newPage();
	await blockExternal(page);
	await page.goto('/rejoindre');
	await fillForm(page);
	await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
	await expect(page.getByRole('heading', { name: 'Merci, demande bien reçue !' })).toBeVisible();
	expect(await blobKeys()).toHaveLength(1);
	await context.close();
});

test('les robots qui remplissent le champ caché sont ignorés', async ({ page }) => {
	await page.goto('/rejoindre');
	await fillForm(page);
	await page.locator('#website').fill('http://spam.example', { force: true });
	await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
	await expect(page.getByRole('status')).toBeVisible();
	expect(await blobKeys()).toEqual([]);
});

test('la liste des demandes est réservée aux admins', async ({ page, context, baseURL }) => {
	await page.goto('/rejoindre');
	await fillForm(page);
	await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
	await expect(page.getByRole('status')).toBeVisible();
	const [key] = await blobKeys();
	const id = key.replace(/^demandes\//, '').replace(/\.json$/, '');

	await context.addCookies([{ name: 'admin', value: '1', url: baseURL! }]);
	await page.goto('/admin/demandes');
	await expect(page).toHaveURL(/\/admin\/login$/);

	for (const action of ['delete', 'done']) {
		const res = await page.request.post(`/admin/demandes?/${action}`, {
			headers: { origin: baseURL!, accept: 'application/json', 'x-sveltekit-action': 'true' },
			form: { id }
		});
		expect(await res.json()).toMatchObject({ type: 'failure', status: 401 });
	}
	expect(await blobKeys()).toEqual([key]);
});
