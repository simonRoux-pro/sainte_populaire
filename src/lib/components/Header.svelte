<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	type NavLink = { label: string; href?: string; submenu?: NavLink[] };

	const links: NavLink[] = [
		{ href: '/actualites', label: 'Actualités' },
		{
			label: 'Sainte Pop',
			href: '/sainte-pop',
			submenu: [
				{ href: '/sainte-pop', label: "C'est quoi ?" },
				{
					label: 'Les pôles',
					submenu: [
						{ href: '/sainte-pop/poles/communication', label: 'Pôle Communication' },
						{ href: '/sainte-pop/poles/relation', label: 'Pôle Relation' },
						{ href: '/sainte-pop/poles/garanties', label: 'Pôle Garanties' },
						{ href: '/sainte-pop/poles/coordination', label: 'Pôle Coordination' },
						{ href: '/sainte-pop/poles/action-vie-militante', label: 'Pôle Action vie militante' }
					]
				}
			]
		},
		{ href: '/programme/grandes-thematiques', label: 'Programme' },
		{ href: '/calendrier', label: 'Calendrier' },
		{ href: '/contact', label: 'Contact' }
	];

	let menuOpen = $state(false);
	const isAdmin = $derived(Boolean(page.data.admin));
	const path = $derived(page.url.pathname);

	const isActive = (href?: string) =>
		Boolean(href) && (path === href || path.startsWith(`${href}/`));

	afterNavigate(() => (menuOpen = false));

	async function logout() {
		await fetch('/api/login', { method: 'DELETE' });
		window.location.href = '/';
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<header>
	<div class="header-content">
		<a class="logo" href="/" aria-label="Accueil Sainte Populaire">
			<img src="/images/logo_full.png" alt="Sainte Populaire" width="160" height="48" />
		</a>
		<button
			class="menu-burger"
			type="button"
			aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
			aria-expanded={menuOpen}
			aria-controls="main-nav"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{menuOpen ? '✕' : '☰'}
		</button>
		<nav id="main-nav" class:open={menuOpen} aria-label="Navigation principale">
			{#each links as link (link.label)}
				{#if link.submenu}
					<div class="dropdown">
						<a href={link.href} class:active={isActive(link.href)} aria-haspopup="true">
							{link.label}
						</a>
						<div class="dropdown-content">
							{#each link.submenu as sub (sub.label)}
								{#if sub.submenu}
									<div class="dropdown-sub">
										<span class="dropdown-title">{sub.label}</span>
										<div class="dropdown-content-sub">
											{#each sub.submenu as subsub (subsub.href)}
												<a
													href={subsub.href}
													aria-current={path === subsub.href ? 'page' : undefined}
												>
													{subsub.label}
												</a>
											{/each}
										</div>
									</div>
								{:else}
									<a href={sub.href} aria-current={path === sub.href ? 'page' : undefined}>
										{sub.label}
									</a>
								{/if}
							{/each}
						</div>
					</div>
				{:else}
					<a
						href={link.href}
						class:active={isActive(link.href)}
						aria-current={path === link.href ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/if}
			{/each}
			{#if isAdmin}
				<a href="/admin/ajouter-pdf" class:active={isActive('/admin/ajouter-pdf')}>Écrire</a>
				<a href="/admin/tutoriel" class:active={isActive('/admin/tutoriel')}>Tutoriel</a>
				<button type="button" class="nav-button" onclick={logout}>Déconnexion</button>
			{/if}
		</nav>
	</div>
</header>
