<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
	import Chart from '../../../components/Chart.svelte';
	$: filteredData = getContext('filteredData');

	$: focusData = $filteredData.reduce((acc, row) => {
		const hasPrimaryFocus = row["Is serving POC primary focus?"] === "Yes";
		const hasCorePriority = row["Is serving POC one of Core Priorities?"] === "Yes";

		if (hasPrimaryFocus) {
			acc.find(d => d.label === '...a primary focus?').value++;
		} 
		if (hasCorePriority) {
			acc.find(d => d.label === '...a core priority?').value++;
		} 
		if (!hasPrimaryFocus && !hasCorePriority) {
			acc.find(d => d.label === '...not an official focus').value++;
		}

		return acc;
	}, [
		{ label: '...a primary focus?', value: 0 },
		{ label: '...a core priority?', value: 0 },
		{ label: '...not an official focus', value: 0 }
	]);

	 $: execBIPOCData = Array.from(
		d3.rollup(
  		$filteredData,
			v => v.length,
			d => d["Is BIPOC Led?"]
		),
		([key, value]) => ({
			group: key,
			count: value
		})
	)
  .filter(item => item.group === 'YES' || item.group === 'NO')
  .sort((a, b) => (a.group === 'YES' ? -1 : 1));

	 $: execWomenData = Array.from(
		d3.rollup(
  		$filteredData,
			v => v.length,
			d => d["Is Women Led?"]
		),
		([key, value]) => ({
			group: key,
			count: value
		})
	)
  .filter(item => item.group === 'YES' || item.group === 'NO')
  .sort((a, b) => (a.group === 'YES' ? -1 : 1));


</script>

<div class="charts__wrapper charts__diversity">
	<Chart
    type={'proportionbar'}
    title={'Proportion of POC leaders'}
    paddingCustom={{ top: 0, right: 0, bottom: 20, left: 35 }}
		labels={['POC-Led', 'Not POC-Led']}
    data={execBIPOCData}
	/>
	<Chart
    type={'proportionbar'}
    title={'Proportion of Women leaders'}
    paddingCustom={{ top: 0, right: 0, bottom: 20, left: 35 }}
		labels={['Women-Led', 'Not Women-Led']}
    data={execWomenData}
	/>
	<Chart
		type={'column'}
		title={'Is serving communities of color...'}
    paddingCustom={{ top: 0, right: 10, bottom: 40, left: 10 }}
		x={'label'}
		y={'value'}
		xScale={d3.scaleBand().paddingInner(0.1).round(true)}
		xDomain={[...new Set(focusData.map((d) => d.label))]}
		yDomain={[0, null]}
		data={focusData}
	/>
</div>
