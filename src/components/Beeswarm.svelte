<!--
  @component
  Generates an SVG Beeswarm chart using a [d3-force simulation](https://github.com/d3/d3-force).
 -->
<script>
	import { getContext } from 'svelte';
	import HoverCard from './HoverCard.svelte';
	import { convertToNumber, colorsCategorical, colorsCategoricalExtra } from '$lib/index';
	import { median } from 'd3-array';
	import { scaleOrdinal } from 'd3-scale';
	import { forceSimulation, forceX, forceCollide } from 'd3-force';

	const { data, xGet, height, xScale } = getContext('LayerCake');

	export let x;
	export let r = 4;
	export let strokeWidth = 1;
	export let xStrength = 1;

	// Add validation for required props
	$: if (!x) {
		console.error('x parameter is required for Beeswarm chart');
	}

	// Validate data structure
	$: if ($data.some((d) => !d['Revenue Tier'])) {
		console.warn('Some data points missing Revenue Tier');
	}

	// Transform data into nodes for D3 force simulation.
	$: nodes = $data.map((d) => ({ ...d }));

	$: medianValue = median($data, (d) => d[x]);

	// Define zDomain as the range of possible values for "Revenue Tier" of node.
	$: zDomain = Array.from(new Set($data.map((d) => d['Revenue Tier']))).sort(
		(a, b) => convertToNumber(a) - convertToNumber(b)
	);

	// Assign colors to zDomain accordingly.
	$: colorScale = scaleOrdinal().domain(zDomain).range(colorsCategorical);

	// Create D3 force to prevent circles from overlapping.
	$: simulation = forceSimulation(nodes)
		.force(
			'x',
			forceX()
				.x((d) => $xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0))
				.strength(xStrength)
		)
		.force('collide', forceCollide(r * 0.8))
		.stop();

	$: {
		for (
			let i = 0,
				n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
			i < n;
			++i
		) {
			simulation.tick();
		}
	}

	$: hoverCardInfo = {
		data: {},
		x: 0,
		y: 0,
		active: false
	};

	// Helper function to update hover card info.
	const updateHoverCard = (node, active = true) => ({
		data: active ? $data[node.index] : {},
		x: active ? node.x : 0,
		y: active ? node.y + $height / 2 : 0,
		active
	});
</script>

<div class="bee-container">
	<HoverCard data={hoverCardInfo} />

	{#each simulation.nodes() as node}
		<div
			class="circle"
			role="button"
			tabindex="-1"
			aria-label="Data point with value {node['Revenue Tier']}"
			aria-expanded={hoverCardInfo.active}
			style="
        left: {node.x}%;
        top: {node.y + $height / 2}px;
        width: {r * 2}px;
        height: {r * 2}px;
        background-color: {colorScale(node['Revenue Tier'])};
        border: {strokeWidth}px solid {colorScale(node['Revenue Tier'])};
      "
			on:mouseover={() => {
				hoverCardInfo = updateHoverCard(node);
			}}
			on:focus={() => {
				hoverCardInfo = updateHoverCard(node);
			}}
			on:mouseleave={() => {
				hoverCardInfo = updateHoverCard(node, false);
			}}
		></div>
	{/each}

	<div
		class="median-container"
		style="left: {$xScale(medianValue) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}%;"
	>
		<div class="median-line"></div>
		<div class="median-label">MEDIAN</div>
	</div>
</div>

<style lang="scss">
	.bee-container {
		position: relative;
		height: 100%;
	}

	.circle {
		position: absolute;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background-color: black;
		border: 1px solid black;
	}

	.median-container {
		position: absolute;
		top: 0;
		height: 100%;
	}

	.median-line {
		position: absolute;
		top: 0;
		left: 0;
		width: 1.5px;
		height: 100%;
		background-color: #000;
	}

	.median-label {
		position: relative;
		transform: translate(-50%, -100%);
		background-color: black;
		color: white;
		padding: 2px 4px;
		border-radius: 4px;
		font-size: 11px;
	}
</style>
