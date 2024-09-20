<script>
    import * as d3 from 'd3';
    import { getContext } from 'svelte';
    import Chart from '../../../components/Chart.svelte';
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
    x={'group'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(revenueTierData.map(d => d.group))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yDomain={[0, null]}
    data={revenueTierData}
  />
  <Chart
    type={'scatter'}
    title={'Foundation Revenue vs. Donor Revenue'}
    x={'Foundation Revenue_VSQ2-1'}
    y={'Web Traffic (AMUs)'}
    data={$filteredData.filter(d => {
      const processed = parseFloat(d["Foundation Revenue_VSQ2-1"].replace(/[^0-9.-]+/g, ""));
      return !isNaN(processed) && processed > 0;
    })}
  />
</div>