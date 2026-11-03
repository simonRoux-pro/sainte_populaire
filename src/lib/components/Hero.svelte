<script lang="ts">
	/** heading=true quand le bandeau porte le titre principal de la page. */
	import { SITE } from '$lib/site';

	let { heading = false }: { heading?: boolean } = $props();
</script>

<section class="hero-bg">
	<svelte:element this={heading ? 'h1' : 'p'} class="hero-title"
		>Rejoins le mouvement populaire</svelte:element
	>
	<p class="hero-sub">
		Sainte Populaire, c’est un collectif qui lutte pour une société juste, solidaire et ancrée dans
		l’action populaire.
	</p>
	<a class="hero-cta" href={SITE.supportFormUrl} target="_blank" rel="noopener noreferrer">
		Nous soutenir
	</a>
</section>
