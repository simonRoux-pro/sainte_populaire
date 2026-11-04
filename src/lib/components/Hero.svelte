<script lang="ts">
	import SainteSkyline from './SainteSkyline.svelte';

	/**
	 * heading : le bandeau porte le titre principal de la page.
	 * compact : version plus courte, pour ne pas repousser le contenu (page d'accueil).
	 */
	let { heading = false, compact = false }: { heading?: boolean; compact?: boolean } = $props();
</script>

<section class="hero-bg" class:compact>
	<svelte:element this={heading ? 'h1' : 'p'} class="hero-title"
		>Rejoins le mouvement populaire</svelte:element
	>
	<p class="hero-sub">
		Sainte Populaire, c’est un collectif stéphanois qui lutte pour une société juste, solidaire et
		ancrée dans l’action populaire.
	</p>
	<a class="hero-cta" href="/rejoindre">Nous rejoindre</a>
	<SainteSkyline class="hero-skyline" />
</section>

<style>
	.hero-bg {
		padding-bottom: 0;
		overflow: hidden;
	}
	.hero-bg :global(.hero-skyline) {
		margin: 2.5rem -1.5rem 0;
		width: calc(100% + 3rem);
		min-height: 140px;
	}
	.compact {
		padding-top: 2.5rem;
	}
	.compact :global(.hero-skyline) {
		margin-top: 1.5rem;
	}
	@media (max-width: 768px) {
		.hero-bg :global(.hero-skyline) {
			margin: 2rem -1rem 0;
			width: calc(100% + 2rem);
			min-height: 96px;
		}
		.compact {
			padding-top: 1.8rem;
		}
		.compact :global(.hero-title) {
			font-size: 1.45rem;
			margin-bottom: 1.4rem;
		}
		.compact .hero-sub {
			display: none;
		}
		.compact :global(.hero-skyline) {
			margin-top: 1.2rem;
		}
	}
</style>
