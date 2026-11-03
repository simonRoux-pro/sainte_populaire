<script lang="ts">
	let username = $state('');
	let password = $state('');
	let error = $state('');
	let pending = $state(false);

	async function login(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		pending = true;
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			if (res.ok) {
				window.location.href = '/actualites';
				return;
			}
			const data = await res.json().catch(() => ({}));
			error = data.error || 'Erreur de connexion';
		} catch {
			error = 'Impossible de joindre le serveur.';
		} finally {
			pending = false;
		}
	}
</script>

<svelte:head>
	<title>Connexion | Sainte Populaire</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="actualites-section">
	<h1 class="discover-title">Espace militant</h1>
	<form onsubmit={login} class="pdf-form">
		<div class="form-group">
			<label for="username">Identifiant</label>
			<input id="username" type="text" autocomplete="username" bind:value={username} required />
		</div>
		<div class="form-group">
			<label for="password">Mot de passe</label>
			<input
				id="password"
				type="password"
				autocomplete="current-password"
				bind:value={password}
				required
			/>
		</div>
		<button class="hero-cta" type="submit" disabled={pending}>
			{pending ? 'Connexion...' : 'Connexion'}
		</button>
		{#if error}
			<div class="form-error" role="alert">{error}</div>
		{/if}
	</form>
</section>
