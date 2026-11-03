/**
 * Les dates sont stockées en "AAAA-MM-JJ". On les formate en UTC pour éviter
 * qu'un visiteur dans un autre fuseau voie la veille.
 */
export const formatDate = (
	iso: string,
	options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string => {
	const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString('fr-FR', { ...options, timeZone: 'UTC' });
};

export const formatLongDate = (iso: string) =>
	formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** Date du jour au format AAAA-MM-JJ, heure de Paris. */
export const todayInParis = (now = new Date()): string =>
	now.toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
