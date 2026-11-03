import { randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { del, list, put } from '@vercel/blob';
import { StorageNotConfiguredError } from './db';
import { encryptionEnabled, open, seal, type Sealed } from './crypto';

export const MESSAGING_APPS = ['whatsapp', 'signal'] as const;
export type MessagingApp = (typeof MESSAGING_APPS)[number];

export type JoinRequest = {
	id: string;
	firstName: string;
	lastName?: string;
	phone: string;
	app: MessagingApp;
	neighborhood?: string;
	message?: string;
	status: 'pending' | 'done';
	createdAt: string;
	handledAt?: string;
};

const PREFIX = 'demandes/';

const token = () => {
	const value = env.BLOB_READ_WRITE_TOKEN;
	if (!value) throw new StorageNotConfiguredError();
	if (!encryptionEnabled()) {
		throw new StorageNotConfiguredError();
	}
	return value;
};

export const joinRequestsEnabled = () => Boolean(env.BLOB_READ_WRITE_TOKEN) && encryptionEnabled();

// L'identifiant contient une partie aléatoire : l'adresse du fichier n'est pas devinable.
const newId = () => `${Date.now()}-${randomBytes(12).toString('hex')}`;
const keyOf = (id: string) => `${PREFIX}${id}.json`;
const isValidId = (id: string) => /^\d{13}-[0-9a-f]{24}$/.test(id);

const write = async (request: JoinRequest) => {
	await put(keyOf(request.id), JSON.stringify(seal(request)), {
		access: 'public',
		addRandomSuffix: false,
		allowOverwrite: true,
		contentType: 'application/json',
		cacheControlMaxAge: 60,
		token: token()
	});
};

export const createJoinRequest = async (
	data: Omit<JoinRequest, 'id' | 'status' | 'createdAt'>
): Promise<JoinRequest> => {
	const request: JoinRequest = {
		...data,
		id: newId(),
		status: 'pending',
		createdAt: new Date().toISOString()
	};
	await write(request);
	return request;
};

export const listJoinRequests = async (): Promise<JoinRequest[]> => {
	const blobToken = token();
	const urls: string[] = [];
	let cursor: string | undefined;
	do {
		const page = await list({ prefix: PREFIX, cursor, token: blobToken });
		urls.push(...page.blobs.filter((b) => b.pathname.endsWith('.json')).map((b) => b.url));
		cursor = page.hasMore ? page.cursor : undefined;
	} while (cursor);

	const items = await Promise.all(
		urls.map(async (url) => {
			try {
				const res = await fetch(url, { cache: 'no-store' });
				return open<JoinRequest>((await res.json()) as Sealed);
			} catch (error) {
				// Clé changée ou fichier abîmé : on ignore plutôt que de bloquer la page.
				console.error('Demande illisible', url, error);
				return undefined;
			}
		})
	);
	return items
		.filter((r): r is JoinRequest => Boolean(r))
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const markJoinRequestDone = async (id: string): Promise<boolean> => {
	if (!isValidId(id)) return false;
	const target = (await listJoinRequests()).find((r) => r.id === id);
	if (!target) return false;
	await write({ ...target, status: 'done', handledAt: new Date().toISOString() });
	return true;
};

export const deleteJoinRequest = async (id: string): Promise<boolean> => {
	if (!isValidId(id)) return false;
	await del(keyOf(id), { token: token() });
	return true;
};
