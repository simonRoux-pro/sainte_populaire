import { describe, expect, it } from 'vitest';
import { open, seal, testKey } from './crypto';

describe('chiffrement des données personnelles', () => {
	const key = testKey('secret-a');

	it('chiffre et déchiffre', () => {
		const data = { phone: '+33612345678', firstName: 'Léa' };
		const sealed = seal(data, key);
		expect(JSON.stringify(sealed)).not.toContain('33612345678');
		expect(JSON.stringify(sealed)).not.toContain('Léa');
		expect(open(sealed, key)).toEqual(data);
	});

	it('produit un résultat différent à chaque fois', () => {
		expect(seal({ a: 1 }, key).data).not.toBe(seal({ a: 1 }, key).data);
	});

	it('refuse une autre clé ou un contenu modifié', () => {
		const sealed = seal({ a: 1 }, key);
		expect(() => open(sealed, testKey('secret-b'))).toThrow();
		const tampered = { ...sealed, data: Buffer.from('{"a":2}').toString('base64') };
		expect(() => open(tampered, key)).toThrow();
	});
});
