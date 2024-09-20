<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
	import Chart from '../../../components/Chart.svelte';
    import { convertToNumber } from '$lib/index';
	$: filteredData = getContext('filteredData');

    $: targetAudienceData = d3.rollups(
        $filteredData,
        v => v.length,  // function to count occurrences
        d => d['Target Audience Size']  // group by 'revenueTier'
    ).map(([key, value]) => ({
        group: key,
        count: value
    }));
</script>

<div class="charts__wrapper charts__audience">
  <Chart
    type={'column'}
    title={'Target Audience Size'}
    x={'group'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(targetAudienceData.map(d => d.group))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yDomain={[0, null]}
    data={targetAudienceData}
  />

</div>