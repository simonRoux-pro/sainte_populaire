<script>
	import Hero from '$lib/components/Hero.svelte';
</script>

<svelte:head>
	<title>Contact | Sainte Populaire</title>
</svelte:head>

<Hero />

<section class="contact-section">
	<div class="contact-container">
		<h1 class="discover-title">Nous contacter</h1>

		<div class="contact-grid">
			<div class="contact-card">
				<div class="contact-icon">
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
						<polyline points="22,6 12,13 2,6" />
					</svg>
				</div>
				<h3>Email</h3>
				<p>Pour toute question</p>
				<a href="mailto:contact@saintepopulaire.fr" class="contact-link">
					contact@saintepopulaire.fr
				</a>
			</div>

			<div class="contact-card">
				<div class="contact-icon">
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
					</svg>
				</div>
				<h3>Réseaux sociaux</h3>
				<p>Suivez notre actualité</p>
				<div class="social-links">
					<a
						href="https://www.facebook.com/p/Saint%C3%A9-Populaire-61563283078508/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
						</svg>
					</a>
					<a
						href="https://www.instagram.com/saintetiennepopulaire42/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="5" />
							<path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
							<circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none" />
						</svg>
					</a>
					<a
						href="https://x.com/saintepopulaire"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="X (Twitter)"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M4 4l16 16M20 4 4 20" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-section {
		max-width: 1000px;
		margin: 3rem auto;
		padding: 0 1.5rem;
	}

	.contact-container {
		text-align: center;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.contact-card {
		background: var(--blanc);
		border-radius: 1.2rem;
		padding: 2rem 1.5rem;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		border: 1px solid rgba(230, 242, 238, 0.5);
	}

	.contact-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 24px rgba(30, 30, 30, 0.12);
	}

	.contact-icon {
		color: var(--rouge-ouvrier, #c41e3a);
		margin-bottom: 1rem;
	}

	.contact-card h3 {
		font-family: 'Roboto Condensed', Arial, sans-serif;
		font-weight: bold;
		color: var(--rouge-ouvrier, #c41e3a);
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
	}

	.contact-card p {
		color: var(--noir-charbon, #1a1a1a);
		margin: 0 0 1rem 0;
		font-size: 0.95rem;
	}

	.contact-link {
		display: inline-block;
		background: var(--rouge-ouvrier, #c41e3a);
		color: white;
		padding: 0.6rem 1.2rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.contact-link:hover {
		background: var(--vert-hover, #0b3d2e);
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.social-links a {
		color: var(--rouge-ouvrier, #c41e3a);
		transition:
			color 0.2s ease,
			transform 0.1s ease;
	}

	.social-links a:hover {
		color: var(--vert-hover, #0b3d2e);
		transform: translateY(-1px);
	}

	@media (max-width: 768px) {
		.contact-section {
			padding: 0 1rem;
		}
		.contact-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		.contact-card {
			padding: 1.5rem 1rem;
		}
		.contact-card h3 {
			font-size: 1.1rem;
		}
		.contact-link {
			width: 100%;
			text-align: center;
		}
	}
</style>
