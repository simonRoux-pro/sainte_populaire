import type { RequestHandler } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth';
import fs from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request, cookies }) => {
    if (!isAdmin(cookies)) {
        return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
    }
    const { type, slug, file } = await request.json();

    if (type === 'markdown' && slug) {
        const mdPath = path.resolve('content/articles', `${slug}.md`);
        if (fs.existsSync(mdPath)) fs.unlinkSync(mdPath);
    }
    if (type === 'pdf' && file) {
        const pdfName = file.split('/').pop();
        const pdfPath = path.resolve('static/articles', pdfName);
        const jsonPath = path.resolve('content/articles', pdfName.replace(/\.pdf$/i, '.json'));
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        if (fs.existsSync(jsonPath)) {
            try {
                const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                const image = meta?.image as string | undefined;
                if (image) {
                    const imgName = image.split('/').pop();
                    const imgPath = path.resolve('static/articles', imgName!);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
            } catch {}
            fs.unlinkSync(jsonPath);
        }
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
};