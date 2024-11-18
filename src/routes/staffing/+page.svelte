<script>
    import * as d3 from 'd3';

    import { getContext } from 'svelte';
    import Chart from '../../components/Chart.svelte';
    import { convertToNumber, colorsCategorical } from '$lib/index';

    $: filteredData = getContext('filteredData');

    // Return an array of all the possible "Revenue Tier" values
    $: revenueTierKeys = [...new Set($filteredData.map(d => d['Revenue Tier']))]
        .filter(g => g !== 'NA')
        .sort((a, b) => convertToNumber(a) - convertToNumber(b));
</script>

<div class="charts__wrapper charts__staffing">
  <Chart
    type={'beeswarm'}
    title={'Total Editorial Staff'}
    x={'Editorial Staff (FTE)'}
    xLabel={'Number of staffers'}
    zDomain={revenueTierKeys}
    zRange={colorsCategorical}
    data={$filteredData.map(obj => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          const intValue = parseInt(value, 10);
          return [key, isNaN(intValue) ? value : intValue];
        })
      );
    })}
  />
  <Chart
    type={'beeswarm'}
    title={'Total Non-Editorial Staff'}
    x={'Non-editorial Staff (FTE)'}
    xLabel={'Number of staffers'}
    zDomain={revenueTierKeys}
    zRange={colorsCategorical}
    data={$filteredData.map(obj => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          const intValue = parseInt(value, 10);
          return [key, isNaN(intValue) ? value : intValue];
        })
      );
    })}
  />
  <Chart
    type={'column'}
    title={'Total Executive Staff'}
    x={'group'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xLabel={'Total number of executives'}
    yDomain={[0, null]}
    yLabel={'Number of outlets'}
    data={d3.rollups(
        $filteredData,
        v => v.length,
        d => +d['Total number of Execs']
    ).map(([key, value]) => ({
        group: key,
        count: value
    }))}
  />
</div>