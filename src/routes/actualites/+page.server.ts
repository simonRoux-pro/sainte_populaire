import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';
import { isAdmin } from '$lib/server/auth';

const articlesDir = 'content/articles';

export const load: PageServerLoad = async ({ cookies }) => {
    // Markdown articles
    const mdFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    const mdArticles = mdFiles.map(filename => {
        const filePath = path.join(articlesDir, filename);
        const file = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(file);
        return {
            type: 'markdown',
            slug: filename.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
            summary: data.summary,
        };
    });

    // PDF articles (JSON metadata)
    const jsonFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
    const pdfArticles = jsonFiles.map(filename => {
        const filePath = path.join(articlesDir, filename);
        const meta = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return {
            type: 'pdf',
            title: meta.title,
            date: meta.date,
            summary: meta.summary,
            file: meta.file,
            image: meta.image,
            link: meta.link
        };
    });

    // Mélange et trie par date décroissante
    const articles = [...mdArticles, ...pdfArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const admin = isAdmin(cookies);

    return { articles, admin };
};