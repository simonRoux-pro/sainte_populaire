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
<div class="actus-frama-flex">
    <section class="actualites-section">
        <h2 class="actualites-title">ACTUALITÉS</h2>
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
    <aside class="framaform-aside">
        <h2 class="discover-title" style="font-size:1.2em;">Soutenir Sainte Populaire</h2>
        <iframe
            src="https://framaforms.org/comite-de-soutien-de-sainte-populaire-municipales-2026-a-saint-etienne-1746463242"
            width="100%"
            height="1200"
            style="border:none; background:#fff; border-radius:1em; box-shadow:0 2px 16px rgba(30,30,30,0.07);"
            allowfullscreen
            loading="lazy"
            title="Formulaire Framaform"
        ></iframe>
    </aside>
</div>

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

</style>