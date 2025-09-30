<script>
    import Hero from '$lib/components/Hero.svelte';
</script>

<Hero />

<section class="contact-section">
    <div class="contact-container">
        <h2 class="discover-title">Nous contacter</h2>
        
        <div class="contact-grid">
            <div class="contact-card">
                <div class="contact-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
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
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                </div>
                <h3>WhatsApp</h3>
                <p>Pour un échange direct et rapide</p>
                <a href="https://wa.me/33612345678" target="_blank" rel="noopener" class="contact-link">
                    Écrire sur WhatsApp
                </a>
            </div>

            <div class="contact-card">
                <div class="contact-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/>
                    </svg>
                </div>
                <h3>Réseaux sociaux</h3>
                <p>Suivez notre actualité</p>
                <div class="social-links">
                    <a href="https://www.facebook.com/p/Saint%C3%A9-Populaire-61563283078508/" target="_blank" rel="noopener" aria-label="Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/saintetiennepopulaire42/" target="_blank" rel="noopener" aria-label="Instagram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="5"/>
                            <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                            <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none"/>
                        </svg>
                    </a>
                    <a href="https://x.com/saintepopulaire?lang=en" target="_blank" rel="noopener" aria-label="X (Twitter)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4l16 16M20 4 4 20"/>
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
        box-shadow: 0 2px 16px rgba(30,30,30,0.07);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 1px solid rgba(230, 242, 238, 0.5);
    }

    .contact-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 24px rgba(30,30,30,0.12);
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
        background: var(--vert-hover, #0B3D2E);
    }

    .social-links {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .social-links a {
        color: var(--rouge-ouvrier, #c41e3a);
        transition: color 0.2s ease, transform 0.1s ease;
    }

    .social-links a:hover {
        color: var(--vert-hover, #0B3D2E);
        transform: translateY(-1px);
    }
</style>
