import { describe, expect, it } from 'vitest';
import {
	SESSION_DURATION_SECONDS,
	createSessionToken,
	safeEqual,
	verifySessionToken
} from './auth';

const SECRET = 'secret-de-test';

describe('session admin', () => {
	it('accepte un jeton valide', () => {
		const token = createSessionToken(Date.now(), SECRET);
		expect(verifySessionToken(token, Date.now(), SECRET)).toBe(true);
	});

	it("refuse l'ancien cookie admin=1", () => {
		expect(verifySessionToken('1', Date.now(), SECRET)).toBe(false);
	});

	it('refuse un jeton signé avec un autre secret', () => {
		const token = createSessionToken(Date.now(), 'autre-secret');
		expect(verifySessionToken(token, Date.now(), SECRET)).toBe(false);
	});

	it("refuse un jeton dont l'expiration a été modifiée", () => {
		const token = createSessionToken(Date.now(), SECRET);
		const [prefix, expires, signature] = token.split('.');
		const forged = `${prefix}.${Number(expires) + 999999}.${signature}`;
		expect(verifySessionToken(forged, Date.now(), SECRET)).toBe(false);
	});

	it('refuse un jeton expiré', () => {
		const issued = Date.now() - (SESSION_DURATION_SECONDS + 60) * 1000;
		const token = createSessionToken(issued, SECRET);
		expect(verifySessionToken(token, Date.now(), SECRET)).toBe(false);
	});

	it('refuse tout quand aucun secret n’est configuré', () => {
		const token = createSessionToken(Date.now(), SECRET);
		expect(verifySessionToken(token, Date.now(), undefined)).toBe(false);
		expect(verifySessionToken(undefined, Date.now(), SECRET)).toBe(false);
	});

	it('compare les chaînes de façon sûre', () => {
		expect(safeEqual('abc', 'abc')).toBe(true);
		expect(safeEqual('abc', 'abd')).toBe(false);
		expect(safeEqual('abc', 'abcd')).toBe(false);
	});
});
