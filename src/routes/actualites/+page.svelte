<script lang="ts">
    export let data: {
        articles: Array<
            | { type: 'markdown'; slug: string; title: string; date: string; summary: string }
            | { type: 'pdf'; title: string; date: string; summary: string; file: string }
        >;
    };
        let isAdmin = false;

    // Vérifie l'admin côté client (exemple simple)
    import { onMount } from 'svelte';
    onMount(async () => {
        const res = await fetch('/api/login', { method: 'GET' });
        isAdmin = res.ok;
    });

    async function supprimer(
        article: { type: 'markdown'; slug: string; title: string; date: string; summary: string }
              | { type: 'pdf'; title: string; date: string; summary: string; file: string }
    ) {
        if (!confirm('Supprimer cet article ?')) return;
        await fetch('/api/delete-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article)
        });
        window.location.reload();
    }
</script>

<section class="actualites-section">
    <h2 class="discover-title">ACTUALITÉS</h2>
    <ul class="articles-list">
        {#each data.articles as article}
            <li>
                {#if article.type === 'markdown'}
                    <a class="article-link" href={`/actualites/${article.slug}`}>
                        {article.title}
                    </a>
                {:else if article.type === 'pdf'}
                    <a class="article-link" href={article.file} target="_blank" rel="noopener">
                        <span aria-label="PDF" title="PDF" style="margin-right:0.4em;">📄</span>{article.title}
                    </a>
                {/if}
                <span class="date">{new Date(article.date).toLocaleDateString()}</span>
                <p class="summary">{article.summary}</p>
                {#if isAdmin}
                    <button on:click={() => supprimer(article)} class="hero-cta" style="margin-top:0.5rem;">Supprimer</button>
                {/if}
            </li>
        {/each}
    </ul>
</section>