import { describe, expect, it } from 'vitest';
import {
	MAX_UPLOAD_BYTES,
	ValidationError,
	clockTime,
	detectFileType,
	durationHours,
	isoDate,
	oneOf,
	optionalFile,
	optionalUrl,
	text
} from './validation';

const form = (entries: Record<string, string | File>) => {
	const f = new FormData();
	for (const [k, v] of Object.entries(entries)) f.append(k, v);
	return f;
};

const PDF_BYTES = new TextEncoder().encode('%PDF-1.7\n...') as Uint8Array<ArrayBuffer>;
const PNG_BYTES: Uint8Array<ArrayBuffer> = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
]);

describe('champs texte', () => {
	it('nettoie les espaces et exige une valeur', () => {
		expect(text(form({ t: '  Bonjour ' }), 't', 'Titre')).toBe('Bonjour');
		expect(() => text(form({ t: '   ' }), 't', 'Titre')).toThrow(ValidationError);
		expect(() => text(form({}), 't', 'Titre')).toThrow(/obligatoire/);
	});

	it('limite la longueur', () => {
		expect(() => text(form({ t: 'x'.repeat(11) }), 't', 'Titre', 10)).toThrow(/dépasse/);
	});
});

describe('dates, heures, durées', () => {
	it('valide les dates AAAA-MM-JJ', () => {
		expect(isoDate(form({ d: '2026-03-15' }), 'd', 'Date')).toBe('2026-03-15');
		expect(() => isoDate(form({ d: '15/03/2026' }), 'd', 'Date')).toThrow();
		expect(() => isoDate(form({ d: '2026-13-45' }), 'd', 'Date')).toThrow();
	});

	it('valide les heures', () => {
		expect(clockTime(form({ h: '09:30' }), 'h', 'Heure')).toBe('09:30');
		expect(() => clockTime(form({ h: '24:00' }), 'h', 'Heure')).toThrow();
		expect(() => clockTime(form({ h: '9h' }), 'h', 'Heure')).toThrow();
	});

	it('accepte les durées décimales avec virgule', () => {
		expect(durationHours(form({ d: '1,5' }), 'd', 'Durée')).toBe('1.5');
		expect(() => durationHours(form({ d: '0' }), 'd', 'Durée')).toThrow();
		expect(() => durationHours(form({ d: 'abc' }), 'd', 'Durée')).toThrow();
	});

	it('restreint le type à la liste autorisée', () => {
		expect(oneOf(form({ t: 'action' }), 't', 'Type', ['action', 'meeting'])).toBe('action');
		expect(() => oneOf(form({ t: 'autre' }), 't', 'Type', ['action'])).toThrow();
	});
});

describe('liens', () => {
	it('accepte http et https, ignore le vide', () => {
		expect(optionalUrl(form({ l: 'https://exemple.fr/page' }), 'l')).toBe(
			'https://exemple.fr/page'
		);
		expect(optionalUrl(form({ l: '' }), 'l')).toBeUndefined();
		expect(optionalUrl(form({}), 'l')).toBeUndefined();
	});

	it('refuse javascript: et les textes qui ne sont pas des liens', () => {
		expect(() => optionalUrl(form({ l: 'javascript:alert(1)' }), 'l')).toThrow();
		expect(() => optionalUrl(form({ l: 'pas un lien' }), 'l')).toThrow();
	});
});

describe('fichiers', () => {
	it('reconnaît le type réel du contenu', () => {
		expect(detectFileType(PDF_BYTES.buffer)).toBe('application/pdf');
		expect(detectFileType(PNG_BYTES.buffer)).toBe('image/png');
		expect(
			detectFileType(new TextEncoder().encode('<html>').buffer as ArrayBuffer)
		).toBeUndefined();
	});

	it('refuse un faux PDF même si le type annoncé est correct', async () => {
		const fake = new File(['<script>alert(1)</script>'], 'doc.pdf', { type: 'application/pdf' });
		await expect(optionalFile(form({ f: fake }), 'f', 'PDF', ['application/pdf'])).rejects.toThrow(
			/format/
		);
	});

	it('accepte un vrai PDF et ignore un champ vide', async () => {
		const pdf = new File([PDF_BYTES], 'doc.pdf', { type: 'application/pdf' });
		const result = await optionalFile(form({ f: pdf }), 'f', 'PDF', ['application/pdf']);
		expect(result?.type).toBe('application/pdf');
		const empty = new File([], '', { type: 'application/octet-stream' });
		expect(await optionalFile(form({ f: empty }), 'f', 'PDF', ['application/pdf'])).toBeUndefined();
	});

	it('refuse les fichiers trop lourds', async () => {
		const big = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], 'gros.pdf');
		await expect(optionalFile(form({ f: big }), 'f', 'PDF', ['application/pdf'])).rejects.toThrow(
			/4 Mo/
		);
	});
});
