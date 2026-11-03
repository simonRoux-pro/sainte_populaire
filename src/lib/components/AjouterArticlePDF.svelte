<script lang="ts">
	import { submitForm } from '$lib/upload';

	let uploading = $state(false);
	let success = $state(false);
	let error = $state('');

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		error = '';
		success = false;
		uploading = true;
		const result = await submitForm('/api/upload-pdf', new FormData(form));
		uploading = false;
		if (result) {
			error = result;
			return;
		}
		success = true;
		form.reset();
	}
</script>

<section class="actualites-section">
	<h1 class="discover-title">Ajouter un article PDF</h1>
	<form class="pdf-form" {onsubmit} autocomplete="off">
		<div class="form-group">
			<label for="pdf-title">Titre *</label>
			<input
				id="pdf-title"
				name="title"
				type="text"
				required
				maxlength="200"
				placeholder="Titre de l'article"
			/>
		</div>
		<div class="form-group">
			<label for="pdf-date">Date *</label>
			<input id="pdf-date" name="date" type="date" required />
		</div>
		<div class="form-group">
			<label for="pdf-summary">Résumé *</label>
			<textarea
				id="pdf-summary"
				name="summary"
				required
				maxlength="1000"
				rows="3"
				placeholder="Résumé court"
			></textarea>
		</div>
		<div class="form-group">
			<label for="pdf-file">Fichier PDF * (4 Mo max)</label>
			<input id="pdf-file" name="pdf" type="file" accept="application/pdf" required />
		</div>
		<div class="form-group">
			<label for="pdf-image">Image de couverture (optionnel)</label>
			<input
				id="pdf-image"
				name="image"
				type="file"
				accept="image/png,image/jpeg,image/webp,image/gif"
			/>
		</div>
		<div class="form-group">
			<label for="pdf-link">Lien externe (optionnel)</label>
			<input id="pdf-link" name="link" type="url" placeholder="https://..." />
		</div>
		<button type="submit" class="hero-cta" disabled={uploading}>
			{uploading ? 'Envoi en cours...' : "Publier l'article"}
		</button>
		{#if error}
			<div class="form-error" role="alert">{error}</div>
		{/if}
		{#if success}
			<div class="form-success" role="status">
				Article publié. <a href="/actualites">Voir les actualités</a>
			</div>
		{/if}
	</form>
</section>

<style>
	.pdf-form {
		max-width: 420px;
		margin: 2rem auto;
		background: var(--blanc);
		border-radius: 1.2rem;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		border: 1px solid rgba(230, 242, 238, 0.5);
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.pdf-form label {
		font-family: 'Roboto Condensed', Arial, sans-serif;
		font-weight: bold;
		color: var(--rouge-ouvrier, #c41e3a);
		margin-bottom: 0.2rem;
	}
	.pdf-form input[type='text'],
	.pdf-form input[type='url'],
	.pdf-form input[type='date'],
	.pdf-form textarea,
	.pdf-form input[type='file'] {
		font-family: 'Lora', serif;
		font-size: 1rem;
		padding: 0.5rem;
		border: 1.5px solid var(--gris-acier, #6c757d);
		border-radius: 0.5rem;
		background: #fff;
		color: var(--noir-charbon, #1a1a1a);
	}
	.pdf-form input[type='file'] {
		padding: 0.2rem;
	}
	.hero-cta {
		margin-top: 1rem;
	}
	.form-error {
		color: #c41e3a;
		font-weight: bold;
		margin-top: 0.5rem;
	}
	.form-success {
		color: #0b3d2e;
		font-weight: bold;
		margin-top: 0.5rem;
	}

	@media (max-width: 768px) {
		.pdf-form {
			margin: 1rem auto;
			padding: 1.5rem 1rem;
		}
		.pdf-form input[type='text'],
		.pdf-form input[type='date'],
		.pdf-form textarea,
		.pdf-form input[type='file'] {
			font-size: 16px; /* Prevents zoom on iOS */
		}
	}
</style>
