// Faux serveur Vercel Blob pour les tests de bout en bout.
// Le SDK @vercel/blob l'utilise quand VERCEL_BLOB_API_URL pointe ici.
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

const PORT = Number(process.env.MOCK_BLOB_PORT ?? 4011);
const BASE = `http://localhost:${PORT}`;
const store = new Map();

const readBody = (req) =>
	new Promise((resolve) => {
		const chunks = [];
		req.on('data', (c) => chunks.push(c));
		req.on('end', () => resolve(Buffer.concat(chunks)));
	});

const send = (res, status, data, headers = {}) => {
	res.writeHead(status, { 'content-type': 'application/json', ...headers });
	res.end(typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data));
};

const describe = (pathname, entry) => ({
	url: `${BASE}/files/${pathname}`,
	downloadUrl: `${BASE}/files/${pathname}?download=1`,
	pathname,
	size: entry.body.length,
	uploadedAt: entry.uploadedAt,
	contentType: entry.contentType,
	contentDisposition: 'inline'
});

createServer(async (req, res) => {
	const url = new URL(req.url, BASE);

	if (url.pathname.startsWith('/files/')) {
		const entry = store.get(decodeURIComponent(url.pathname.slice('/files/'.length)));
		if (!entry) return send(res, 404, { error: 'not found' });
		return send(res, 200, entry.body, { 'content-type': entry.contentType });
	}

	if (url.pathname === '/__reset' && req.method === 'POST') {
		store.clear();
		return send(res, 200, { ok: true });
	}

	if (url.pathname === '/__list') {
		return send(res, 200, [...store.keys()].sort());
	}

	if (!req.headers.authorization?.startsWith('Bearer ')) {
		return send(res, 403, { error: { code: 'forbidden', message: 'missing token' } });
	}

	if (req.method === 'PUT') {
		let pathname = url.searchParams.get('pathname');
		if (req.headers['x-add-random-suffix'] === '1') {
			const dot = pathname.lastIndexOf('.');
			const suffix = `-${randomBytes(6).toString('hex')}`;
			pathname =
				dot > pathname.lastIndexOf('/')
					? pathname.slice(0, dot) + suffix + pathname.slice(dot)
					: pathname + suffix;
		}
		const entry = {
			body: await readBody(req),
			contentType: req.headers['x-content-type'] ?? 'application/octet-stream',
			uploadedAt: new Date().toISOString()
		};
		store.set(pathname, entry);
		return send(res, 200, describe(pathname, entry));
	}

	if (req.method === 'GET') {
		const prefix = url.searchParams.get('prefix') ?? '';
		const blobs = [...store.entries()]
			.filter(([p]) => p.startsWith(prefix))
			.map(([p, e]) => describe(p, e));
		return send(res, 200, { blobs, hasMore: false });
	}

	if (req.method === 'POST' && url.pathname === '/delete') {
		const { urls } = JSON.parse((await readBody(req)).toString());
		for (const u of urls) {
			store.delete(u.startsWith(BASE) ? decodeURIComponent(u.slice(`${BASE}/files/`.length)) : u);
		}
		return send(res, 200, {});
	}

	send(res, 404, { error: 'unknown route' });
}).listen(PORT, () => console.log(`mock blob prêt sur ${BASE}`));
