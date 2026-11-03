import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';

export type Sealed = { v: 1; iv: string; tag: string; data: string };

const keyFrom = (secret: string) =>
	createHash('sha256').update(`sainte-pop-data:${secret}`).digest();

/** Clé de chiffrement des données personnelles, dérivée de SESSION_SECRET. */
const dataKey = (): Buffer | undefined =>
	env.SESSION_SECRET ? keyFrom(env.SESSION_SECRET) : undefined;

export const encryptionEnabled = (): boolean => Boolean(dataKey());

export const seal = (value: unknown, key = dataKey()): Sealed => {
	if (!key) throw new Error('SESSION_SECRET manquant');
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const data = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
	return {
		v: 1,
		iv: iv.toString('base64'),
		tag: cipher.getAuthTag().toString('base64'),
		data: data.toString('base64')
	};
};

export const open = <T>(sealed: Sealed, key = dataKey()): T => {
	if (!key) throw new Error('SESSION_SECRET manquant');
	const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(sealed.iv, 'base64'));
	decipher.setAuthTag(Buffer.from(sealed.tag, 'base64'));
	const plain = Buffer.concat([
		decipher.update(Buffer.from(sealed.data, 'base64')),
		decipher.final()
	]);
	return JSON.parse(plain.toString('utf8')) as T;
};

export const testKey = (secret: string) => keyFrom(secret);
