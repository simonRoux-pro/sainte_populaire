import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDir = 'content/articles';

export async function load({ params }) {
    const slug = params.slug;
    const filePath = path.join(articlesDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
        return { status: 404 };
    }
    const file = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(file);
    return {
        title: data.title,
        date: data.date,
        summary: data.summary,
        content // markdown brut, à parser côté client
    };
}