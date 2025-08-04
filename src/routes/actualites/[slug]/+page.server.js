import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const slug = params.slug;
	const fullPath = path.join('content/articles', `${slug}.md`);

	if (!fs.existsSync(fullPath)) {
		throw error(404, 'Article non trouvé');
	}

	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);

	return {
		meta: data,
		content
	};
}
