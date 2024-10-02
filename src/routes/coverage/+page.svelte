<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
	import Chart from '../../components/Chart.svelte';
	import { convertToNumber, filterOptionsFocus, filterOptionsPriority } from '$lib/index';

	$: filteredData = getContext('filteredData');

	const focusScale = d3
		.scaleOrdinal()
		.domain(filterOptionsFocus.map((d) => d.value))
		.range(filterOptionsFocus.map((d) => d.label));

	$: focusData = d3
		.rollups(
			$filteredData,
			(v) => v.length,
			(d) => d['Primary Editorial Focus']
		)
		.map(([key, value]) => ({
			group: focusScale(key),
			count: value
		}));

	const coveragePriorityScale = d3
		.scaleOrdinal()
		.domain(filterOptionsPriority.map((d) => d.value))
		.range(filterOptionsPriority.map((d) => d.label));

	$: coveragePriorityData = d3
		.rollups(
			$filteredData,
			(v) => v.length,
			(d) => d['Coverage Priority']
		)
		.map(([key, value]) => ({
			group: coveragePriorityScale(key),
			count: value
		}));
</script>

<div class="charts__wrapper charts__coverage">
	<Chart
		type={'column'}
		title={'Primary Editorial Focus'}
		padding={{ top: 0, right: 10, bottom: 40, left: 40 }}
		x={'group'}
		y={'count'}
		xScale={d3.scaleBand().paddingInner(0.1).round(true)}
		xDomain={[...new Set(focusData.map((d) => d.group))].sort(
			(a, b) => convertToNumber(a) - convertToNumber(b)
		)}
		yDomain={[0, null]}
		yLabel={'Count of organizations'}
		data={focusData}
	/>
	<Chart
		type={'column'}
		title={'Coverage Priority'}
		padding={{ top: 0, right: 10, bottom: 40, left: 40 }}
		x={'group'}
		y={'count'}
		xScale={d3.scaleBand().paddingInner(0.1).round(true)}
		xDomain={[...new Set(coveragePriorityData.map((d) => d.group))].sort(
			(a, b) => convertToNumber(a) - convertToNumber(b)
		)}
		yDomain={[0, null]}
		yLabel={'Count of organizations'}
		data={coveragePriorityData}
	/>
</div>
