<script lang="ts">
	export let links: { href: string; label: string }[] = [];
</script>

<nav class="bg-gray-100 p-4">
	<ul class="flex space-x-4">
		{#each links as link}
			<li>
				<a href={link.href} class="hover:underline">{link.label}</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	/* Ajoutez vos styles ici si nécessaire */
</style>
