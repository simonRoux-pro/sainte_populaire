<script lang="ts">
    type Article = {
        id: string;
        type: 'markdown' | 'pdf';
        title: string;
        date: string;
        summary: string;
        slug?: string;
        body?: string;
        file?: string;
        image?: string;
        link?: string;
    };

    export let data: {
        admin: boolean;
        articles: Article[];
    };

    let pdfPreview: string | null = null;
    let pdfTitle: string | null = null;
    let isAdmin = data.admin;

    async function deleteArticle(article: Article) {
        if (!confirm("Supprimer cet article ?")) return;
        if (!article.id) {
            alert("Impossible de supprimer cet article (identifiant manquant).");
            return;
        }

        const res = await fetch('/api/delete-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: article.id })
        });
        if (res.ok) {
            // Actualise la liste ou retire l'article du tableau
            location.reload();
        } else {
            alert("Erreur lors de la suppression.");
        }
    }
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

    function onBackdropKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closePdfPreview();
        }
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
                    {#if article.type === 'pdf' && article.image}
                        {#if article.link}
                            <a href={article.link} target="_blank" rel="noopener" class="article-image-link" title="Ouvrir le lien">
                                <img class="article-image" src={article.image} alt={article.title} />
                            </a>
                        {:else}
                            <img class="article-image" src={article.image} alt={article.title} />
                        {/if}
                    {/if}
                    <p class="summary">{article.summary}</p>
                    <div class="article-actions">
                        {#if article.type === 'markdown' && article.slug}
                            <a class="hero-cta" href={`/actualites/${article.slug}`}>Lire</a>
                        {:else if article.type === 'pdf' && article.file}
                            <button class="hero-cta" type="button" on:click={() => openPdfPreview(article.file!, article.title)}>
                                Prévisualiser
                            </button>
                            <a href={article.file} target="_blank" rel="noopener" class="pdf-ext-link" title="Ouvrir dans un nouvel onglet">↗</a>
                        {/if}
                        {#if isAdmin}
                            <button class="delete-btn" title="Supprimer l'article" aria-label="Supprimer l'article" on:click={() => deleteArticle(article as any)}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
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
    <div class="pdf-modal" role="button" tabindex="0" aria-label="Fermer la prévisualisation" on:click={closePdfPreview} on:keydown={onBackdropKeydown}>
        <div class="pdf-modal-content" role="dialog" aria-modal="true" tabindex="-1" on:click|stopPropagation on:keydown={(e) => e.key === 'Escape' && closePdfPreview()}>
            <button class="close-btn" on:click={closePdfPreview} aria-label="Fermer">✕</button>
            <h3 style="margin-bottom:1rem;">{pdfTitle}</h3>
            <iframe src={pdfPreview} width="100%" height="600px" style="border:none; background:#fff;" title={pdfTitle || 'Aperçu PDF'}></iframe>
            <div style="text-align:center;margin-top:1rem;">
                <a href={pdfPreview} target="_blank" rel="noopener noreferrer" class="hero-cta">Ouvrir dans un nouvel onglet</a>
            </div>
        </div>
    </div>
{/if}

<style>
    .article-actions { display:flex; align-items:center; gap: 0.5rem; }
    .article-image { width: 100%; height: auto; border-radius: 0.6rem; margin: 0.25rem 0 0.5rem; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
    .article-image-link { display:block; }
    .delete-btn {
        margin-left: auto;
        background: transparent;
        border: none;
        padding: 0.25rem;
        color: #c41e3a;
        cursor: pointer;
        border-radius: 6px;
        transition: color .15s ease, transform .1s ease, background-color .15s ease;
    }
    .delete-btn:hover { color: #a3132b; background-color: rgba(196,30,58,0.08); }
    .delete-btn:focus-visible { outline: 2px solid #c41e3a; outline-offset: 2px; }
</style>