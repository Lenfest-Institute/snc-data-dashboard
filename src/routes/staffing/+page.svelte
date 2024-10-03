<script>
    import * as d3 from 'd3';

    import { getContext } from 'svelte';
    import Chart from '../../components/Chart.svelte';

    $: filteredData = getContext('filteredData');
</script>

<div class="charts__wrapper charts__staffing">
  <Chart
    type={'beeswarm'}
    title={'Total Editorial Staff'}
    x={'count'}
    xLabel={'Number of staffers'}
    z={'color'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Editorial Staff (FTE)']
      };
    })}
  />
  <Chart
    type={'beeswarm'}
    title={'Total Non-Editorial Staff'}
    x={'count'}
    xLabel={'Number of staffers'}
    z={'color'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Non-editorial Staff (FTE)']
      };
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