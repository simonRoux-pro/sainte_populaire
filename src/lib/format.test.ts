import { describe, expect, it } from 'vitest';
import { formatDate, formatLongDate, todayInParis } from './format';

describe('formatage des dates', () => {
	it('affiche les dates en français sans décalage de fuseau', () => {
		expect(formatDate('2025-09-14')).toBe('14 septembre 2025');
		expect(formatLongDate('2026-03-28')).toBe('samedi 28 mars 2026');
	});

	it('renvoie la valeur brute si la date est invalide', () => {
		expect(formatDate('pas une date')).toBe('pas une date');
	});

	it("donne la date du jour à l'heure de Paris", () => {
		// 23h30 UTC le 31 mai = 1h30 le 1er juin à Paris
		expect(todayInParis(new Date('2026-05-31T23:30:00Z'))).toBe('2026-06-01');
	});
});
