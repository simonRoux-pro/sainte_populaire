<script>
	const videoSrc = 'https://www.youtube-nocookie.com/embed/yXFaP2MBJ9o';
</script>

<svelte:head>
	<title>C'est quoi Sainte Pop ? | Sainte Populaire</title>
</svelte:head>

<section class="video-section">
	<h1 class="discover-title">Sainte Pop, c'est quoi ?</h1>
	<div class="video-wrapper">
		<iframe
			src={videoSrc}
			title="Sainte Populaire – vidéo"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
			loading="lazy"
		></iframe>
	</div>
</section>

<style>
	.video-section {
		max-width: 960px;
		margin: 2rem auto;
		padding: 0 1rem;
	}
	.video-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		height: 0;
	}
	.video-wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
		border-radius: 12px;
		box-shadow: 0 2px 16px rgba(30, 30, 30, 0.07);
	}

	@media (max-width: 768px) {
		.video-section {
			margin: 1.5rem auto;
			padding: 0 0.5rem;
		}
		.discover-title {
			font-size: 1.3rem;
			margin-bottom: 1.5rem;
		}
	}
</style>
