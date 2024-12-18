<!--
  @component
  Generates an SVG column chart.
 -->
<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, x, yRange, xScale, y, height } = getContext('LayerCake');

	export let fill = '#f95346';
	export let stroke = '#000';
	export let strokeWidth = 0;

	$: columnWidth = (d) => {
		const vals = $xGet(d);
		return Math.abs(vals[1] - vals[0]);
	};

	$: columnHeight = (d) => {
		return $yRange[0] - $yGet(d);
	};
</script>

<div class="column-group" role="graphics-document" aria-label="Column chart">
	{#each $data as d, i}
		{@const colHeight = columnHeight(d)}
		{@const xGot = $xGet(d)}
		{@const xPos = Array.isArray(xGot) ? xGot[0] : xGot}
		{@const colWidth = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
		{@const yValue = $y(d)}
		<div
			class="group-rect"
			role="graphics-symbol"
			aria-label="Column: {yValue}"
			data-id={i}
			data-range={$x(d)}
			data-count={yValue}
			style="
        position: absolute;
        left: {xPos}%;
        top: {$yGet(d)}%;
        width: {colWidth}%;
        height: {colHeight}%;
        background-color: {fill};
        border: {strokeWidth}px solid {stroke};
      "
		></div>
		<div
			class="group-label"
			style="
        width: calc(calc({colWidth}%));
        left: calc({xPos}%);
        top: calc({$yGet(d)}% - 30px);
      "
		>
			<div class="group-label-text">
				{yValue}
			</div>
		</div>
	{/each}
</div>

<style>
	.group-rect {
		position: absolute;
	}

	.group-label {
		position: absolute;
		height: 40px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.group-label-text {
		padding: 2px 5px;
	}
</style>
