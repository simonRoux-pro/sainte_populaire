<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let filter = $state<'pending' | 'done'>('pending');
	const pending = $derived(data.requests.filter((r) => r.status === 'pending'));
	const done = $derived(data.requests.filter((r) => r.status === 'done'));
	const shown = $derived(filter === 'pending' ? pending : done);

	const when = (iso: string) =>
		new Date(iso).toLocaleString('fr-FR', {
			timeZone: 'Europe/Paris',
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	const appLabel = { whatsapp: 'WhatsApp', signal: 'Signal' } as const;
</script>

<svelte:head>
	<title>Demandes d'ajout | Sainte Populaire</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="requests">
	<h1 class="discover-title">Demandes d'ajout aux groupes</h1>

	{#if !data.configured}
		<div class="warning" role="alert">
			<p>
				Les demandes ne sont pas encore activées. Il manque {data.missing.length > 1
					? 'ces variables'
					: 'cette variable'} dans Vercel :
			</p>
			<ul>
				{#each data.missing as name (name)}<li><code>{name}</code></li>{/each}
			</ul>
			<p>
				Projet sainte_pop → Settings → Environment Variables → ajouter, cocher Production et
				Preview, puis Redeploy.
				{#if data.missing.includes('SESSION_SECRET')}
					Pour <code>SESSION_SECRET</code>, mettre une longue suite de lettres et chiffres au
					hasard, et ne plus la changer ensuite.
				{/if}
			</p>
		</div>
	{:else}
		<div class="tabs" role="tablist">
			<button
				type="button"
				role="tab"
				aria-selected={filter === 'pending'}
				onclick={() => (filter = 'pending')}
			>
				À traiter ({pending.length})
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={filter === 'done'}
				onclick={() => (filter = 'done')}
			>
				Ajoutés ({done.length})
			</button>
		</div>

		{#if shown.length === 0}
			<p class="empty">
				{filter === 'pending' ? 'Aucune demande en attente.' : 'Aucune demande traitée.'}
			</p>
		{/if}

		<ul class="list">
			{#each shown as r (r.id)}
				<li class="item">
					<div class="head">
						<strong class="name">{r.firstName} {r.lastName ?? ''}</strong>
						<span class="badge {r.app}">{appLabel[r.app]}</span>
					</div>
					<div class="meta">
						<a href={`tel:${r.phone}`}>{r.phoneDisplay}</a>
						{#if r.neighborhood}<span>· {r.neighborhood}</span>{/if}
						<span>· reçue le {when(r.createdAt)}</span>
					</div>
					{#if r.message}<p class="message">{r.message}</p>{/if}
					<div class="actions">
						<a class="hero-cta small" href={r.chatUrl} target="_blank" rel="noopener noreferrer">
							Ouvrir dans {appLabel[r.app]}
						</a>
						{#if r.status === 'pending'}
							<form method="POST" action="?/done" use:enhance>
								<input type="hidden" name="id" value={r.id} />
								<button class="secondary" type="submit">Marquer comme ajouté</button>
							</form>
						{/if}
						<form
							method="POST"
							action="?/delete"
							use:enhance={({ cancel }) => {
								if (!confirm(`Supprimer la demande de ${r.firstName} ?`)) cancel();
							}}
						>
							<input type="hidden" name="id" value={r.id} />
							<button class="danger" type="submit">Supprimer</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
		<p class="hint">
			Pensez à supprimer les demandes une fois la personne ajoutée : on ne garde pas les numéros
			plus longtemps que nécessaire.
		</p>
	{/if}
</section>

<style>
	.requests {
		max-width: 760px;
		margin: 3rem auto;
		text-align: left;
	}
	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}
	.tabs button {
		font-family: var(--font-title);
		font-weight: bold;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		border: 1.5px solid var(--gris-acier);
		background: #fff;
		cursor: pointer;
	}
	.tabs button[aria-selected='true'] {
		background: var(--noir-charbon);
		color: #fff;
		border-color: var(--noir-charbon);
	}
	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.item {
		background: var(--blanc-cassé);
		border-radius: 1rem;
		box-shadow: 0 2px 12px rgba(30, 30, 30, 0.07);
		padding: 1.2rem;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	.name {
		font-family: var(--font-title);
		font-size: 1.15rem;
	}
	.badge {
		font-family: var(--font-title);
		font-size: 0.8rem;
		font-weight: bold;
		color: #fff;
		padding: 0.15rem 0.7rem;
		border-radius: 1rem;
	}
	.badge.whatsapp {
		background: #1e7a46;
	}
	.badge.signal {
		background: #2c6bed;
	}
	.meta {
		color: var(--gris-acier);
		font-size: 0.95rem;
		margin-top: 0.3rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.message {
		margin: 0.8rem 0 0;
		font-style: italic;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
		margin-top: 1rem;
	}
	.hero-cta.small {
		margin: 0;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
	}
	.actions button {
		font-family: var(--font-title);
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		cursor: pointer;
		background: #fff;
	}
	.secondary {
		border: 1.5px solid var(--noir-charbon);
	}
	.danger {
		border: 1.5px solid var(--rouge-ouvrier);
		color: var(--rouge-ouvrier);
	}
	.warning {
		padding: 1rem;
		background: #fff3cd;
		border-radius: 0.5rem;
	}
	.empty,
	.hint {
		color: var(--gris-acier);
	}
	.hint {
		margin-top: 2rem;
		font-size: 0.9rem;
	}
</style>
