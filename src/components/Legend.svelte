<script>
	import { getContext } from 'svelte';
	import * as d3 from 'd3';

	const { xScale, percentRange, padding } = getContext('LayerCake');

	export let labels = [];
	export let colors = [];
	export let orientation = 'horizontal'; // Add flexibility for vertical legends

	// Validate props
	$: if (!Array.isArray(labels) || !Array.isArray(colors)) {
		console.error('Labels and colors must be arrays');
	}

	$: if (labels.length !== colors.length) {
		console.warn('Labels and colors arrays should have matching lengths');
	}

	// Memoize color scale
	$: colorScale = d3.scaleOrdinal().range(colors);

	// Memoize legend items
	$: legendItems = labels.map((label, i) => ({
		label: label.replace(/ million/g, 'M'),
		color: colorScale(label),
		id: `legend-item-${i}`
	}));
</script>

<div
	class="legend-container {orientation}"
	role="list"
	aria-label="Chart legend"
	style="left: -{$padding.left}px; bottom: -{$padding.bottom}px;"
>
	{#each legendItems as item (item.id)}
		<div class="legend-item" role="listitem">
			<div class="color-box" style="background-color: {item.color};" aria-hidden="true"></div>
			<div class="color-label-text">
				{item.label}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.legend-container {
		--legend-spacing: 16px;
		--legend-border-color: #ccc;
		--legend-padding: 5px;
		--legend-font-size: 11px;

		display: flex;
		position: absolute;
		border: 1px solid var(--legend-border-color);
		padding: var(--legend-padding) var(--legend-padding) 0;

		&.horizontal {
			flex-direction: row;
			flex-wrap: wrap;
		}

		&.vertical {
			flex-direction: column;
		}
	}

	.legend-item {
		display: flex;
		align-items: center;
		margin: 0 var(--legend-spacing) var(--legend-padding) 0;

		&:focus {
			outline: 2px solid currentColor;
			outline-offset: 2px;
		}

		&:hover {
			opacity: 0.8;
		}
	}

	.color-box {
		width: 10px;
		height: 16px;
		margin-right: 2px;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.color-label-text {
		font-size: var(--legend-font-size);
		line-height: var(--legend-font-size);
		user-select: none;
	}

	@media (max-width: 768px) {
		.legend-container {
			position: relative;
			left: 0 !important;
			bottom: 0 !important;
			margin-top: var(--legend-spacing);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.legend-item {
			transition: none;
		}
	}
</style>
