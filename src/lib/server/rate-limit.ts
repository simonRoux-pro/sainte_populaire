/**
 * Limiteur simple en mémoire. Sur Vercel chaque instance a sa propre mémoire,
 * c'est donc un frein contre les envois en rafale, pas une garantie absolue.
 */
export const createRateLimiter = (max: number, windowMs: number) => {
	const hits = new Map<string, number[]>();
	return (key: string, now = Date.now()): boolean => {
		const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
		if (recent.length >= max) {
			hits.set(key, recent);
			return false;
		}
		recent.push(now);
		hits.set(key, recent);
		if (hits.size > 5000) hits.clear();
		return true;
	};
};
