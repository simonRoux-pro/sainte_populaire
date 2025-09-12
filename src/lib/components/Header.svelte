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
    
    const links = [
        { href: '/', label: 'Accueil' },
        { href: '/a-propos', label: 'À propos' },
        { href: '/actualites', label: 'Actualités' },
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
                <a
                    href={link.href}
                    class:active={$page.url.pathname === link.href}
                    aria-current={$page.url.pathname === link.href ? "page" : undefined}
                    on:click={() => (menuOpen = false)}
                >{link.label}</a>
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



