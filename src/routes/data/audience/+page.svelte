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

  function formatDataForBeeswarm(variable) {
    return $filteredData.map((d, i) => {
      return {
        index: i,
        color: d['Is PubMedia?'],
        count: +d[variable]
      };
    });
  }

  $: formattedDataWeb = formatDataForBeeswarm('Web Traffic (AMUs)');
  $: formattedDataEmail = formatDataForBeeswarm('Email Subscriber Size');
</script>

<div class="charts__wrapper charts__audience">
  <!-- <Chart
    type={'column'}
    title={'Target Audience Size'}
    x={'group'}
    y={'count'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(targetAudienceData.map(d => d.group))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yDomain={[0, null]}
    data={targetAudienceData}
  /> -->
  <Chart
    type={'beeswarm'}
    title={'Web Traffic (AMUs)'}
    x={'count'}
    z={'color'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Web Traffic (AMUs)']
      };
    })}
  />
  <Chart
    type={'beeswarm'}
    title={'Email Subscriber Size'}
    x={'count'}
    z={'color'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Email Subscriber Size']
      };
    })}
  <!-- />
  <!-- <Chart
    type={'scatter'}
    title={'Web Traffic (AMUs)'}
    x={'count'}
    y={'index'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Web Traffic (AMUs)']
      };
    })}
  /> -->
  <Chart
    type={'scatter'}
    title={'Email Subscriber Size'}
    x={'count'}
    y={'index'}
    data={$filteredData.map(d => {
      return {
        color: d['Is PubMedia?'],
        count: +d['Email Subscriber Size']
      };
    })}
  /> -->
</div>