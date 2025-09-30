<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let menuOpen = false;
    let isAdmin = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    onMount(() => {
        // Vérification du statut admin
        fetch('/api/login', { method: 'GET' })
            .then(res => {
                isAdmin = res.ok;
            })
            .catch(err => {
                console.error('Erreur de vérification admin:', err);
            });

        // Gestion du redimensionnement
        const handler = () => {
            if (window.innerWidth > 800) menuOpen = false;
        };
        window.addEventListener('resize', handler);

        // Fonction de nettoyage
        return () => {
            window.removeEventListener('resize', handler);
        };
    });

    // Définition des types pour les liens de navigation
    /**
     * @typedef {Object} NavLink
     * @property {string} label
     * @property {string} [href]
     * @property {NavLink[]} [submenu]
     */
    /** @type {NavLink[]} */
    const links = [
        { href: '/actualites', label: 'Actualités' },
        {
            label: 'Sainte Pop',
            href: '/sainte-pop',
            submenu: [
                { href: '/sainte-pop', label: "C'est quoi ?" },
                { href: '/sainte-pop/organisation', label: "Organisation du mouvement" },
                {
                    label: 'LES PÔLES',
                    // href: '/sainte-pop/poles',
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
        {
            label: 'Programme',
            href: '/programme',
            submenu: [
                { href: '/programme/grandes-thematiques', label: 'Grandes thématiques' },
                { href: '/programme/quizz', label: 'Quizz' }
            ]
        },
        { href: '/agir', label: 'Agir' },
        { href: '/contact', label: 'Contact' }
    ];

    function logout() {
        fetch('/api/login', { method: 'DELETE' })
            .then(() => window.location.href = '/');
    }
</script>

<header>
    <div class="header-content">
        <div class="logo">
            <a href="/"><img src="/images/logo_full.png" alt="Logo Sainte Populaire" /></a>
        </div>
        <button class="menu-burger" on:click={toggleMenu} aria-label="Menu">&#9776;</button>
        <nav class:open={menuOpen}>
            {#each links as link}
                {#if link.submenu}
                    <div class="dropdown">
                        <a
                            href={link.href ?? '#'}
                            class:active={link.href && $page.url.pathname.startsWith(link.href)}
                        >
                            {link.label}
                        </a>
                        <div class="dropdown-content">
                            {#each link.submenu as sub}
                                {#if sub.submenu}
                                    <div class="dropdown-sub">
                                        {#if sub.href}
                                            <a href={sub.href}>{sub.label}</a>
                                        {:else}
                                            <span class="dropdown-title">{sub.label}</span>
                                        {/if}
                                        <div class="dropdown-content-sub">
                                            {#each sub.submenu as subsub}
                                                <a href={subsub.href}>{subsub.label}</a>
                                            {/each}
                                        </div>
                                    </div>
                                {:else}
                                    <a href={sub.href}>{sub.label}</a>
                                {/if}
                            {/each}
                        </div>
                    </div>
                {:else}
                    <a
                        href={link.href}
                        class:active={$page.url.pathname === link.href}
                        aria-current={$page.url.pathname === link.href ? "page" : undefined}
                        on:click={() => (menuOpen = false)}
                    >{link.label}</a>
                {/if}
            {/each}
            {#if isAdmin}
                <a href="/admin/ajouter-pdf" class:active={$page.url.pathname === '/admin/ajouter-pdf'}
                    aria-current={$page.url.pathname === '/admin/ajouter-pdf' ? "page" : undefined}
                    on:click={() => (menuOpen = false)}
                >Écrire</a>
                <a href="/" on:click|preventDefault={logout} class:active={false}>Déconnexion</a>
            {:else}
                <a href="/admin/login" class:active={$page.url.pathname === '/admin/login'}
                    aria-current={$page.url.pathname === '/admin/login' ? "page" : undefined}
                    on:click={() => (menuOpen = false)}
                >Connexion</a>
            {/if}
        </nav>
    </div>
</header>