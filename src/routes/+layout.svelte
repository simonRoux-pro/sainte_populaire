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
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    }
    .footer-social a:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.35); }
    .footer-social a:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }
    
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
        .footer-contact h3 {
            font-size: 1rem;
        }
    }

    /* Gradients par réseau, style badges ronds */
    .footer-social a.instagram { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); }
    .footer-social a.facebook { background: linear-gradient(135deg, #1877F3, #0e5bd8); }
    .footer-social a.x { background: linear-gradient(135deg, #222, #000); }
    .footer-social a.whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); }

    .footer-social svg { width: 22px; height: 22px; display: inline-block; }
    .footer-contact {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    .footer-contact h3 {
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
</style>

<Header />

<main class="main-container">
    <slot />
</main>

<footer>
    <div class="footer-contact">
        <h3>Nous contacter</h3>
        <a href="mailto:contact@saintepopulaire.fr">contact@saintepopulaire.fr</a>
    </div>
    <div class="footer-social">
        <!-- Instagram -->
        <a class="instagram" href="https://www.instagram.com/saintetiennepopulaire42/" target="_blank" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none"/>
            </svg>
        </a>
        <!-- Facebook -->
        <a class="facebook" href="https://www.facebook.com/p/Saint%C3%A9-Populaire-61563283078508/" target="_blank" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/>
            </svg>
        </a>
        <!-- X (Twitter) -->
        <a class="x" href="https://x.com/saintepopulaire?lang=en" target="_blank" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 4l16 16M20 4 4 20"/>
            </svg>
        </a>
        <!-- WhatsApp -->
        <a class="whatsapp" href="https://wa.me/33612345678" target="_blank" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A10.5 10.5 0 1 0 3.48 20.52L2 22l1.48-1.48a10.5 10.5 0 0 0 17.04-17.04Z"/>
                <path d="M16.64 13.66c-.2-.1-1.19-.59-1.38-.66-.19-.07-.33-.1-.47.1-.14.2-.54.66-.66.8-.12.14-.24.16-.45.05-.24-.1-.99-.36-1.88-1.14-.7-.62-1.17-1.38-1.31-1.61-.14-.24-.01-.36.1-.49.1-.1.24-.26.35-.39.12-.14.16-.24.24-.39.07-.14.03-.28-.02-.39-.05-.1-.47-1.13-.65-1.55-.17-.41-.36-.35-.49-.36-.12-.01-.28-.02-.44-.02-.16 0-.4.06-.61.28-.21.22-.8.78-.8 1.91 0 1.13.82 2.23.93 2.39.12.16 1.61 2.46 3.9 3.45.54.24.97.38 1.3.44.54.1 1.03.09 1.42.05.43-.06 1.29-.53 1.48-1.05.18-.52.18-.95.12-1.04-.06-.09-.2-.14-.42-.24Z"/>
            </svg>
        </a>
    </div>
    <div class="mentions">
        &copy; 2025 Sainte Populaire – <a href="/mentions-legales" style="color:#e5e5e5;text-decoration:underline;">Mentions légales</a>
    </div>
</footer>