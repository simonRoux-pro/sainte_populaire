import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const ADMIN_USER = env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = env.ADMIN_PASSWORD;

export const POST: RequestHandler = async ({ request, cookies }) => {
    if (!ADMIN_PASS) {
        console.error('ADMIN_PASSWORD non configuré dans les variables d\'environnement');
        return new Response(JSON.stringify({ error: 'Configuration serveur invalide' }), { status: 500 });
    }

    const data = await request.json();
    if (data.username === ADMIN_USER && data.password === ADMIN_PASS) {
        cookies.set('admin', '1', { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 8 });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Identifiants invalides' }), { status: 401 });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('admin', { path: '/' });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const GET: RequestHandler = async ({ cookies }) => {
    if (cookies.get('admin') === '1') {
        return new Response(JSON.stringify({ admin: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ admin: false }), { status: 401 });
};