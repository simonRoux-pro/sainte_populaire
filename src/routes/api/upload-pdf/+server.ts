import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const summary = formData.get('summary') as string;
    const imageFile = formData.get('image') as File | null;
    const link = (formData.get('link') as string) || '';
    const file = formData.get('pdf') as File;

    if (!title || !date || !summary || !file) {
        return new Response(JSON.stringify({ error: 'Champs manquants' }), { status: 400 });
    }

    // Enregistre le PDF dans static/articles/
    const pdfDir = path.resolve('static/articles');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfFileName = Date.now() + '-' + file.name.replace(/\s+/g, '_');
    const pdfPath = path.join(pdfDir, pdfFileName);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(pdfPath, Buffer.from(arrayBuffer));

    // Optionnel: enregistrer l'image dans static/articles/
    let imagePublicPath: string | undefined = undefined;
    if (imageFile && typeof imageFile !== 'string') {
        const imgDir = path.resolve('static/articles');
        if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
        const imgExt = (imageFile.name.match(/\.[^.]+$/)?.[0] || '').toLowerCase();
        const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
        if (!allowed.includes(imgExt)) {
            return new Response(JSON.stringify({ error: "Format d'image non supporté" }), { status: 400 });
        }
        const imgFileName = Date.now() + '-' + imageFile.name.replace(/\s+/g, '_');
        const imgPath = path.join(imgDir, imgFileName);
        const imgArrayBuffer = await imageFile.arrayBuffer();
        fs.writeFileSync(imgPath, Buffer.from(imgArrayBuffer));
        imagePublicPath = `/articles/${imgFileName}`;
    }

    // Génère le JSON dans content/articles/
    const jsonDir = path.resolve('content/articles');
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
    const jsonData = {
        title,
        date,
        summary,
        file: `/articles/${pdfFileName}`,
        image: imagePublicPath,
        link,
        type: 'pdf'
    };
    const jsonFileName = pdfFileName.replace(/\.pdf$/i, '.json');
    const jsonPath = path.join(jsonDir, jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};