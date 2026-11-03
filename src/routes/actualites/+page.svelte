<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Article = PageData['articles'][number];

	let preview = $state<{ file: string; title: string } | null>(null);
	let closeButton = $state<HTMLButtonElement>();

	async function deleteArticle(article: Article) {
		if (!confirm(`Supprimer l'article « ${article.title} » ?`)) return;
		const res = await fetch('/api/delete-article', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: article.id })
		});
		if (res.ok) {
			await invalidateAll();
		} else {
			const body = await res.json().catch(() => ({}));
			alert(body.error ?? 'Erreur lors de la suppression.');
		}
	}

	function openPreview(file: string, title: string) {
		preview = { file, title };
		document.body.style.overflow = 'hidden';
		queueMicrotask(() => closeButton?.focus());
	}

	function closePreview() {
		preview = null;
		document.body.style.overflow = '';
	}
</script>

<svelte:head>
	<title>Actualités | Sainte Populaire</title>
</svelte:head>

<svelte:window onkeydown={(e) => preview && e.key === 'Escape' && closePreview()} />

<div class="actus-frama-flex">
	<section class="actualites-section">
		<h1 class="actualites-title">Actualités</h1>
		{#if data.articles.length === 0}
			<p class="empty">Aucune actualité pour le moment. Revenez bientôt !</p>
		{/if}
		<div class="articles-grid">
			{#each data.articles as article (article.id)}
				<article class="article-card">
					<div class="article-card-header">
						<time class="date" datetime={article.date}>{formatDate(article.date)}</time>
						{#if article.type === 'pdf'}
							<span class="pdf-badge">PDF</span>
						{/if}
					</div>
					<h2 class="article-title">{article.title}</h2>
					{#if article.image}
						{#if article.link}
							<a
								href={article.link}
								target="_blank"
								rel="noopener noreferrer"
								class="article-image-link"
							>
								<img class="article-image" src={article.image} alt="" loading="lazy" />
							</a>
						{:else}
							<img class="article-image" src={article.image} alt="" loading="lazy" />
						{/if}
					{/if}
					<p class="summary">{article.summary}</p>
					<div class="article-actions">
						{#if article.type === 'markdown' && article.slug}
							<a class="hero-cta" href={`/actualites/${article.slug}`}>Lire</a>
						{:else if article.type === 'pdf' && article.file}
							{@const file = article.file}
							<button
								class="hero-cta"
								type="button"
								onclick={() => openPreview(file, article.title)}
							>
								Lire
							</button>
							<a
								href={file}
								target="_blank"
								rel="noopener noreferrer"
								class="pdf-ext-link"
								aria-label={`Ouvrir « ${article.title} » dans un nouvel onglet`}>↗</a
							>
						{/if}
						{#if article.link && !article.image}
							<a href={article.link} target="_blank" rel="noopener noreferrer" class="pdf-ext-link"
								>En savoir plus</a
							>
						{/if}
						{#if data.admin}
							<button
								class="delete-btn"
								type="button"
								aria-label={`Supprimer l'article « ${article.title} »`}
								onclick={() => deleteArticle(article)}
							>
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
									<path
										d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M10 11v6M14 11v6"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									/>
									<path
										d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>
	<aside class="framaform-aside">
		<h2 class="discover-title">Soutenir Sainte Populaire</h2>
		<iframe
			src="https://framaforms.org/comite-de-soutien-de-sainte-populaire-municipales-2026-a-saint-etienne-1746463242"
			width="100%"
			height="1200"
			loading="lazy"
			title="Formulaire de soutien (Framaforms)"
		></iframe>
	</aside>
</div>

{#if preview}
	<div class="pdf-modal" role="presentation" onclick={closePreview}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="pdf-modal-content"
			role="dialog"
			aria-modal="true"
			aria-labelledby="pdf-modal-title"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				class="close-btn"
				type="button"
				bind:this={closeButton}
				onclick={closePreview}
				aria-label="Fermer">✕</button
			>
			<h2 id="pdf-modal-title" class="pdf-modal-title">{preview.title}</h2>
			<iframe src={preview.file} title={preview.title}></iframe>
			<div class="pdf-modal-footer">
				<a href={preview.file} target="_blank" rel="noopener noreferrer" class="hero-cta"
					>Ouvrir dans un nouvel onglet</a
				>
			</div>
		</div>
	</div>
{/if}

<style>
	.actualites-title {
		font-size: 1.5rem;
	}
	.empty {
		color: var(--gris-acier);
		margin-top: 2rem;
	}
	.framaform-aside .discover-title {
		font-size: 1.2em;
		margin-bottom: 1.2rem;
	}
	.framaform-aside iframe {
		border: none;
		background: #fff;
		border-radius: 1em;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
	}
	.pdf-modal-title {
		margin: 0 2.5rem 1rem 0;
		font-size: 1.2rem;
	}
	.pdf-modal-footer {
		text-align: center;
		margin-top: 1rem;
	}
	.article-card {
		text-align: left;
	}
	.article-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.article-image {
		width: 100%;
		height: auto;
		border-radius: 0.6rem;
		margin: 0.25rem 0 0.5rem;
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
	}
	.article-image-link {
		display: block;
	}
	.delete-btn {
		margin-left: auto;
		background: transparent;
		border: none;
		padding: 0.25rem;
		color: #c41e3a;
		cursor: pointer;
		border-radius: 6px;
		transition:
			color 0.15s ease,
			transform 0.1s ease,
			background-color 0.15s ease;
	}
	.delete-btn:hover {
		color: #a3132b;
		background-color: rgba(196, 30, 58, 0.08);
	}
	.delete-btn:focus-visible {
		outline: 2px solid #c41e3a;
		outline-offset: 2px;
	}
</style>
