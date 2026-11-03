import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('limiteur', () => {
	it('bloque au-delà du maximum puis relâche après la fenêtre', () => {
		const allow = createRateLimiter(2, 1000);
		expect(allow('ip', 0)).toBe(true);
		expect(allow('ip', 10)).toBe(true);
		expect(allow('ip', 20)).toBe(false);
		expect(allow('autre', 20)).toBe(true);
		expect(allow('ip', 1015)).toBe(true);
	});
});
