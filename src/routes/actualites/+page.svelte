<script>
	export let data;
</script>

<h1>Actualités</h1>

{#each data.articles as article}
	<article class="mb-6">
		<h2>
			<a href={`/actualites/${article.slug}`} class="text-blue-600 hover:underline">
				{article.title}
			</a>
		</h2>
		<p class="text-sm text-gray-500">{new Date(article.date).toLocaleDateString()}</p>
		<p>{article.summary}</p>
	</article>
{/each}
