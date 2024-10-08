<script>
	import * as d3 from 'd3';
	import { LayerCake, ScaledSvg, Svg, Html } from 'layercake';

	import Line from './Line.svelte';
	import Area from './Area.svelte';
	import Scatter from './Scatter.svelte';
	import Beeswarm from './Beeswarm.svelte';
	import BarStacked from './BarStacked.svelte';
	import Column from './Column.svelte';
	import ProportionBar from './ProportionBar.svelte';
	import Labels from './Labels.svelte';
	import Legend from './Legend.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import { default as ClevelandDotPlot } from './ClevelandDotPlot.svelte';

	export let isWide = false;

	export let data = [];
	export let title;
	export let type;
	export let x;
	export let y;
	export let z;

	export let xScale;
	export let xDomain;
	export let yDomain;
	export let yScale;
	export let padding;
	export let xLabel;
	export let yLabel;

	$: yDomainCustom = yDomain || d3.extent(data, (d) => +d[y]);

	$: paddingCustom = padding || {
		top: 10,
		right: 20,
		bottom: 40,
		left: (type === 'beeswarm' ? 0 : 45) + (yDomainCustom && yDomainCustom.length > 0 ? Math.round(yDomainCustom[1]).toString().length * 7 : 0)
	};
	export let zScale;
	export let zDomain;
	export let zRange;
	export let flatData;
	export let labels;

	const r = 6;	
	const fill = '#f95346';
	const stroke = '#f95346';
	const strokeWidth = 0.25;
</script>

<div class={`charts__chart-container ${isWide ? 'charts__chart-container-wide' : ''}`}>
	<h2>
		{title}
	</h2>
	<div class={`charts__chart charts__type-${type}`}>
		<LayerCake
			let:width
			debug={false}
			ssr
			percentRange
			padding={type === 'proportionbar' ? { top: 0, right: 0, bottom: 20, left: 0 } : paddingCustom}
			{x}
			{y}
			{z}
			{xScale}
			{xLabel}
			{yScale}
			{xDomain}
			yDomain={yDomainCustom}
			{yLabel}
			{zScale}
			{zDomain}
			{zRange}
			{flatData}
			{data}
		>
			{#if type === 'beeswarm'}
				<Html>
					<AxisX snapLabels ticks={5} axisLabel={xLabel} />
					<Beeswarm {r} {fill} {stroke} {strokeWidth} />
				</Html>
			{:else if type === 'scatter'}
				<Html>
					<AxisX rotate={-45} axisLabel={xLabel} />
					<AxisY axisLabel={yLabel} gridlines={false}  />
					<Legend labels={x} colors={zRange} />
					<Scatter {r} {fill} {stroke} {strokeWidth} />
				</Html>
			{:else if type === 'column'}
				<Html>
					<AxisX type={type} gridlines={false} axisLabel={xLabel}  />
					<AxisY axisLabel={yLabel} {width} />
				</Html>
				<ScaledSvg>
					<Column />
				</ScaledSvg>
			{:else if type === 'dotplot'}
				<Html>
					<AxisX />
					<AxisY gridlines={false} />
					<ClevelandDotPlot />
				</Html>
			{:else if type === 'proportionbar'}
				<Html>
					<Legend labels={zDomain} colors={zRange} chartType={type} />
				</Html>
				<ScaledSvg fixedAspectRatio={8/1}>
					<ProportionBar {width} {zDomain} {zRange} />
				</ScaledSvg>
			{:else if type === 'barstacked'}
    <Html>
      <AxisX baseline snapLabels axisLabel={xLabel}  />
      <AxisY gridlines={false} axisLabel={yLabel} />
			<Legend labels={zDomain} colors={zRange} />
    </Html>
    <ScaledSvg>
      <BarStacked />
    </ScaledSvg>
			{:else if type === 'linearea'}
				<Html>
					<AxisX axisLabel={xLabel}  />
					<AxisY axisLabel={yLabel}  />
				</Html>
				<ScaledSvg>
					<Line />
					<Area />
				</ScaledSvg>
			{/if}
		</LayerCake>
	</div>
</div>
