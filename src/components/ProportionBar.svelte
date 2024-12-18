<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';

	const { data } = getContext('LayerCake');

	export let zDomain;
	export let zRange;
	export let width;

	// Constants
	const LABEL_PADDING = 5;

	// Memoize stacked data calculation
	$: stackedData = $data.reduce((acc, item) => {
		const lastItem = acc[acc.length - 1];
		const offset = lastItem ? lastItem.offset + lastItem.count : 0;
		acc.push({ ...item, offset });
		return acc;
	}, []);

	// Memoize total for scale
	$: total = d3.sum($data, (d) => d.count);

	// Create scales once data changes
	$: xScale = d3.scaleLinear().domain([0, total]).range([0, width]);

	$: colorScale = d3.scaleOrdinal().domain(zDomain).range(zRange);

	// Calculate contrast ratio for text
	function getTextColor(backgroundColor) {
		const rgb = d3.rgb(backgroundColor);
		const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
		return luminance > 0.5 ? '#000000' : '#ffffff';
	}
</script>

<div
	class="bar-group"
	role="graphics-document"
	aria-label="Proportional bar chart showing distribution across groups"
>
	{#each stackedData as d, i}
		{@const barWidth = xScale(d.count)}
		{@const barLeft = xScale(d.offset)}
		{@const backgroundColor = colorScale(d.group)}
		{@const textColor = getTextColor(backgroundColor)}

		<div
			class="group-rect"
			role="graphics-symbol"
			aria-label="Group {d.group} with value {d.count}"
			data-id={d.group}
			style="
        width: {barWidth}px;
        background-color: {backgroundColor};
        left: {barLeft}px;
        --text-color: {textColor};
      "
		>
			<div
				class="group-label"
				style="
          width: calc({barWidth}px - {LABEL_PADDING}px);
        "
			>
				<div class="group-label-text">
					{d.count}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.bar-group {
		position: relative;
		width: 100%;
		height: var(--bar-height, 40px);
	}

	.group-rect {
		position: absolute;
		height: var(--bar-height, 40px);
		transition: opacity 0.2s ease;
	}

	.group-rect:hover,
	.group-rect:focus {
		opacity: 0.9;
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.group-label {
		position: absolute;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.group-label-text {
		background-color: rgba(255, 255, 255, 0.33);
		padding: 2px 5px;
		border-radius: 2px;
		color: var(--text-color, inherit);
		font-weight: bold;
	}

	@media (prefers-reduced-motion: reduce) {
		.group-rect {
			transition: none;
		}
	}
</style>
