import type { RequestHandler } from '@sveltejs/kit';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'motdepassefort'; // Change ce mot de passe !

export const POST: RequestHandler = async ({ request, cookies }) => {
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