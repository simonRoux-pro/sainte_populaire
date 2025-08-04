<script lang="ts">
	export let links: { href: string; label: string }[] = [];
</script>

<div class="flex items-center justify-between px-12 py-6 shadow-xl">
	<a href="/">
		<img src="images/logo_full.png" alt="Logo" class="h-20 w-72" />
	</a>
	<nav>
		<ul class="flex space-x-8">
			{#each links as link}
				<li>
					<a href={link.href} class="btn btn-primary">{link.label}</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<style>
</style>
