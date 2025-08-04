<script lang="ts">
	import '../app.css';
	import { Header } from '$lib';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Accueil' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/about', label: 'À propos' },
		{ href: '/services', label: 'Services' },
		{ href: '/faq', label: 'FAQ' }
	];
</script>

<Header {links} />
{@render children()}
