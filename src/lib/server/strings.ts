const stripAccents = (value: string) => value.normalize('NFKD').replace(/[̀-ͯ]/g, '');

export const slugify = (value: string) =>
	stripAccents(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const sanitizeFilename = (name: string, fallback = 'file') => {
	const cleaned = stripAccents(name || '')
		.toLowerCase()
		.replace(/[^a-z0-9.]+/g, '-')
		.replace(/-*\.-*/g, '.')
		.replace(/-+/g, '-')
		.replace(/^[-.]+|[-.]+$/g, '');
	return cleaned || fallback;
};
