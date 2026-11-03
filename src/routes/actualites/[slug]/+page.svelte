<script lang="ts">
	import { marked } from 'marked';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const html = $derived(marked.parse(data.content, { async: false }));
</script>

<svelte:head>
	<title>{data.title} | Sainte Populaire</title>
	<meta name="description" content={data.summary} />
</svelte:head>

<article class="actualite-article">
	<h1>{data.title}</h1>
	<time class="date" datetime={data.date}>{formatDate(data.date)}</time>
	<p class="summary">{data.summary}</p>
	<div class="content">
		<!-- Contenu rédigé uniquement par les admins connectés. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html html}
	</div>
</article>
