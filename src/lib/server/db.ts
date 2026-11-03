import { del, list, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';

type RecordStorage = {
	record?: string;
	file?: string;
	image?: string;
	body?: string;
};

export type ArticleRecord = {
	id: string;
	type: 'markdown' | 'pdf';
	title: string;
	date: string;
	summary: string;
	slug?: string;
	body?: string;
	file?: string;
	image?: string;
	link?: string;
	createdAt: string;
	updatedAt: string;
	storage?: RecordStorage;
};

export const EVENT_TYPES = ['meeting', 'action', 'workshop', 'institutional'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export type EventRecord = {
	id: number;
	title: string;
	date: string;
	time: string;
	duration: string;
	location: string;
	description: string;
	type: EventType | string;
	link?: string;
	image?: string;
	createdAt: string;
	storage?: RecordStorage;
};

const ARTICLES_PREFIX = 'articles';
const EVENTS_PREFIX = 'events';

const token = () => env.BLOB_READ_WRITE_TOKEN;

export class StorageNotConfiguredError extends Error {
	constructor() {
		super('Stockage non configuré (BLOB_READ_WRITE_TOKEN manquant).');
	}
}

const requireToken = (): string => {
	const value = token();
	if (!value) throw new StorageNotConfiguredError();
	return value;
};

export const blobWritesEnabled = (): boolean => Boolean(token());

const recordKey = (prefix: string, id: string | number) => `${prefix}/${id}.json`;

const fetchCollection = async <T>(prefix: string): Promise<T[]> => {
	const blobToken = token();
	if (!blobToken) return [];

	const urls: string[] = [];
	let cursor: string | undefined;
	do {
		const response = await list({ prefix: `${prefix}/`, cursor, token: blobToken });
		for (const blob of response.blobs) {
			// Les fichiers joints (PDF, images) sont dans des sous-dossiers, seuls les JSON
			// à la racine du préfixe sont des enregistrements.
			if (
				blob.pathname.endsWith('.json') &&
				!blob.pathname.slice(prefix.length + 1).includes('/')
			) {
				urls.push(blob.url);
			}
		}
		cursor = response.hasMore ? response.cursor : undefined;
	} while (cursor);

	const records = await Promise.all(
		urls.map(async (url) => {
			try {
				const res = await fetch(url, { cache: 'no-store' });
				if (!res.ok) return undefined;
				return (await res.json()) as T;
			} catch (error) {
				console.error('Enregistrement illisible', url, error);
				return undefined;
			}
		})
	);
	return records.filter((record): record is Awaited<T> => record !== undefined) as T[];
};

const persistRecord = async <T extends { id: string | number; storage?: RecordStorage }>(
	prefix: string,
	record: T
): Promise<T> => {
	const blobToken = requireToken();
	const key = recordKey(prefix, record.id);
	const stored = { ...record, storage: { ...record.storage, record: key } };

	await put(key, JSON.stringify(stored, null, 2), {
		access: 'public',
		addRandomSuffix: false,
		allowOverwrite: true,
		contentType: 'application/json',
		cacheControlMaxAge: 60,
		token: blobToken
	});

	return stored;
};

const deleteBlobs = async (paths: Array<string | undefined>) => {
	const valid = [...new Set(paths.filter((p): p is string => Boolean(p)))];
	if (valid.length === 0) return;
	await del(valid, { token: requireToken() });
};

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);
const byDateAsc = (a: { date: string; time?: string }, b: { date: string; time?: string }) =>
	`${a.date}T${a.time ?? ''}`.localeCompare(`${b.date}T${b.time ?? ''}`);

export const getArticles = async (): Promise<ArticleRecord[]> =>
	(await fetchCollection<ArticleRecord>(ARTICLES_PREFIX)).sort(byDateDesc);

export const getArticleBySlug = async (slug: string): Promise<ArticleRecord | undefined> =>
	(await getArticles()).find((article) => article.slug === slug);

export const saveArticle = (record: ArticleRecord) => persistRecord(ARTICLES_PREFIX, record);

export const deleteArticleById = async (id: string): Promise<boolean> => {
	requireToken();
	const target = (await getArticles()).find((article) => article.id === id);
	if (!target) return false;
	await deleteBlobs([
		target.storage?.record ?? recordKey(ARTICLES_PREFIX, target.id),
		target.storage?.file,
		target.storage?.image,
		target.storage?.body
	]);
	return true;
};

export const getEvents = async (): Promise<EventRecord[]> =>
	(await fetchCollection<EventRecord>(EVENTS_PREFIX)).sort(byDateAsc);

export const saveEvent = (record: EventRecord) => persistRecord(EVENTS_PREFIX, record);

export const deleteEventById = async (id: number): Promise<boolean> => {
	requireToken();
	const target = (await getEvents()).find((event) => event.id === id);
	if (!target) return false;
	await deleteBlobs([
		target.storage?.record ?? recordKey(EVENTS_PREFIX, target.id),
		target.storage?.image
	]);
	return true;
};

export type StoredAsset = { url: string; pathname: string };

export const uploadAsset = async (
	key: string,
	body: ArrayBuffer,
	contentType: string
): Promise<StoredAsset> => {
	const result = await put(key, body, {
		access: 'public',
		addRandomSuffix: true,
		contentType,
		token: requireToken()
	});
	return { url: result.url, pathname: result.pathname };
};

export const deleteAssets = async (pathnames: Array<string | undefined>) => {
	try {
		await deleteBlobs(pathnames);
	} catch (error) {
		console.error('Nettoyage des fichiers impossible', error);
	}
};
