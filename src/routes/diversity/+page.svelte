<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
	import Chart from '../../components/Chart.svelte';
	$: filteredData = getContext('filteredData');

	$: focusData = $filteredData.reduce(
		(acc, row) => {
			const hasPrimaryFocus = row['Is serving POC primary focus?'] === 'Yes';
			const hasCorePriority = row['Is serving POC one of Core Priorities?'] === 'Yes';

			if (hasPrimaryFocus) {
				acc.find((d) => d.label === '...a primary focus?').value++;
			}
			if (hasCorePriority) {
				acc.find((d) => d.label === '...a core priority?').value++;
			}
			if (!hasPrimaryFocus && !hasCorePriority) {
				acc.find((d) => d.label === '...not an official focus').value++;
			}

			return acc;
		},
		[
			{ label: '...a primary focus?', value: 0 },
			{ label: '...a core priority?', value: 0 },
			{ label: '...not an official focus', value: 0 }
		]
	);

	$: execBIPOCData = Array.from(
		d3.rollup(
			$filteredData,
			(v) => v.length,
			(d) => d['Is BIPOC Led?']
		),
		([key, value]) => ({
			group: key,
			count: value
		})
	)
		.filter((item) => item.group === 'YES' || item.group === 'NO')
		.sort((a, b) => (a.group === 'YES' ? -1 : 1));

	$: execWomenData = Array.from(
		d3.rollup(
			$filteredData,
			(v) => v.length,
			(d) => d['Is Women Led?']
		),
		([key, value]) => ({
			group: key,
			count: value
		})
	)
		.filter((item) => item.group === 'YES' || item.group === 'NO')
		.sort((a, b) => (a.group === 'YES' ? -1 : 1));
</script>

<div class="charts__wrapper charts__diversity">
	<Chart
		type={'proportionbar'}
		title={'Organizations with POC leaders'}
		zDomain={['POC-Led', 'Not POC-Led']}
		zRange={['#f95346', '#cccccc']}
		data={execBIPOCData}
	/>
	<Chart
		type={'proportionbar'}
		title={'Organizations with Women leaders'}
		zDomain={['Women-Led', 'Not Women-Led']}
		zRange={['#f95346', '#cccccc']}
		data={execWomenData}
	/>
	<Chart
		type={'column'}
		title={'Is serving communities of color...'}
		x={'label'}
		y={'value'}
		yLabel={'Number of outlets'}
		xScale={d3.scaleBand().paddingInner(0.1).round(true)}
		xDomain={[...new Set(focusData.map((d) => d.label))]}
		yDomain={[0, null]}
		data={focusData}
	/>
</div>
