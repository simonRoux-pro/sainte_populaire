<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Hero from '$lib/components/Hero.svelte';
	import AjouterEvenement from '$lib/components/AjouterEvenement.svelte';
	import { buildIcs, googleCalendarUrl, outlookCalendarUrl } from '$lib/calendar';
	import { formatLongDate, todayInParis } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type CalEvent = PageData['events'][number];

	let showAddForm = $state(false);
	let showPast = $state(false);

	const today = todayInParis();
	const upcoming = $derived(data.events.filter((e) => e.date >= today));
	const past = $derived(data.events.filter((e) => e.date < today).reverse());

	const typeColors: Record<string, string> = {
		meeting: '#c41e3a',
		action: '#1e7a46',
		workshop: '#1d5fc4',
		institutional: '#5a6268'
	};
	const typeLabels: Record<string, string> = {
		meeting: 'Réunion',
		action: 'Action',
		workshop: 'Atelier',
		institutional: 'Institutionnel'
	};

	function downloadIcs(event: CalEvent) {
		const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${event.title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'evenement'}.ics`;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function deleteEvent(event: CalEvent) {
		if (!confirm(`Supprimer l'événement « ${event.title} » ?`)) return;
		const res = await fetch('/api/events', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: event.id })
		});
		if (res.ok) {
			await invalidateAll();
		} else {
			const body = await res.json().catch(() => ({}));
			alert(body.error ?? 'Erreur lors de la suppression.');
		}
	}

	async function onCreated() {
		showAddForm = false;
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Calendrier | Sainte Populaire</title>
	<meta
		name="description"
		content="Les prochaines réunions, actions et ateliers de Sainte Populaire à Saint-Étienne."
	/>
</svelte:head>

{#snippet eventCard(event: CalEvent)}
	<article class="event-card">
		<div class="event-header">
			<span class="event-type" style:background-color={typeColors[event.type] ?? '#c41e3a'}>
				{typeLabels[event.type] ?? 'Événement'}
			</span>
			<time class="event-date" datetime={event.date}>{formatLongDate(event.date)}</time>
		</div>

		<h3 class="event-title">{event.title}</h3>

		{#if event.image}
			<div class="event-image">
				<img src={event.image} alt="" loading="lazy" />
			</div>
		{/if}

		<div class="event-details">
			<div class="event-detail">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<polyline points="12,6 12,12 16,14" />
				</svg>
				<span>{event.time.replace(':', 'h')} ({event.duration} h)</span>
			</div>
			<div class="event-detail">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
					<circle cx="12" cy="10" r="3" />
				</svg>
				<span>{event.location}</span>
			</div>
		</div>

		<p class="event-description">{event.description}</p>

		{#if event.link}
			<div class="event-link">
				<a href={event.link} target="_blank" rel="noopener noreferrer" class="external-link"
					>En savoir plus ↗</a
				>
			</div>
		{/if}

		<div class="event-actions">
			<span class="add-label">Ajouter à mon agenda :</span>
			<a
				href={googleCalendarUrl(event)}
				target="_blank"
				rel="noopener noreferrer"
				class="calendar-btn google">Google</a
			>
			<a
				href={outlookCalendarUrl(event)}
				target="_blank"
				rel="noopener noreferrer"
				class="calendar-btn outlook">Outlook</a
			>
			<button type="button" class="calendar-btn apple" onclick={() => downloadIcs(event)}
				>Apple / .ics</button
			>
			{#if data.admin}
				<button
					class="delete-btn"
					type="button"
					aria-label={`Supprimer l'événement « ${event.title} »`}
					onclick={() => deleteEvent(event)}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M3 6h18" />
						<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
						<path d="M10 11v6M14 11v6" />
						<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
					</svg>
				</button>
			{/if}
		</div>
	</article>
{/snippet}

<Hero />

<section class="calendar-section">
	<div class="calendar-container">
		<h1 class="discover-title">Calendrier des événements</h1>
		<p class="calendar-subtitle">Découvrez nos prochaines actions et rejoignez-nous !</p>

		{#if data.admin}
			<div class="admin-controls">
				<button class="hero-cta" type="button" onclick={() => (showAddForm = !showAddForm)}>
					{showAddForm ? 'Annuler' : 'Ajouter un événement'}
				</button>
			</div>
			{#if showAddForm}
				<AjouterEvenement oncreated={onCreated} />
			{/if}
		{/if}

		{#if upcoming.length === 0}
			<p class="empty">Aucun événement prévu pour le moment.</p>
		{:else}
			<div class="events-grid">
				{#each upcoming as event (event.id)}
					{@render eventCard(event)}
				{/each}
			</div>
		{/if}

		{#if past.length > 0}
			<div class="past-toggle">
				<button
					type="button"
					class="link-like"
					aria-expanded={showPast}
					onclick={() => (showPast = !showPast)}
				>
					{showPast ? 'Masquer' : 'Voir'} les événements passés ({past.length})
				</button>
			</div>
			{#if showPast}
				<div class="events-grid past">
					{#each past as event (event.id)}
						{@render eventCard(event)}
					{/each}
				</div>
			{/if}
		{/if}

		<div class="calendar-footer">
			<p>
				Pour plus d'informations, consultez notre
				<a
					href="https://app.agorakit.org/groups/3288/actions"
					target="_blank"
					rel="noopener noreferrer">agenda complet sur Agorakit</a
				>.
			</p>
		</div>
	</div>
</section>

<style>
	.empty {
		color: var(--gris-acier);
		margin: 2rem 0;
	}
	.add-label {
		width: 100%;
		font-size: 0.85rem;
		color: var(--gris-acier);
	}
	.past-toggle {
		margin-top: 2.5rem;
	}
	.link-like {
		background: none;
		border: none;
		color: var(--rouge-ouvrier);
		font-family: var(--font-title);
		font-size: 1rem;
		cursor: pointer;
		text-decoration: underline;
	}
	.events-grid.past .event-card {
		opacity: 0.75;
	}
	button.calendar-btn {
		cursor: pointer;
		font-family: inherit;
		line-height: inherit;
	}
	.event-header {
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.calendar-section {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1.5rem;
	}

	.calendar-container {
		text-align: center;
	}

	.calendar-subtitle {
		color: var(--noir-charbon, #1a1a1a);
		font-size: 1.1rem;
		margin: 1rem 0 2rem 0;
		opacity: 0.8;
	}

	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.event-card {
		background: var(--blanc);
		border-radius: 1.2rem;
		padding: 2rem;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		text-align: left;
		border: 1px solid rgba(230, 242, 238, 0.5);
	}

	.event-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 24px rgba(30, 30, 30, 0.12);
	}

	.event-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.event-type {
		color: white;
		padding: 0.3rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.event-date {
		color: var(--rouge-ouvrier, #c41e3a);
		font-weight: 600;
		font-size: 0.9rem;
	}

	.event-title {
		font-family: 'Roboto Condensed', Arial, sans-serif;
		font-weight: bold;
		color: var(--rouge-ouvrier, #c41e3a);
		margin: 0 0 1rem 0;
		font-size: 1.3rem;
	}

	.event-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.event-detail {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--noir-charbon, #1a1a1a);
		font-size: 0.9rem;
	}

	.event-detail svg {
		color: var(--rouge-ouvrier, #c41e3a);
		flex-shrink: 0;
	}

	.event-description {
		color: var(--noir-charbon, #1a1a1a);
		line-height: 1.5;
		margin-bottom: 1.5rem;
	}

	.event-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.calendar-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.8rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 500;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.calendar-btn.google {
		background: #4285f4;
		color: white;
	}

	.calendar-btn.google:hover {
		background: #3367d6;
		transform: translateY(-1px);
	}

	.calendar-btn.outlook {
		background: #0078d4;
		color: white;
	}

	.calendar-btn.outlook:hover {
		background: #106ebe;
		transform: translateY(-1px);
	}

	.calendar-btn.apple {
		background: #000;
		color: white;
	}

	.calendar-btn.apple:hover {
		background: #333;
		transform: translateY(-1px);
	}

	.calendar-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(30, 30, 30, 0.1);
	}

	.calendar-footer a {
		color: var(--rouge-ouvrier, #c41e3a);
		text-decoration: none;
		font-weight: 500;
	}

	.calendar-footer a:hover {
		text-decoration: underline;
	}

	.admin-controls {
		margin: 2rem 0;
	}

	.event-image {
		margin: 1rem 0;
		border-radius: 0.8rem;
		overflow: hidden;
	}

	.event-image img {
		width: 100%;
		height: auto;
		max-height: 200px;
		object-fit: cover;
	}

	.event-link {
		margin: 1rem 0;
	}

	.external-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--rouge-ouvrier, #c41e3a);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.external-link:hover {
		color: var(--vert-hover, #0b3d2e);
		text-decoration: underline;
	}

	.delete-btn {
		background: transparent;
		border: none;
		color: #c41e3a;
		cursor: pointer;
		padding: 0.4rem;
		border-radius: 0.4rem;
		transition: all 0.2s ease;
		margin-left: auto;
	}

	.delete-btn:hover {
		background: rgba(196, 30, 58, 0.1);
		color: #a3132b;
	}

	@media (max-width: 768px) {
		.calendar-section {
			padding: 0 1rem;
		}
		.events-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		.event-card {
			padding: 1.5rem;
		}
		.event-title {
			font-size: 1.2rem;
		}
		.event-actions {
			justify-content: center;
			flex-wrap: wrap;
			gap: 0.3rem;
		}
		.calendar-btn {
			font-size: 0.8rem;
			padding: 0.4rem 0.6rem;
		}
		.admin-controls {
			margin: 1.5rem 0;
		}
		.hero-cta {
			width: 100%;
			text-align: center;
		}
	}
</style>
