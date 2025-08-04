import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function load() {
	const articlesDir = 'content/articles';
	const files = fs.readdirSync(articlesDir);

	const articles = files
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const fullPath = path.join(articlesDir, file);
			const fileContents = fs.readFileSync(fullPath, 'utf8');
			const { data } = matter(fileContents);

			return {
				slug: file.replace(/\.md$/, ''),
				title: data.title,
				summary: data.summary,
				date: data.date
			};
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	return {
		articles
	};
}
