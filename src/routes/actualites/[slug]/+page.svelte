<script>
	import { marked } from 'marked';
	export let data;

	let html = marked(data.content);
</script>

<article class="prose max-w-3xl mx-auto">
	<h1>{data.meta.title}</h1>
	<p class="text-sm text-gray-500">{new Date(data.meta.date).toLocaleDateString()}</p>
	<p class="text-base italic text-gray-600">{data.meta.summary}</p>
	<div>{@html html}</div>
</article>
