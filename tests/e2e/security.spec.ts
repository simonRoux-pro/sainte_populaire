import { expect, test } from '@playwright/test';
import { blobKeys, blockExternal, PDF_FILE, resetBlob, sameOrigin } from './helpers';

const FORGED = [
	{ name: 'admin', value: '1' },
	{ name: 'sp_session', value: 'admin.9999999999.signature-inventee' }
];

test.beforeEach(async ({ page }) => {
	await resetBlob();
	await blockExternal(page);
});

for (const cookie of FORGED) {
	test(`un cookie forgé (${cookie.name}=${cookie.value.slice(0, 12)}) ne donne aucun droit`, async ({
		page,
		context,
		baseURL
	}) => {
		await context.addCookies([{ ...cookie, url: baseURL! }]);

		const status = await page.request.get('/api/login');
		expect(await status.json()).toEqual({ admin: false });

		await page.goto('/admin/ajouter-pdf');
		await expect(page).toHaveURL(/\/admin\/login$/);

		const create = await page.request.post('/api/events', {
			headers: sameOrigin(baseURL),
			multipart: {
				title: 'Pirate',
				date: '2030-01-01',
				time: '10:00',
				duration: '1',
				location: 'x',
				description: 'x',
				type: 'action'
			}
		});
		expect(create.status()).toBe(401);

		const upload = await page.request.post('/api/upload-pdf', {
			headers: sameOrigin(baseURL),
			multipart: { title: 'x', date: '2030-01-01', summary: 'x', pdf: PDF_FILE }
		});
		expect(upload.status()).toBe(401);

		const del = await page.request.post('/api/delete-article', { data: { id: '1' } });
		expect(del.status()).toBe(401);

		expect(await blobKeys()).toEqual([]);
	});
}

test('un mauvais mot de passe est refusé', async ({ page }) => {
	await page.goto('/admin/login');
	await page.getByLabel('Identifiant').fill('admin');
	await page.getByLabel('Mot de passe').fill('mauvais');
	await page.getByRole('button', { name: 'Connexion' }).click();
	await expect(page.getByRole('alert')).toHaveText('Identifiants invalides');
	expect((await (await page.request.get('/api/login')).json()).admin).toBe(false);
});

test('un formulaire envoyé depuis un autre site est bloqué (CSRF)', async ({ request }) => {
	const res = await request.post('/api/events', {
		headers: { origin: 'https://site-malveillant.example' },
		multipart: { title: 'x' }
	});
	expect(res.status()).toBe(403);
});
