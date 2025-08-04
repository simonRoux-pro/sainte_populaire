<script lang="ts">
	import '../app.css';
	import { Header } from '$lib';

	let { children } = $props();

	const links = [
		{ href: '/sainte-pop', label: 'Sainté Pop’' },
		{ href: '/agir', label: 'Agir' },
		{ href: '/programme', label: 'Programme' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<Header {links} />
{@render children()}
