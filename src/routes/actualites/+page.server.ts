import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Article = {
    slug: string;
    title: string;
    summary: string;
    date: string;
};

export async function load(): Promise<{ articles: Article[] }> {
    const articlesDir = 'content/articles';
    const files = fs.readdirSync(articlesDir);

    const articles: Article[] = files
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
            const fullPath = path.join(articlesDir, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug: file.replace(/\.md$/, ''),
                title: data.title as string,
                summary: data.summary as string,
                date: data.date as string
            };
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime() || 0;
            const dateB = new Date(b.date).getTime() || 0;
            return dateB - dateA;
        });

    return {
        articles
    };
}