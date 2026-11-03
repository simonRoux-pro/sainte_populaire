import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const SESSION_COOKIE = 'sp_session';
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

/**
 * Secret utilisé pour signer la session admin.
 * SESSION_SECRET est recommandé. À défaut on dérive du mot de passe admin :
 * changer le mot de passe invalide alors toutes les sessions ouvertes.
 */
const getSecret = (): string | undefined => {
	const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD;
	return secret ? `sainte-pop-session:${secret}` : undefined;
};

const sign = (payload: string, secret: string) =>
	createHmac('sha256', secret).update(payload).digest('base64url');

export const safeEqual = (a: string, b: string): boolean => {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) {
		// Comparaison factice pour garder un temps constant.
		timingSafeEqual(bufA, bufA);
		return false;
	}
	return timingSafeEqual(bufA, bufB);
};

export const createSessionToken = (now = Date.now(), secret = getSecret()): string => {
	if (!secret) throw new Error('Aucun secret de session configuré');
	const expires = Math.floor(now / 1000) + SESSION_DURATION_SECONDS;
	const payload = `admin.${expires}`;
	return `${payload}.${sign(payload, secret)}`;
};

export const verifySessionToken = (
	token: string | undefined,
	now = Date.now(),
	secret = getSecret()
): boolean => {
	if (!token || !secret) return false;
	const parts = token.split('.');
	if (parts.length !== 3 || parts[0] !== 'admin') return false;
	const [, expiresRaw, signature] = parts;
	const expires = Number(expiresRaw);
	if (!Number.isInteger(expires) || expires * 1000 < now) return false;
	return safeEqual(signature, sign(`admin.${expiresRaw}`, secret));
};

export const checkCredentials = (username: unknown, password: unknown): boolean => {
	const expectedUser = env.ADMIN_USERNAME || 'admin';
	const expectedPass = env.ADMIN_PASSWORD;
	if (!expectedPass || typeof username !== 'string' || typeof password !== 'string') return false;
	// Les deux comparaisons sont toujours faites pour ne pas révéler lequel est faux.
	// L'identifiant ignore majuscules et espaces : les claviers de téléphone ajoutent souvent une majuscule.
	const userOk = safeEqual(username.trim().toLowerCase(), expectedUser.trim().toLowerCase());
	const passOk = safeEqual(password, expectedPass);
	return userOk && passOk;
};

export const isAuthConfigured = (): boolean => Boolean(env.ADMIN_PASSWORD);

export const openSession = (cookies: Cookies) => {
	cookies.set(SESSION_COOKIE, createSessionToken(), {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: SESSION_DURATION_SECONDS
	});
};

export const closeSession = (cookies: Cookies) => {
	cookies.delete(SESSION_COOKIE, { path: '/' });
};

export function isAdmin(cookies: Cookies): boolean {
	return verifySessionToken(cookies.get(SESSION_COOKIE));
}
