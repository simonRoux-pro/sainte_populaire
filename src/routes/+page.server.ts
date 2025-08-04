import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function load() {
	const filePath = path.resolve('content/pages/home.md');
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(fileContent);

	return {
		frontmatter: data,
		content
	};
}
