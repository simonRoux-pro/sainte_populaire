<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import { SITE } from '$lib/site';

	let { children } = $props();
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>{SITE.name}</title>
	<meta name="description" content={SITE.description} />
	<link rel="canonical" href={`${SITE.url}${page.url.pathname}`} />
	<meta property="og:url" content={`${SITE.url}${page.url.pathname}`} />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={`${SITE.url}/images/logo_full.png`} />
	<meta property="og:locale" content="fr_FR" />
</svelte:head>

<a class="skip-link" href="#contenu">Aller au contenu</a>

<Header />

<main id="contenu" class="main-container">
	{@render children()}
</main>

<footer>
	<div class="footer-contact">
		<h2>Nous contacter</h2>
		<a href={`mailto:${SITE.email}`}>{SITE.email}</a>
	</div>
	<div class="footer-social">
		<a
			class="instagram"
			href={SITE.social.instagram}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Instagram"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="3" y="3" width="18" height="18" rx="5" />
				<path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
				<circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none" />
			</svg>
		</a>
		<a
			class="facebook"
			href={SITE.social.facebook}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Facebook"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
			</svg>
		</a>
		<a
			class="x"
			href={SITE.social.x}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="X (Twitter)"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M4 4l16 16M20 4 4 20" />
			</svg>
		</a>
	</div>
	<div class="mentions">
		&copy; {year} Sainte Populaire<span class="sep">·</span><a href="/mentions-legales"
			>Mentions légales</a
		><span class="sep">·</span><a href="/admin/login" rel="nofollow">Espace militant</a>
	</div>
</footer>

<style>
	.skip-link {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 1000;
		background: #fff;
		color: #000;
		padding: 0.5rem 1rem;
	}
	.skip-link:focus {
		left: 1rem;
		top: 1rem;
	}
	:root {
		--vert: #1a1a1a;
		--vert-hover: #0b3d2e;
		--blanc: #fff;
		--noir: #000;
		--beige: #f5e9dd;
		--vert-fond: #e6f2ee;
		--beige-fond: #f8f6f0;
		--max-width: 1200px;
	}
	:global(body) {
		font-family: 'Montserrat', Arial, sans-serif;
		background: var(--beige-fond);
		color: var(--noir);
	}
	.main-container {
		/* max-width: var(--max-width);
        margin: 0 auto; */
		padding: 0 1.5rem;
		text-align: center;
	}

	@media (max-width: 768px) {
		.main-container {
			padding: 0 1rem;
		}
	}
	footer {
		background: var(--vert);
		color: var(--blanc);
		padding: 2.5rem 1.5rem 1.2rem 1.5rem;
		text-align: center;
		margin-top: 3rem;
		font-family: 'Montserrat', Arial, sans-serif;
	}
	.footer-social {
		margin-top: 1rem;
	}
	.footer-social a {
		--size: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		height: var(--size);
		border-radius: 999px;
		margin: 0 0.45rem;
		color: #fff;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
	}
	.footer-social a:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
	}
	.footer-social a:focus-visible {
		outline: 3px solid #ffffff;
		outline-offset: 3px;
	}

	@media (max-width: 768px) {
		footer {
			padding: 2rem 1rem 1rem 1rem;
		}
		.footer-social a {
			--size: 40px;
			margin: 0 0.3rem;
		}
		.footer-social svg {
			width: 20px;
			height: 20px;
		}
		.footer-contact {
			margin-bottom: 1rem;
			padding-bottom: 1rem;
		}
		.footer-contact h2 {
			font-size: 1rem;
		}
	}

	/* Gradients par réseau, style badges ronds */
	.footer-social a.instagram {
		background: radial-gradient(
			circle at 30% 107%,
			#fdf497 0%,
			#fdf497 5%,
			#fd5949 45%,
			#d6249f 60%,
			#285aeb 90%
		);
	}
	.footer-social a.facebook {
		background: linear-gradient(135deg, #1877f3, #0e5bd8);
	}
	.footer-social a.x {
		background: linear-gradient(135deg, #222, #000);
	}

	.footer-social svg {
		width: 22px;
		height: 22px;
		display: inline-block;
	}
	.footer-contact {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	.footer-contact h2 {
		text-transform: none;
		margin: 0 0 0.8rem 0;
		font-size: 1.1rem;
		color: var(--blanc);
	}
	.footer-contact a {
		color: #e5e5e5;
		text-decoration: none;
		font-size: 1rem;
		transition: color 0.2s;
	}
	.footer-contact a:hover {
		color: var(--blanc);
		text-decoration: underline;
	}
	.mentions {
		margin-top: 1.2rem;
		font-size: 0.95rem;
		color: #e5e5e5;
	}
	.mentions a {
		color: #e5e5e5;
		text-decoration: underline;
	}
	.mentions .sep {
		margin: 0 0.4rem;
	}
</style>
