<script>
    import '../app.css';
    import Header from '$lib/components/Header.svelte';
</script>

<style>
    :root {
        --vert: #1a1a1a;
        --vert-hover: #9FE870;
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
        max-width: var(--max-width);
        margin: 0 auto;
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
        <a href="https://instagram.com/" target="_blank" aria-label="Instagram">
            <!-- Instagram SVG -->
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
		</a>
    </div>
    <div class="mentions">
        &copy; 2025 Sainte Populaire – <a href="/mentions-legales" style="color:#e5e5e5;text-decoration:underline;">Mentions légales</a>
    </div>
</footer>