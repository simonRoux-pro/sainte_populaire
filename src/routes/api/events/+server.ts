import type { RequestHandler } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth';
import fs from 'fs';
import path from 'path';

const eventsDir = 'content/events';

// Ensure events directory exists
if (!fs.existsSync(eventsDir)) {
    fs.mkdirSync(eventsDir, { recursive: true });
}

export const GET: RequestHandler = async () => {
    try {
        const files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.json'));
        const events = files.map(filename => {
            const filePath = path.join(eventsDir, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return new Response(JSON.stringify(events), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors du chargement des événements' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    if (!isAdmin(cookies)) {
        return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
    }

    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const duration = formData.get('duration') as string;
        const location = formData.get('location') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as string;
        const link = formData.get('link') as string;
        const imageFile = formData.get('image') as File | null;

        if (!title || !date || !time || !duration || !location || !description || !type) {
            return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), { status: 400 });
        }

        // Handle image upload
        let imagePath: string | undefined = undefined;
        if (imageFile && typeof imageFile !== 'string') {
            const imgDir = path.resolve('static/events');
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
            imagePath = `/events/${imgFileName}`;
        }

        // Create event data
        const eventData = {
            id: Date.now(),
            title,
            date,
            time,
            duration,
            location,
            description,
            type,
            link: link || undefined,
            image: imagePath,
            createdAt: new Date().toISOString()
        };

        // Save event to JSON file
        const eventFileName = `${eventData.id}.json`;
        const eventFilePath = path.join(eventsDir, eventFileName);
        fs.writeFileSync(eventFilePath, JSON.stringify(eventData, null, 2), 'utf-8');

        return new Response(JSON.stringify({ success: true, event: eventData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors de la création de l\'événement' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
    if (!isAdmin(cookies)) {
        return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
    }

    try {
        const { id } = await request.json();
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID d\'événement manquant' }), { status: 400 });
        }

        const eventFilePath = path.join(eventsDir, `${id}.json`);
        
        if (fs.existsSync(eventFilePath)) {
            // Read event data to get image path
            const eventData = JSON.parse(fs.readFileSync(eventFilePath, 'utf-8'));
            
            // Delete image file if exists
            if (eventData.image) {
                const imgName = eventData.image.split('/').pop();
                const imgPath = path.resolve('static/events', imgName!);
                if (fs.existsSync(imgPath)) {
                    fs.unlinkSync(imgPath);
                }
            }
            
            // Delete event file
            fs.unlinkSync(eventFilePath);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors de la suppression de l\'événement' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
