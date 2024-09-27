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
    z={'color'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Non-editorial Staff (FTE)']
      };
    })}
    />
</div>