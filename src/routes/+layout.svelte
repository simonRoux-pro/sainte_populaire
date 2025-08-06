<script lang="ts">
	let { children } = $props();

	import '../app.css';
	import { Header } from '$lib';

	const links = [
		{ href: '/sainte-pop', label: 'Sainté Pop’' },
		{ href: '/agir', label: 'Agir' },
		{ href: '/programme', label: 'Programme' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<Header {links} />

{@render children()}
