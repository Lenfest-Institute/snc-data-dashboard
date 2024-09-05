<script>
      import * as d3 from 'd3';

  import { getContext } from 'svelte';
  import Chart from '../../../components/Chart.svelte';

  $: filteredData = getContext('filteredData');
	const user = getContext('user');

    // Count occurrences of each 'Revenue Tier'
    $: revenueTierData = d3.rollups(
        $filteredData,
        v => v.length,  // function to count occurrences
        d => d['Revenue Tier']  // group by 'revenueTier'
    ).map(([key, value]) => ({
        revenueTier: key,
        count: value
    }));

    // $: console.log(revenueTierData);
</script>

<div class="charts__wrapper charts__revenue">
  <Chart
    type={'column'}
    title={'Revenue'}
    x={'revenueTier'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(revenueTierData.map(d => d.revenueTier))]}
    yDomain={[0, null]}
    data={revenueTierData}
  />
  <!-- <Chart
    type={'scatter'}
    title={'Monthly Stories by Launch Year'}
    x={'Launch Year'}
    y={'Stories Produced per Month'}
    data={$filteredData.filter(d => {
      const stories = parseInt(d["Stories Produced per Month"], 10);
      return stories > 0;
    }).sort((a, b) => {
        return a["Launch Year"] - b["Launch Year"];
    })}
  /> -->
</div>