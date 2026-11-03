import { describe, expect, it } from 'vitest';
import { formatPhone, normalizePhone } from './phone';

describe('numéros de téléphone', () => {
	it.each([
		['06 12 34 56 78', '+33612345678'],
		['06.12.34.56.78', '+33612345678'],
		['0612345678', '+33612345678'],
		['+33 6 12 34 56 78', '+33612345678'],
		['+33 (0)6 12 34 56 78', '+33612345678'],
		['0033612345678', '+33612345678'],
		['+32 470 12 34 56', '+32470123456']
	])('normalise %s', (input, expected) => {
		expect(normalizePhone(input)).toBe(expected);
	});

	it.each(['', '123', '06 12 34', 'bonjour', '+0612345678', '06123456789012345'])(
		'refuse %s',
		(input) => {
			expect(normalizePhone(input)).toBeUndefined();
		}
	);

	it('formate pour la lecture', () => {
		expect(formatPhone('+33612345678')).toBe('+33 6 12 34 56 78');
		expect(formatPhone('+32470123456')).toBe('+32470123456');
	});
});
