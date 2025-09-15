<script>
    import '../app.css';
    import Header from '$lib/components/Header.svelte';
</script>

<style>
    :root {
        --vert: #1a1a1a;
        --vert-hover: #0B3D2E;
        --blanc: #fff;
        --noir: #000;
        --beige: #F5E9DD;
        --max-width: 1200px;
    }
    body {
        font-family: 'Montserrat', Arial, sans-serif;
        background: var(--blanc);
        color: var(--noir);
    }
    .main-container {
        /* max-width: var(--max-width);
        margin: 0 auto; */
        padding: 0 1.5rem;
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
        color: var(--blanc);
        margin: 0 0.7rem;
        font-size: 1.7rem;
        text-decoration: none;
        transition: color 0.2s;
    }
    .footer-social a:hover {
        color: var(--vert-hover);
    }
    .mentions {
        margin-top: 1.2rem;
        font-size: 0.95rem;
        color: #e5e5e5;
    }
</style>

<Header />

<main class="main-container">
    <slot />
</main>

<footer>
    <div class="footer-social">
        <!-- Instagram SVG -->
        <a href="https://www.instagram.com/saintetiennepopulaire42/" target="_blank" aria-label="Instagram">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="16" fill="#E1306C"/>
                <path d="M22 10c0-1.1-.9-2-2-2H12c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-8zm-6 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm5.2-.7a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0zM16 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="#fff"/>
            </svg>
        </a>
        <a href="https://www.facebook.com/p/Saint%C3%A9-Populaire-61563283078508/" target="_blank" aria-label="Facebook">
            <!-- Facebook SVG amélioré -->
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#1877F3"/>
                <path d="M21.5 16h-3v8h-3v-8h-2v-2.5h2v-1.5c0-2.1 1.2-3.5 3.5-3.5h2v2.5h-1.5c-0.7 0-1 .3-1 1v1.5h2.5L21.5 16z" fill="#fff"/>
            </svg>
        </a>
        <a href="https://x.com/saintepopulaire?lang=en" target="_blank" aria-label="X">
            <!-- X (Twitter) SVG officiel -->
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="16" fill="#000"/>
                <path d="M21.7 10h2.3l-6.1 7.1 7.2 8.9h-5.7l-4.5-5.6-5.2 5.6H7.3l6.5-7.1-7-8.9h5.7l4.2 5.2 4.5-5.2zm-1.1 15h1.3l-8.3-10.5h-1.3l8.3 10.5z" fill="#fff"/>
            </svg>  
        </a>
    </div>
    <div class="mentions">
        &copy; 2025 Sainte Populaire – <a href="/mentions-legales" style="color:#e5e5e5;text-decoration:underline;">Mentions légales</a>
    </div>
</footer>