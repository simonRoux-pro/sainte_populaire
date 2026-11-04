<script lang="ts">
	import { submitForm } from '$lib/upload';

	let { oncreated }: { oncreated?: () => void } = $props();

	let uploading = $state(false);
	let success = $state(false);
	let error = $state('');

	const eventTypes = [
		{ value: 'meeting', label: 'Réunion' },
		{ value: 'action', label: 'Action' },
		{ value: 'workshop', label: 'Atelier' },
		{ value: 'institutional', label: 'Institutionnel' }
	];

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		error = '';
		success = false;
		uploading = true;
		const result = await submitForm('/api/events', new FormData(form));
		uploading = false;
		if (result) {
			error = result;
			return;
		}
		success = true;
		form.reset();
		oncreated?.();
	}
</script>

<section class="add-event-section">
	<h2 class="discover-title">Ajouter un événement</h2>
	<form class="event-form" {onsubmit} autocomplete="off">
		<div class="form-row">
			<div class="form-group">
				<label for="ev-title">Titre *</label>
				<input
					id="ev-title"
					name="title"
					type="text"
					required
					maxlength="200"
					placeholder="Titre de l'événement"
				/>
			</div>
			<div class="form-group">
				<label for="ev-type">Type *</label>
				<select id="ev-type" name="type" required>
					{#each eventTypes as eventType (eventType.value)}
						<option value={eventType.value}>{eventType.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="ev-date">Date *</label>
				<input id="ev-date" name="date" type="date" required />
			</div>
			<div class="form-group">
				<label for="ev-time">Heure *</label>
				<input id="ev-time" name="time" type="time" required />
			</div>
			<div class="form-group">
				<label for="ev-duration">Durée (heures) *</label>
				<input
					id="ev-duration"
					name="duration"
					type="number"
					min="0.5"
					max="72"
					step="0.5"
					value="2"
					required
				/>
			</div>
		</div>

		<div class="form-group">
			<label for="ev-location">Lieu *</label>
			<input
				id="ev-location"
				name="location"
				type="text"
				required
				maxlength="300"
				placeholder="Lieu de l'événement"
			/>
		</div>

		<div class="form-group">
			<label for="ev-description">Description *</label>
			<textarea
				id="ev-description"
				name="description"
				required
				maxlength="3000"
				rows="4"
				placeholder="Description de l'événement"
			></textarea>
		</div>

		<div class="form-group">
			<label for="ev-link">Lien externe (optionnel)</label>
			<input id="ev-link" name="link" type="url" placeholder="https://..." />
		</div>

		<div class="form-group">
			<label for="ev-image">Image (optionnel, 4 Mo max)</label>
			<input
				id="ev-image"
				name="image"
				type="file"
				accept="image/png,image/jpeg,image/webp,image/gif"
			/>
		</div>

		<button type="submit" class="hero-cta" disabled={uploading}>
			{uploading ? 'Envoi en cours...' : "Ajouter l'événement"}
		</button>
		{#if error}
			<div class="form-error" role="alert">{error}</div>
		{/if}
		{#if success}
			<div class="form-success" role="status">Événement ajouté.</div>
		{/if}
	</form>
</section>

<style>
	.add-event-section {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1.5rem;
	}

	.event-form {
		background: var(--blanc);
		border-radius: 1.2rem;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		border: 1px solid rgba(230, 242, 238, 0.5);
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-form label {
		font-family: 'Roboto Condensed', Arial, sans-serif;
		font-weight: bold;
		color: var(--rouge-ouvrier, #c41e3a);
		margin-bottom: 0.2rem;
	}

	.event-form input[type='text'],
	.event-form input[type='date'],
	.event-form input[type='number'],
	.event-form input[type='time'],
	.event-form input[type='url'],
	.event-form select,
	.event-form textarea,
	.event-form input[type='file'] {
		font-family: 'Lora', serif;
		font-size: 1rem;
		padding: 0.6rem;
		border: 1.5px solid var(--gris-acier, #6c757d);
		border-radius: 0.5rem;
		background: #fff;
		color: var(--noir-charbon, #1a1a1a);
	}

	.event-form input[type='file'] {
		padding: 0.3rem;
	}

	.hero-cta {
		margin-top: 1rem;
		align-self: flex-start;
	}

	.form-error {
		color: #c41e3a;
		font-weight: bold;
		margin-top: 0.5rem;
		padding: 0.8rem;
		background: rgba(196, 30, 58, 0.1);
		border-radius: 0.5rem;
		border-left: 4px solid #c41e3a;
	}

	.form-success {
		color: #0b3d2e;
		font-weight: bold;
		margin-top: 0.5rem;
		padding: 0.8rem;
		background: rgba(11, 61, 46, 0.1);
		border-radius: 0.5rem;
		border-left: 4px solid #0b3d2e;
	}

	@media (max-width: 768px) {
		.add-event-section {
			padding: 0 1rem;
		}
		.event-form {
			padding: 1.5rem;
		}
		.form-row {
			grid-template-columns: 1fr;
		}
		.event-form input[type='text'],
		.event-form input[type='date'],
		.event-form input[type='time'],
		.event-form input[type='url'],
		.event-form select,
		.event-form textarea {
			font-size: 16px; /* Prevents zoom on iOS */
		}
	}
</style>
