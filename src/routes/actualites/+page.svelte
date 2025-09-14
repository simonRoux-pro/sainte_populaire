<script lang="ts">
    export let data: {
        articles: Array<
            | { type: 'markdown'; slug: string; title: string; date: string; summary: string }
            | { type: 'pdf'; title: string; date: string; summary: string; file: string }
        >;
    };

    let pdfPreview: string | null = null;
    let pdfTitle: string | null = null;

    function openPdfPreview(file: string, title: string) {
        pdfPreview = file;
        pdfTitle = title;
        document.body.style.overflow = 'hidden';
    }
    function closePdfPreview() {
        pdfPreview = null;
        pdfTitle = null;
        document.body.style.overflow = '';
    }
</script>

<section class="actualites-section">
    <h2 class="discover-title">ACTUALITÉS</h2>
    <div class="articles-grid">
        {#each data.articles as article}
            <div class="article-card">
                <div class="article-card-header">
                    <span class="date">{new Date(article.date).toLocaleDateString()}</span>
                    {#if article.type === 'pdf'}
                        <span class="pdf-badge" title="PDF">PDF</span>
                    {/if}
                </div>
                <h3 class="article-title">{article.title}</h3>
                <p class="summary">{article.summary}</p>
                <div class="article-actions">
                    {#if article.type === 'markdown'}
                        <a class="hero-cta" href={`/actualites/${article.slug}`}>Lire</a>
                    {:else if article.type === 'pdf'}
                        <button class="hero-cta" type="button" on:click={() => openPdfPreview(article.file, article.title)}>
                            Prévisualiser
                        </button>
                        <a href={article.file} target="_blank" rel="noopener" class="pdf-ext-link" title="Ouvrir dans un nouvel onglet">↗</a>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</section>

{#if pdfPreview}
    <div class="pdf-modal" on:click={closePdfPreview}>
        <div class="pdf-modal-content" on:click|stopPropagation>
            <button class="close-btn" on:click={closePdfPreview} aria-label="Fermer">✕</button>
            <h3 style="margin-bottom:1rem;">{pdfTitle}</h3>
            <iframe src={pdfPreview} width="100%" height="600px" style="border:none; background:#fff;"></iframe>
            <div style="text-align:center;margin-top:1rem;">
                <a href={pdfPreview} target="_blank" rel="noopener noreferrer" class="hero-cta">Ouvrir dans un nouvel onglet</a>
            </div>
        </div>
    </div>
{/if}

<style>
.actualites-section {
    max-width: 1100px;
    margin: 3rem auto;
    padding: 0 1.5rem;
}
.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-top: 2.5rem;
}
.article-card {
    background: var(--blanc-cassé, #f8f9fa);
    border-radius: 1.2rem;
    box-shadow: 0 2px 16px rgba(30,30,30,0.07);
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s, transform 0.2s;
    position: relative;
}
.article-card:hover {
    box-shadow: 0 8px 32px rgba(196,30,58,0.13);
    transform: translateY(-4px) scale(1.015);
}
.article-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.7rem;
}
.pdf-badge {
    background: var(--rouge-ouvrier, #c41e3a);
    color: #fff;
    font-size: 0.85rem;
    font-weight: bold;
    border-radius: 0.5em;
    padding: 0.2em 0.7em;
    margin-left: 0.5em;
    letter-spacing: 0.03em;
}
.article-title {
    font-family: 'Roboto Condensed', Arial, sans-serif;
    font-size: 1.25rem;
    color: var(--rouge-ouvrier, #c41e3a);
    margin: 0 0 0.5rem 0;
}
.summary {
    color: var(--noir-charbon, #1a1a1a);
    font-family: 'Lora', serif;
    margin-bottom: 1.2rem;
    font-size: 1.08rem;
    min-height: 3.2em;
}
.article-actions {
    display: flex;
    align-items: center;
    gap: 1.1em;
    margin-top: auto;
}
.hero-cta {
    background: var(--rouge-ouvrier, #c41e3a);
    color: #fff;
    border: none;
    border-radius: 0.7em;
    padding: 0.5em 1.3em;
    font-size: 1.05em;
    font-family: 'Roboto Condensed', Arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
    box-shadow: 0 1px 4px rgba(196,30,58,0.07);
}
.hero-cta:hover, .hero-cta:focus {
    background: #a00d2a;
    color: #fff;
}
.pdf-ext-link {
    font-size: 1.2em;
    color: var(--rouge-ouvrier, #c41e3a);
    text-decoration: none;
    margin-left: 0.2em;
    vertical-align: middle;
    transition: color 0.18s;
}
.pdf-ext-link:hover, .pdf-ext-link:focus {
    color: #a00d2a;
}
.pdf-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(30,30,30,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}
.pdf-modal-content {
    background: var(--blanc-cassé, #f8f9fa);
    border-radius: 1.5rem;
    max-width: 1200px;         /* ← plus large qu'avant */
    width: 95vw;               /* ← occupe presque toute la largeur de l'écran */
    max-height: 95vh;
    padding: 2rem 1rem 1rem 1rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    position: relative;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.pdf-modal-content iframe {
    width: 100%;
    min-height: 70vh;          /* ← plus haut aussi */
    border: none;
    background: #fff;
}
.close-btn {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--rouge-ouvrier, #c41e3a);
    cursor: pointer;
}
@media (max-width: 700px) {
    .articles-grid {
        grid-template-columns: 1fr;
    }
    .pdf-modal-content {
        padding: 1rem 0.2rem 0.5rem 0.2rem;
    }
    .pdf-modal-content iframe {
        height: 60vw;
    }
}
</style>