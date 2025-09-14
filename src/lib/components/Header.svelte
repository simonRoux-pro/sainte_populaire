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
        
        // // Récupération du chemin courant
        // $page.url.pathname = window.location.pathname;
        
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
     * @property {string} [href]
     * @property {string} label
     * @property {NavLink[]} [submenu]
     */
    /** @type {NavLink[]} */
    const links = [
        { href: '/', label: 'Accueil' },
        { href: '/actualites', label: 'Actualités' },
        {
            label: 'Sainté Pop',
            submenu: [
                { href: '/sainté-pop', label: "C'est quoi ?" },
                { href: '/sainté-pop/organisation', label: "Organisation du mouvement" },
                {
                    label: 'Les pôles',
                    submenu: [
                        { href: '/sainté-pop/poles/pole-1', label: 'Pôle 1' },
                        { href: '/sainté-pop/poles/pole-2', label: 'Pôle 2' }
                        // Ajoute d'autres pôles ici
                    ]
                }
            ]
        },
        {
            label: 'Programme',
            submenu: [
                { href: '/programme/grandes-thematiques', label: 'Grandes thématiques' },
                { href: '/programme/quizz', label: 'Quizz' }
            ]
        },
        { href: '/agir', label: 'Agir' }
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
            <!-- {#each links as link}
                <a
                    href={link.href}
                    class:active={$page.url.pathname === link.href}
                    aria-current={$page.url.pathname === link.href ? "page" : undefined}
                    on:click={() => (menuOpen = false)}
                >{link.label}</a>
            {/each} -->
            {#each links as link}
                {#if link.submenu}
                    <div class="dropdown">
                        <a
                            href={link.href ?? '#'}
                            class:active={
                                link.href && $page.url.pathname === link.href ||
                                (
                                link.submenu &&
                                link.href &&
                                $page.url.pathname.startsWith(link.href) &&
                                link.href !== '/' &&
                                !links.some(l =>
                                    l !== link &&
                                    l.href &&
                                    $page.url.pathname.startsWith(l.href) &&
                                    l.href.length > (link.href ? link.href.length : 0)
                                )
                                )
                            }
                            >
                            {link.label}
                            </a>
                        <div class="dropdown-content">
                            {#each link.submenu as sub}
                                {#if sub.submenu}
                                    <div class="dropdown-sub">
                                        <a href={sub.href ?? '#'}>{sub.label}</a>
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



