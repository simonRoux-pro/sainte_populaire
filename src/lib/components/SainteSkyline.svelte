<!--
	Illustration de Saint-Étienne : massif du Pilat, crassiers, chevalement du Puits Couriot,
	toits de la ville et stade Geoffroy-Guichard. Couleurs reprises du logo.
-->
<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();

	// Immeubles de la ville : [x, largeur, hauteur]
	const buildings: [number, number, number][] = [
		[440, 46, 70],
		[488, 38, 96],
		[528, 52, 58],
		[612, 44, 84],
		[742, 50, 66],
		[794, 40, 104],
		[836, 56, 74],
		[894, 42, 90]
	];
	const GROUND = 232;
	const windows = buildings.flatMap(([x, w, h], i) => {
		const list: [number, number][] = [];
		for (let wy = GROUND - h + 12; wy < GROUND - 14; wy += 18) {
			for (let wx = x + 8; wx < x + w - 10; wx += 14) {
				// Une fenêtre sur trois environ est allumée, de façon stable.
				if ((wx * 7 + wy * 3 + i) % 3 === 0) list.push([wx, wy]);
			}
		}
		return list;
	});
</script>

<svg
	class={className}
	viewBox="0 0 1200 260"
	preserveAspectRatio="xMidYMax slice"
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	aria-label="Illustration de Saint-Étienne : les crassiers, le chevalement du Puits Couriot, la ville et le stade"
>
	<!-- Soleil et étoile du logo -->
	<circle cx="905" cy="105" r="62" fill="#ff5d6e" opacity="0.9" />
	<path
		d="M160 46 l9 19 21 3 -15 15 4 21 -19 -10 -19 10 4 -21 -15 -15 21 -3z"
		fill="#a3de83"
		opacity="0.9"
	/>

	<!-- Massif du Pilat -->
	<path
		d="M0 175 Q120 120 260 150 T520 140 T800 120 T1050 135 T1200 125 V260 H0Z"
		fill="#a3de83"
		opacity="0.45"
	/>
	<path d="M0 200 Q200 160 420 185 T860 175 T1200 180 V260 H0Z" fill="#a3de83" opacity="0.7" />

	<!-- Crassiers -->
	<path d="M70 232 L200 92 Q206 86 212 92 L345 232Z" fill="#3a4044" />
	<path d="M255 232 L355 122 Q361 116 367 122 L470 232Z" fill="#2c3134" />
	<path d="M200 92 Q206 86 212 92 L226 108 Q206 100 188 106Z" fill="#a3de83" />
	<path d="M355 122 Q361 116 367 122 L378 134 Q360 128 345 133Z" fill="#a3de83" />
	<g stroke="#4b5257" stroke-width="2" opacity="0.6">
		<line x1="150" y1="180" x2="250" y2="176" />
		<line x1="120" y1="210" x2="290" y2="206" />
		<line x1="320" y1="190" x2="400" y2="188" />
	</g>

	<!-- Ville -->
	<g fill="#23272a">
		{#each buildings as [x, w, h] (x)}
			<rect {x} y={GROUND - h} width={w} height={h} rx="2" />
		{/each}
		<!-- Clocher -->
		<rect x="584" y="150" width="24" height="82" />
		<path d="M580 150 L596 96 L612 150Z" />
	</g>
	<g fill="#cba67a">
		{#each windows as [x, y] (`${x}-${y}`)}
			<rect {x} {y} width="6" height="8" rx="1" />
		{/each}
	</g>

	<!-- Chevalement du Puits Couriot -->
	<g stroke="#23272a" stroke-width="5" stroke-linecap="round" fill="none">
		<line x1="672" y1="232" x2="682" y2="78" />
		<line x1="712" y1="232" x2="702" y2="78" />
		<line x1="682" y1="78" x2="702" y2="78" />
		<polyline points="674,210 710,186 677,160 707,136 680,112 704,92" stroke-width="3" />
		<line x1="702" y1="86" x2="752" y2="232" />
	</g>
	<circle cx="692" cy="66" r="15" fill="none" stroke="#ff5d6e" stroke-width="5" />
	<circle cx="692" cy="66" r="3" fill="#ff5d6e" />

	<!-- Stade Geoffroy-Guichard -->
	<g>
		<path d="M965 232 L975 186 H1155 L1165 232Z" fill="#2f8f4e" />
		<rect x="975" y="180" width="180" height="8" rx="2" fill="#23272a" />
		<g stroke="#23272a" stroke-width="3">
			<line x1="968" y1="232" x2="968" y2="150" />
			<line x1="1162" y1="232" x2="1162" y2="150" />
		</g>
		<rect x="958" y="142" width="20" height="10" rx="2" fill="#cba67a" />
		<rect x="1152" y="142" width="20" height="10" rx="2" fill="#cba67a" />
		<g stroke="#a3de83" stroke-width="2" opacity="0.8">
			<line x1="990" y1="200" x2="1140" y2="200" />
			<line x1="985" y1="214" x2="1145" y2="214" />
		</g>
	</g>

	<!-- Sol -->
	<rect x="0" y={GROUND} width="1200" height="28" fill="#23272a" />
	<rect x="0" y={GROUND} width="1200" height="4" fill="#ff5d6e" />
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
