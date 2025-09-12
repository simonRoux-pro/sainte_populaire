import type { Cookies } from '@sveltejs/kit';

export function isAdmin(cookies: Cookies) {
    return cookies.get('admin') === '1';
}