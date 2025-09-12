<script>
    import { marked } from 'marked';
    export let data;
    $: html = marked(data.content || '');
</script>

<article class="actualite-article">
    <h1>{data.title}</h1>
    <span class="date">{new Date(data.date).toLocaleDateString()}</span>
    <p class="summary">{data.summary}</p>
    <div class="content">
        {@html html}
    </div>
</article>