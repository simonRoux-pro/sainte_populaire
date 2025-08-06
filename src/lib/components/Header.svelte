<!-- This is a svelte component for the header of the application -->
<script lang="ts">
	export let links: { href: string; label: string }[] = [];
</script>

<div class="flex items-center justify-between px-12 py-6 shadow-xl">
	<a href="/">
		<img src="images/logo_full.png" alt="Logo" class="h-20 w-72" />
	</a>
	<nav>
		<!-- Navigation links -->
		<ul class="flex space-x-8">
			{#each links as link}
				<a href={link.href} class="btn btn-slide-show">
					<span class="btn-slide-show-inner">{link.label}</span>
				</a>
			{/each}
		</ul>
	</nav>
</div>
