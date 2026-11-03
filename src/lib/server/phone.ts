/**
 * Normalise un numéro au format international (E.164).
 * "06 12 34 56 78" devient "+33612345678". Renvoie undefined si le numéro est invalide.
 */
export const normalizePhone = (raw: string): string | undefined => {
	let value = raw.trim().replace(/[\s.\-()]/g, '');
	if (value.startsWith('00')) value = `+${value.slice(2)}`;
	if (/^0[1-9]\d{8}$/.test(value)) value = `+33${value.slice(1)}`;
	if (/^\+330\d{9}$/.test(value)) value = `+33${value.slice(4)}`;
	return /^\+[1-9]\d{7,14}$/.test(value) ? value : undefined;
};

/** Affichage lisible : +33 6 12 34 56 78 pour la France, brut sinon. */
export const formatPhone = (e164: string): string => {
	const fr = /^\+33(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(e164);
	return fr ? `+33 ${fr.slice(1).join(' ')}` : e164;
};
