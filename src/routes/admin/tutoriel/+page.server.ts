import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/auth.js';

export function load({ cookies }) {
    if (!isAdmin(cookies)) {
        throw redirect(302, '/admin/login');
    }
}

