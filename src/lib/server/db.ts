import { del, list, put } from '@vercel/blob';
import articlesSeed from '$lib/data/articles.json';
import eventsSeed from '$lib/data/events.json';
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

export type EventRecord = {
	id: number;
	title: string;
	date: string;
	time: string;
	duration: string;
	location: string;
	description: string;
	type: string;
	link?: string;
	image?: string;
	createdAt: string;
	storage?: RecordStorage;
};

const ARTICLES_PREFIX = 'articles';
const EVENTS_PREFIX = 'events';

const hasBlobWriteToken = Boolean(env.BLOB_READ_WRITE_TOKEN);

const fallbackArticles: ArticleRecord[] = (articlesSeed as ArticleRecord[]).map((article) => ({
	...article,
	createdAt: article.createdAt ?? new Date().toISOString(),
	updatedAt: article.updatedAt ?? article.createdAt ?? new Date().toISOString()
}));

const fallbackEvents: EventRecord[] = (eventsSeed as EventRecord[]).map((event) => ({
	...event,
	createdAt: event.createdAt ?? new Date().toISOString()
}));

export class StorageNotConfiguredError extends Error {
	constructor() {
		super('BLOB_READ_WRITE_TOKEN manquant. Configurez Vercel Blob pour activer les écritures.');
	}
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const fetchCollectionFromBlob = async <T>(prefix: string): Promise<T[]> => {
	const records: T[] = [];
	let cursor: string | undefined;

	do {
		const response = await list({ prefix: `${prefix}/`, cursor, token: env.BLOB_READ_WRITE_TOKEN });
		for (const blob of response.blobs) {
			if (!blob.pathname.endsWith('.json')) {
				continue;
			}
			const res = await fetch(blob.downloadUrl ?? blob.url);
			records.push((await res.json()) as T);
		}
		cursor = response.hasMore ? response.cursor : undefined;
	} while (cursor);

	return records;
};

const seedBlobStore = async <T extends { id: string | number }>(
	prefix: string,
	items: T[]
): Promise<void> => {
	if (!hasBlobWriteToken || items.length === 0) return;
	await Promise.all(items.map((item) => persistRecord(prefix, item)));
};

const getCollection = async <T extends { id: string | number }>(
	prefix: string,
	fallback: T[]
): Promise<T[]> => {
	if (!hasBlobWriteToken) {
		return clone(fallback);
	}

	let records = await fetchCollectionFromBlob<T>(prefix);

	if (records.length === 0 && fallback.length > 0) {
		await seedBlobStore(prefix, fallback);
		records = await fetchCollectionFromBlob<T>(prefix);
	}

	return records;
};

const persistRecord = async <T extends { id: string | number; storage?: RecordStorage }>(
	prefix: string,
	record: T
): Promise<T> => {
	if (!hasBlobWriteToken) {
		throw new StorageNotConfiguredError();
	}

	const key = `${prefix}/${record.id}.json`;
	const updatedRecord = {
		...record,
		storage: {
			...record.storage,
			record: key
		}
	};

	await put(key, JSON.stringify(updatedRecord, null, 2), {
		access: 'public',
		addRandomSuffix: false,
		allowOverwrite: true,
		contentType: 'application/json',
		token: env.BLOB_READ_WRITE_TOKEN
	});

	return updatedRecord;
};

const deleteStoredAssets = async (paths: Array<string | undefined>) => {
	if (!hasBlobWriteToken) return;
	const valid = paths.filter(Boolean) as string[];
	if (valid.length === 0) return;
	await del(valid, { token: env.BLOB_READ_WRITE_TOKEN });
};

export const blobWritesEnabled = (): boolean => hasBlobWriteToken;

export const getArticles = async (): Promise<ArticleRecord[]> => {
	const records = await getCollection<ArticleRecord>(ARTICLES_PREFIX, fallbackArticles);
	return records.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
};

export const getArticleBySlug = async (slug: string): Promise<ArticleRecord | undefined> => {
	const articles = await getArticles();
	return articles.find((article) => article.slug === slug);
};

export const saveArticle = async (record: ArticleRecord): Promise<ArticleRecord> =>
	persistRecord<ArticleRecord>(ARTICLES_PREFIX, record);

export const deleteArticleById = async (id: string): Promise<void> => {
	if (!hasBlobWriteToken) throw new StorageNotConfiguredError();
	const articles = await getArticles();
	const target = articles.find((article) => article.id === id);
	if (!target) return;

	await deleteStoredAssets([
		target.storage?.record,
		target.storage?.file,
		target.storage?.image,
		target.storage?.body
	]);
};

export const getEvents = async (): Promise<EventRecord[]> => {
	const records = await getCollection<EventRecord>(EVENTS_PREFIX, fallbackEvents);
	return records.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);
};

export const saveEvent = async (record: EventRecord): Promise<EventRecord> =>
	persistRecord<EventRecord>(EVENTS_PREFIX, record);

export const deleteEventById = async (id: number): Promise<void> => {
	if (!hasBlobWriteToken) throw new StorageNotConfiguredError();
	const events = await getEvents();
	const target = events.find((event) => event.id === id);
	if (!target) return;

	await deleteStoredAssets([target.storage?.record, target.storage?.image]);
};

export type StoredAsset = {
	url: string;
	pathname: string;
};

export const uploadAsset = async (
	key: string,
	body: ArrayBuffer,
	contentType: string
): Promise<StoredAsset> => {
	if (!hasBlobWriteToken) throw new StorageNotConfiguredError();
	const result = await put(key, body, {
		access: 'public',
		addRandomSuffix: false,
		allowOverwrite: true,
		contentType,
		token: env.BLOB_READ_WRITE_TOKEN
	});
	return { url: result.url, pathname: result.pathname };
};

export const deleteAsset = async (pathname?: string): Promise<void> => {
	if (!pathname) return;
	await deleteStoredAssets([pathname]);
};

