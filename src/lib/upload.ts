export const MAX_UPLOAD_MB = 4;

/** Vérifie la taille totale avant envoi : Vercel refuse les requêtes de plus de 4,5 Mo. */
export const checkFormSize = (form: FormData): string | null => {
	let total = 0;
	for (const value of form.values()) {
		if (value instanceof File) total += value.size;
	}
	return total > MAX_UPLOAD_MB * 1024 * 1024
		? `Les fichiers dépassent ${MAX_UPLOAD_MB} Mo au total. Compressez le PDF ou l'image avant l'envoi.`
		: null;
};

export const submitForm = async (url: string, form: FormData): Promise<string | null> => {
	const sizeError = checkFormSize(form);
	if (sizeError) return sizeError;
	try {
		const res = await fetch(url, { method: 'POST', body: form });
		if (res.ok) return null;
		if (res.status === 413) return `Fichier trop lourd (${MAX_UPLOAD_MB} Mo maximum).`;
		const body = await res.json().catch(() => ({}));
		return body.error ?? `Erreur ${res.status} lors de l'envoi.`;
	} catch {
		return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
	}
};
