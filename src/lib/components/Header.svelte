<script>
    import { onMount } from 'svelte';
    let menuOpen = false;
    function toggleMenu() {
        menuOpen = !menuOpen;
    }
    onMount(() => {
        const handler = () => {
            if (window.innerWidth > 800) menuOpen = false;
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    });
    let currentPath = '';
    onMount(() => {
        currentPath = window.location.pathname;
    });
    const links = [
        { href: '/', label: 'Accueil' },
        { href: '/a-propos', label: 'À propos' },
        { href: '/actualites', label: 'Actualités' },
        { href: '/contact', label: 'Contact' }
    ];
</script>

<style>
    header {
        position: sticky;
        top: 0;
        z-index: 50;
        background: #1a1a1a;
        font-family: 'Roboto Condensed', Arial, sans-serif;
        border-bottom: 3px solid #c41e3a;
    }
    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.2rem 1.5rem;
    }
    .logo img {
        height: 48px;
        width: auto;
        display: block;
        filter: grayscale(0.2) contrast(1.1);
    }
    nav {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    nav a {
        color: #f8f9fa;
        font-family: 'Roboto Condensed', Arial, sans-serif;
        font-weight: bold;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        transition: background 0.2s, color 0.2s;
        text-decoration: none !important;
        outline: none;
        border: none;
        position: relative;
    }
    nav a.active, nav a[aria-current="page"] {
        background: #c41e3a;
        color: #f8f9fa;
    }
    nav a:hover, nav a:focus {
        background: #a00d2a;
        color: #f8f9fa;
    }
    .menu-burger {
        display: none;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        margin-left: 1rem;
        color: #f8f9fa;
    }
    @media (max-width: 800px) {
        nav {
            display: none;
            position: absolute;
            top: 70px;
            right: 0;
            background: #1a1a1a;
            flex-direction: column;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
            width: 70vw;
            max-width: 320px;
            padding: 2rem 1rem;
            z-index: 100;
        }
        nav.open {
            display: flex;
        }
        .menu-burger {
            display: block;
        }
    }
</style>

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
                    class:active={currentPath === link.href}
                    aria-current={currentPath === link.href ? "page" : undefined}
                    on:click={() => (menuOpen = false)}
                    >{link.label}</a>
            {/each}
        </nav>
    </div>
</header>