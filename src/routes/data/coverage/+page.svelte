<script>
  import { getContext } from 'svelte';
  import Chart from '../../../components/Chart.svelte';

  $: filteredData = getContext('filteredData');
	const user = getContext('user');
</script>

<div class="charts__wrapper charts__coverage">
  <Chart
    type={'scatter'}
    title={'Coverage'}
    x={'Stories Produced per Month'}
    y={'Web Traffic (AMUs)'}
    data={$filteredData.filter(d => {
      const stories = parseInt(d["Stories Produced per Month"], 10);
      return stories > 0;
    })}
  />
  <Chart
    type={'linearea'}
    title={'Coverage'}
    x={'Launch Year'}
    y={'Stories Produced per Month'}
    data={$filteredData.filter(d => {
      const stories = parseInt(d["Stories Produced per Month"], 10);
      return stories > 0;
    }).sort((a, b) => {
        return a["Launch Year"] - b["Launch Year"];
    })}
  />
</div>