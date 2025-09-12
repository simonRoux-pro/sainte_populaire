<script lang="ts">
    let username = '';
    let password = '';
    let error = '';

    async function login() {
        error = '';
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            window.location.href = '/';
        } else {
            const data = await res.json();
            error = data.error || "Erreur de connexion";
        }
    }
</script>

<section class="actualites-section">
    <h2 class="discover-title">Connexion admin</h2>
    <form on:submit|preventDefault={login} class="pdf-form">
        <div class="form-group">
            <label for="username">Identifiant</label>
            <input id="username" type="text" bind:value={username} required />
        </div>
        <div class="form-group">
            <label for="password">Mot de passe</label>
            <input id="password" type="password" bind:value={password} required />
        </div>
        <button class="hero-cta" type="submit">Connexion</button>
        {#if error}
            <div class="form-error">{error}</div>
        {/if}
    </form>
</section>