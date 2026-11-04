/**
 * Les fonctions Vercel refusent les requêtes de plus de 4,5 Mo.
 * On garde une marge pour les autres champs du formulaire.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const IMAGE_TYPES: Record<string, string> = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
	'image/gif': 'gif'
};

export class ValidationError extends Error {}

export const text = (form: FormData, name: string, label: string, max = 300): string => {
	const value = form.get(name);
	const trimmed = typeof value === 'string' ? value.trim() : '';
	if (!trimmed) throw new ValidationError(`Le champ « ${label} » est obligatoire.`);
	if (trimmed.length > max) {
		throw new ValidationError(`Le champ « ${label} » dépasse ${max} caractères.`);
	}
	return trimmed;
};

export const isoDate = (form: FormData, name: string, label: string): string => {
	const value = text(form, name, label, 10);
	const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
	if (!valid) throw new ValidationError(`Le champ « ${label} » doit être une date valide.`);
	return value;
};

export const clockTime = (form: FormData, name: string, label: string): string => {
	const value = text(form, name, label, 5);
	if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
		throw new ValidationError(`Le champ « ${label} » doit être une heure valide (HH:MM).`);
	}
	return value;
};

export const durationHours = (form: FormData, name: string, label: string): string => {
	const value = text(form, name, label, 5).replace(',', '.');
	const hours = Number(value);
	if (!Number.isFinite(hours) || hours <= 0 || hours > 72) {
		throw new ValidationError(`Le champ « ${label} » doit être un nombre d'heures entre 0 et 72.`);
	}
	return String(hours);
};

export const oneOf = <T extends string>(
	form: FormData,
	name: string,
	label: string,
	allowed: readonly T[]
): T => {
	const value = text(form, name, label, 50);
	if (!allowed.includes(value as T))
		throw new ValidationError(`Valeur invalide pour « ${label} ».`);
	return value as T;
};

/** Lien optionnel : seuls http et https sont acceptés (pas de javascript:). */
export const optionalUrl = (form: FormData, name: string): string | undefined => {
	const value = form.get(name);
	if (typeof value !== 'string' || !value.trim()) return undefined;
	let url: URL;
	try {
		url = new URL(value.trim());
	} catch {
		throw new ValidationError("Le lien n'est pas une adresse valide.");
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		throw new ValidationError('Le lien doit commencer par http:// ou https://.');
	}
	return url.toString();
};

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
	signature.every((byte, i) => bytes[offset + i] === byte);

/** Vérifie le contenu réel du fichier, pas seulement le type annoncé par le navigateur. */
export const detectFileType = (buffer: ArrayBuffer): string | undefined => {
	const bytes = new Uint8Array(buffer.slice(0, 16));
	if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf';
	if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47])) return 'image/png';
	if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
	if (startsWith(bytes, [0x47, 0x49, 0x46, 0x38])) return 'image/gif';
	if (
		startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
		startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
	) {
		return 'image/webp';
	}
	return undefined;
};

export type CheckedFile = { buffer: ArrayBuffer; type: string; name: string };

export const optionalFile = async (
	form: FormData,
	name: string,
	label: string,
	accepted: string[]
): Promise<CheckedFile | undefined> => {
	const value = form.get(name);
	if (!(value instanceof File) || value.size === 0) return undefined;
	if (value.size > MAX_UPLOAD_BYTES) {
		throw new ValidationError(`Le fichier « ${label} » dépasse 4 Mo.`);
	}
	const buffer = await value.arrayBuffer();
	const type = detectFileType(buffer);
	if (!type || !accepted.includes(type)) {
		throw new ValidationError(`Le format du fichier « ${label} » n'est pas accepté.`);
	}
	return { buffer, type, name: value.name };
};

export const requiredFile = async (
	form: FormData,
	name: string,
	label: string,
	accepted: string[]
): Promise<CheckedFile> => {
	const file = await optionalFile(form, name, label, accepted);
	if (!file) throw new ValidationError(`Le fichier « ${label} » est obligatoire.`);
	return file;
};
