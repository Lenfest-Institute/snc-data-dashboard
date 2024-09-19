<script>
    import * as d3 from 'd3';
    import { getContext } from 'svelte';
    import Chart from '../../../components/Chart.svelte';
    $: filteredData = getContext('filteredData');

    // Count occurrences of each 'Revenue Tier'
    $: revenueTierData = d3.rollups(
        $filteredData,
        v => v.length,  // function to count occurrences
        d => d['Revenue Tier']  // group by 'revenueTier'
    ).map(([key, value]) => ({
        revenueTier: key,
        count: value
    }));
</script>

<div class="charts__wrapper charts__revenue">
  <Chart
    type={'column'}
    title={'Annual Revenue'}
    x={'revenueTier'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(revenueTierData.map(d => d.revenueTier))]}
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