import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';
import { MESSAGING_APPS, createJoinRequest, joinRequestsEnabled } from '$lib/server/join-requests';
import { normalizePhone } from '$lib/server/phone';
import { createRateLimiter } from '$lib/server/rate-limit';

// 5 demandes par adresse IP toutes les 10 minutes (réglable pour les tests).
const allow = createRateLimiter(Number(env.JOIN_RATE_LIMIT) || 5, 10 * 60 * 1000);

export const load: PageServerLoad = () => ({ available: joinRequestsEnabled() });

const field = (form: FormData, name: string, max: number) => {
	const value = form.get(name);
	return typeof value === 'string' ? value.trim().slice(0, max) : '';
};

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const form = await request.formData();

		const values = {
			firstName: field(form, 'firstName', 80),
			lastName: field(form, 'lastName', 80),
			phone: field(form, 'phone', 30),
			app: field(form, 'app', 20),
			neighborhood: field(form, 'neighborhood', 120),
			message: field(form, 'message', 1000)
		};

		// Champ invisible : seuls les robots le remplissent. On fait comme si tout allait bien.
		if (field(form, 'website', 200)) return { success: true };

		const errors: Record<string, string> = {};
		if (!values.firstName) errors.firstName = 'Indiquez votre prénom.';
		const phone = normalizePhone(values.phone);
		if (!phone) errors.phone = 'Numéro invalide. Exemple : 06 12 34 56 78.';
		if (!MESSAGING_APPS.includes(values.app as (typeof MESSAGING_APPS)[number])) {
			errors.app = 'Choisissez WhatsApp ou Signal.';
		}
		if (form.get('consent') !== 'on') {
			errors.consent = 'Votre accord est nécessaire pour que nous puissions vous ajouter.';
		}

		if (Object.keys(errors).length > 0) return fail(400, { values, errors });

		if (!allow(getClientAddress())) {
			return fail(429, {
				values,
				errors: { form: 'Trop de demandes envoyées. Réessayez dans quelques minutes.' }
			});
		}

		if (!joinRequestsEnabled()) {
			return fail(503, {
				values,
				errors: { form: 'Le formulaire est momentanément indisponible. Écrivez-nous par email.' }
			});
		}

		try {
			await createJoinRequest({
				firstName: values.firstName,
				lastName: values.lastName || undefined,
				phone: phone!,
				app: values.app as (typeof MESSAGING_APPS)[number],
				neighborhood: values.neighborhood || undefined,
				message: values.message || undefined
			});
		} catch (error) {
			console.error('Enregistrement de la demande impossible', error);
			return fail(500, {
				values,
				errors: { form: 'Une erreur est survenue. Réessayez ou écrivez-nous par email.' }
			});
		}

		return { success: true };
	}
};
