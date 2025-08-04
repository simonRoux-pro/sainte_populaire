<script lang="ts">
	export let data;
</script>

<h1>{data.frontmatter.title}</h1>
<div>{@html data.content}</div>
