import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const filePath = path.resolve(`content/pages/${slug}.md`);

	if (!fs.existsSync(filePath)) {
		return {
			status: 404,
			error: new Error('Page not found')
		};
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(fileContent);

	return {
		frontmatter: data,
		content
	};
};
