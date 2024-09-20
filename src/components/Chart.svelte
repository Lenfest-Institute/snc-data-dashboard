<script>
	import * as d3 from 'd3';
	import { LayerCake, ScaledSvg, Html } from 'layercake';

	import Line from './Line.svelte';
	import Area from './Area.svelte';
	import Scatter from './Scatter.svelte';
	import Column from './Column.svelte';
	import StackBar from './StackBar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	export let data = [];
	export let title;
	export let type;
	export let x;
	export let y;
	export let z;
	export let width;

	export let xScale;
	export let xDomain;
	export let yDomain = d3.extent(data, (d) => +d[y]);
	$: padding = {
		top: 8,
		right: 10,
		bottom: 20,
		left: 5 + (yDomain && yDomain.length > 0 ? Math.round(yDomain[1]).toString().length * 7 : 0)
	};
	export let zScale;
	export let zDomain;
	export let zRange;
	export let flatData;
	export let labels;

	const r = 4.5;
	const fill = '#ed7014';
	const stroke = '#d16002';
	const strokeWidth = 1.5;
</script>

<div class="charts__chart-container">
	<h2>
		{title}
	</h2>
	<div class="charts__chart">
		<LayerCake
			let:width
			debug
			ssr
			percentRange
			padding={type === 'stackbar' ? { top: 0, right: 0, bottom: 20, left: 0 } : padding}
			{x}
			{y}
			{z}
			{xScale}
			{xDomain}
			{yDomain}
			{zScale}
			{zDomain}
			{zRange}
			{data}
		>
			{#if type === 'scatter'}
				<Html>
					<AxisX />
					<AxisY />
					<Scatter {r} {fill} {stroke} {strokeWidth} />
				</Html>
			{:else if type === 'column'}
				<Html>
					<AxisX type={type} />
					<AxisY />
				</Html>
				<ScaledSvg>
					<Column />
				</ScaledSvg>
			{:else if type === 'stackbar'}
				<Html>
					<AxisX baseline snapLabels />
				</Html>
				<ScaledSvg fixedAspectRatio={16 / 9}>
					<StackBar {width} {labels} />
				</ScaledSvg>
			{:else if type === 'linearea'}
				<Html>
					<AxisX />
					<AxisY />
				</Html>
				<ScaledSvg>
					<Line />
					<Area />
				</ScaledSvg>
			{/if}
		</LayerCake>
	</div>
</div>
