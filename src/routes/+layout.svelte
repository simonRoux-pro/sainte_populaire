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
        <a href="https://www.instagram.com/saintetiennepopulaire42/" target="_blank" aria-label="Instagram">
            <!-- Instagram SVG -->
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
        </a>
        <a href="https://www.facebook.com/p/Saint%C3%A9-Populaire-61563283078508/" target="_blank" aria-label="Facebook">
            <!-- Facebook SVG amélioré -->
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="5" fill="currentColor" opacity="0.08"/>
              <path fill="currentColor" d="M16.67 8.667h-2.003V7.667c0-.48.32-.593.545-.593h1.432V5.083L14.7 5.083c-2.013 0-2.47 1.507-2.47 2.47v1.114H10v2.222h2.23V19h2.437v-6.111h1.637l.263-2.222z"/>
            </svg>
        </a>
        <a href="https://x.com/saintepopulaire?lang=en" target="_blank" aria-label="X">
            <!-- X (Twitter) SVG officiel -->
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="5" fill="currentColor" opacity="0.08"/>
              <path fill="currentColor" d="M17.53 6.47a.75.75 0 0 0-1.06 0L12 10.94 7.53 6.47a.75.75 0 1 0-1.06 1.06L10.94 12l-4.47 4.47a.75.75 0 1 0 1.06 1.06L12 13.06l4.47 4.47a.75.75 0 1 0 1.06-1.06L13.06 12l4.47-4.47a.75.75 0 0 0 0-1.06z"/>
            </svg>
        </a>
    </div>
    <div class="mentions">
        &copy; 2025 Sainte Populaire – <a href="/mentions-legales" style="color:#e5e5e5;text-decoration:underline;">Mentions légales</a>
    </div>
</footer>