import { describe, expect, it } from 'vitest';
import { sanitizeFilename, slugify } from './strings';

describe('chaînes', () => {
	it('crée des slugs sans accents', () => {
		expect(slugify('Élections municipales : à Saint-Étienne !')).toBe(
			'elections-municipales-a-saint-etienne'
		);
	});

	it('nettoie les noms de fichiers', () => {
		expect(sanitizeFilename('Lettre ouverte à la FI (19-09).pdf')).toBe(
			'lettre-ouverte-a-la-fi-19-09.pdf'
		);
		expect(sanitizeFilename('', 'defaut.pdf')).toBe('defaut.pdf');
	});
});

describe('noms de fichiers dangereux', () => {
	it('empêche de remonter dans les dossiers', () => {
		expect(sanitizeFilename('../../etc/passwd')).toBe('etc-passwd');
		expect(sanitizeFilename('...')).toBe('file');
	});
});
