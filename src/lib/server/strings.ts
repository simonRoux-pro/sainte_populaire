export const slugify = (value: string) =>
	value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const sanitizeFilename = (name: string, fallback = 'file') =>
	(name || fallback)
		.toLowerCase()
		.replace(/[^a-z0-9.]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');

