<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let sending = $state(false);
	const values = $derived(form && 'values' in form ? form.values : undefined);
	const errors = $derived(
		((form && 'errors' in form ? form.errors : undefined) ?? {}) as Record<string, string>
	);
</script>

<svelte:head>
	<title>Nous rejoindre | Sainte Populaire</title>
	<meta
		name="description"
		content="Rejoignez les groupes WhatsApp ou Signal de Sainte Populaire pour suivre les actions et réunions à Saint-Étienne."
	/>
</svelte:head>

<section class="join">
	<h1 class="discover-title">Nous rejoindre</h1>
	<p class="intro">
		Laissez-nous votre numéro et nous vous ajouterons au groupe de discussion de Sainte Populaire,
		sur la messagerie de votre choix. Vous y recevrez les infos sur les réunions, les actions et la
		vie du mouvement.
	</p>

	{#if form && 'success' in form && form.success}
		<div class="done" role="status">
			<h2>Merci, demande bien reçue !</h2>
			<p>Un ou une militante vous ajoutera au groupe dans les prochains jours.</p>
			<a class="hero-cta" href="/calendrier">Voir les prochains événements</a>
		</div>
	{:else if !data.available}
		<p class="unavailable" role="alert">
			Le formulaire est momentanément indisponible. Écrivez-nous à
			<a href="mailto:contact@saintepopulaire.fr">contact@saintepopulaire.fr</a>.
		</p>
	{:else}
		<form
			method="POST"
			class="join-form"
			novalidate
			use:enhance={() => {
				sending = true;
				return async ({ update }) => {
					await update({ reset: false });
					sending = false;
				};
			}}
		>
			<fieldset class="apps">
				<legend>Sur quelle messagerie ? *</legend>
				<label class="app-choice">
					<input
						type="radio"
						name="app"
						value="whatsapp"
						checked={(values?.app ?? 'whatsapp') === 'whatsapp'}
					/>
					<span>WhatsApp</span>
				</label>
				<label class="app-choice">
					<input type="radio" name="app" value="signal" checked={values?.app === 'signal'} />
					<span>Signal</span>
				</label>
				{#if errors.app}<p class="field-error">{errors.app}</p>{/if}
			</fieldset>

			<div class="row">
				<div class="form-group">
					<label for="firstName">Prénom *</label>
					<input
						id="firstName"
						name="firstName"
						autocomplete="given-name"
						maxlength="80"
						value={values?.firstName ?? ''}
						aria-invalid={Boolean(errors.firstName)}
						aria-describedby={errors.firstName ? 'firstName-error' : undefined}
						required
					/>
					{#if errors.firstName}<p id="firstName-error" class="field-error">
							{errors.firstName}
						</p>{/if}
				</div>
				<div class="form-group">
					<label for="lastName">Nom</label>
					<input
						id="lastName"
						name="lastName"
						autocomplete="family-name"
						maxlength="80"
						value={values?.lastName ?? ''}
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="phone">Numéro de téléphone *</label>
				<input
					id="phone"
					name="phone"
					type="tel"
					inputmode="tel"
					autocomplete="tel"
					placeholder="06 12 34 56 78"
					maxlength="30"
					value={values?.phone ?? ''}
					aria-invalid={Boolean(errors.phone)}
					aria-describedby={errors.phone ? 'phone-error' : undefined}
					required
				/>
				{#if errors.phone}<p id="phone-error" class="field-error">{errors.phone}</p>{/if}
			</div>

			<div class="form-group">
				<label for="neighborhood">Quartier ou commune</label>
				<input
					id="neighborhood"
					name="neighborhood"
					maxlength="120"
					placeholder="Ex. Tarentaize, Montreynaud..."
					value={values?.neighborhood ?? ''}
				/>
			</div>

			<div class="form-group">
				<label for="message">Un mot pour nous (facultatif)</label>
				<textarea id="message" name="message" rows="3" maxlength="1000"
					>{values?.message ?? ''}</textarea
				>
			</div>

			<div class="hp" aria-hidden="true">
				<label for="website">Ne pas remplir</label>
				<input id="website" name="website" tabindex="-1" autocomplete="off" />
			</div>

			<label class="consent">
				<input
					type="checkbox"
					name="consent"
					aria-describedby={errors.consent ? 'consent-error' : undefined}
				/>
				<span>
					J'accepte que Sainte Populaire utilise mon numéro pour m'ajouter à son groupe de
					discussion. Ma demande est supprimée une fois traitée. *
				</span>
			</label>
			{#if errors.consent}<p id="consent-error" class="field-error">{errors.consent}</p>{/if}

			<button class="hero-cta" type="submit" disabled={sending}>
				{sending ? 'Envoi...' : 'Envoyer ma demande'}
			</button>
			{#if errors.form}<p class="form-error" role="alert">{errors.form}</p>{/if}
		</form>
	{/if}
</section>

<style>
	.join {
		max-width: 640px;
		margin: 3rem auto;
		text-align: left;
	}
	.intro {
		margin-bottom: 2rem;
	}
	.join-form,
	.done {
		background: var(--blanc-cassé);
		border-radius: 1.2rem;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}
	.done {
		text-align: center;
		align-items: center;
	}
	.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
		gap: 1.2rem;
	}
	label,
	legend {
		font-family: var(--font-title);
		font-weight: bold;
		color: var(--rouge-ouvrier);
	}
	input:not([type='radio']):not([type='checkbox']),
	textarea {
		font-family: var(--font-body);
		font-size: 16px;
		padding: 0.6rem;
		border: 1.5px solid var(--gris-acier);
		border-radius: 0.5rem;
		background: #fff;
	}
	input[aria-invalid='true'] {
		border-color: var(--rouge-ouvrier);
	}
	.apps {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}
	.apps legend {
		margin-bottom: 0.6rem;
	}
	.app-choice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.2rem;
		border: 1.5px solid var(--gris-acier);
		border-radius: 2rem;
		background: #fff;
		color: var(--noir-charbon);
		cursor: pointer;
	}
	.app-choice:has(input:checked) {
		border-color: var(--rouge-ouvrier);
		background: #f9e8eb;
	}
	.consent {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
		font-family: var(--font-body);
		font-weight: normal;
		color: var(--noir-charbon);
		font-size: 0.95rem;
	}
	.consent input {
		margin-top: 0.35rem;
		width: 1.1rem;
		height: 1.1rem;
		flex-shrink: 0;
	}
	.field-error {
		color: var(--rouge-ouvrier);
		font-size: 0.9rem;
		margin: 0;
		width: 100%;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.unavailable {
		padding: 1rem;
		background: #fff3cd;
		border-radius: 0.5rem;
	}
	button.hero-cta {
		align-self: flex-start;
	}
</style>
