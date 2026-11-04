<!--
	Affiche un PDF page par page avec PDF.js.
	Les navigateurs mobiles (Chrome Android notamment) n'affichent pas les PDF dans une page web.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';

	let { src, title }: { src: string; title: string } = $props();

	let container = $state<HTMLDivElement>();
	let canvases = $state<HTMLCanvasElement[]>([]);
	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let pageCount = $state(0);

	onMount(() => {
		let cancelled = false;
		let destroy: (() => void) | undefined;

		(async () => {
			try {
				const pdfjs = await import('pdfjs-dist');
				const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
				pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

				const task = pdfjs.getDocument({ url: src });
				destroy = () => task.destroy();
				const doc = await task.promise;
				if (cancelled || !container) return;
				pageCount = doc.numPages;
				status = 'ready';
				await tick();

				const ratio = Math.min(window.devicePixelRatio || 1, 2);
				for (let n = 1; n <= doc.numPages && !cancelled; n++) {
					const canvas = canvases[n - 1];
					if (!canvas) continue;
					const page = await doc.getPage(n);
					const width = container.clientWidth || 600;
					const base = page.getViewport({ scale: 1 });
					const viewport = page.getViewport({ scale: (width / base.width) * ratio });
					canvas.width = Math.floor(viewport.width);
					canvas.height = Math.floor(viewport.height);
					await page.render({ canvas, viewport }).promise;
				}
			} catch (e) {
				if (!cancelled) {
					console.warn('Lecture du PDF impossible', e);
					status = 'error';
				}
			}
		})();

		return () => {
			cancelled = true;
			destroy?.();
		};
	});
</script>

<div class="viewer">
	{#if status === 'loading'}
		<p class="state" role="status">Chargement du document...</p>
	{:else if status === 'error'}
		<p class="state" role="alert">
			Impossible d'afficher le document ici.
			<a href={src} target="_blank" rel="noopener noreferrer">Ouvrir le PDF</a>
		</p>
	{/if}
	<div class="pages" bind:this={container}>
		{#each { length: pageCount }, i (i)}
			<canvas bind:this={canvases[i]} aria-label={`${title}, page ${i + 1} sur ${pageCount}`}
			></canvas>
		{/each}
	</div>
</div>

<style>
	.viewer {
		background: #3b3f42;
		border-radius: 0.6rem;
		padding: 0.6rem;
		max-height: 72vh;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.pages :global(canvas) {
		display: block;
		width: 100%;
		height: auto;
		background: #fff;
		margin: 0 auto 0.6rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
	.state {
		color: #fff;
		text-align: center;
		padding: 3rem 1rem;
		margin: 0;
	}
	.state a {
		color: #ffb3bb;
		text-decoration: underline;
	}
</style>
