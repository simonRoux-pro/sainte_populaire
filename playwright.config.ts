import { defineConfig, devices } from '@playwright/test';

const BLOB_PORT = 4011;
const APP_PORT = 4173;

export const ADMIN = { username: 'admin', password: 'mot-de-passe-de-test' };
export const BLOB_URL = `http://localhost:${BLOB_PORT}`;

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: false,
	workers: 1,
	reporter: 'list',
	use: {
		baseURL: `http://localhost:${APP_PORT}`
	},
	projects: [
		{ name: 'desktop', use: { viewport: { width: 1366, height: 900 } } },
		{ name: 'mobile', use: { ...devices['Pixel 7'] } }
	],
	webServer: [
		{
			command: 'node tests/e2e/mock-blob-server.mjs',
			url: `${BLOB_URL}/__list`,
			env: { MOCK_BLOB_PORT: String(BLOB_PORT) },
			reuseExistingServer: false
		},
		{
			command: `npm run build && npx vite preview --port ${APP_PORT} --strictPort`,
			url: `http://localhost:${APP_PORT}/actualites`,
			timeout: 180_000,
			reuseExistingServer: false,
			env: {
				ADMIN_USERNAME: ADMIN.username,
				ADMIN_PASSWORD: ADMIN.password,
				SESSION_SECRET: 'secret-e2e',
				BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_test_token',
				VERCEL_BLOB_API_URL: BLOB_URL,
				VERCEL_BLOB_RETRIES: '0',
				JOIN_RATE_LIMIT: '1000'
			}
		}
	]
});
