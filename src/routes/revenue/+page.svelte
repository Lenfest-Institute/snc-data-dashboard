<script>
    import * as d3 from 'd3';
    import { getContext } from 'svelte';
    import Chart from '../../components/Chart.svelte';
    import { convertToNumber } from '$lib/index';
    $: filteredData = getContext('filteredData');

    $: revenueTierData = d3.rollups(
        $filteredData,
        v => v.length,
        d => d['Revenue Tier']
    ).map(([key, value]) => ({
        group: key,
        count: value
    }));
</script>

<div class="charts__wrapper charts__revenue">
  <Chart
    type={'column'}
    title={'Annual Revenue'}
    padding={{ top: 0, right: 10, bottom: 40, left: 10 }}
    x={'group'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(revenueTierData.map(d => d.group))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yDomain={[0, null]}
    data={revenueTierData}
  />

  <!-- <Chart
    type={'scatter'}
    title={'Small Donors vs. Revenue'}
    padding={{ top: 0, right: 10, bottom: 50, left: 50 }}
    x={'Individual Giving Revenue'}
    y={(d) => [d['Small Donations Revenue_VSQ2-1'], d['Mid-range Donations Revenue_VSQ2-1']]}
    data={$filteredData}
  /> -->
</div>