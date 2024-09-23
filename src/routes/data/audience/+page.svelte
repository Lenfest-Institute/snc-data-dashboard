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
  <div></div>
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
    data={$filteredData
      .filter(d => {
        const value = d['Pct of Budget dedicated to Audience Development_VSQ2-5B'];
        return value !== '';
      }).map(d => {
        return {
          color: d['Is PubMedia?'],
          count: +d['Email Subscriber Size']
        }
      })
    }
  />
  <Chart
    type={'beeswarm'}
    title={'% of Budget dedicated to Marketing to help grow Audience_V27A'}
    x={'count'}
    z={'color'}
    data={$filteredData
      .filter(d => {
        const value = d['% of Budget dedicated to Marketing to help grow Audience_V27A'];
        return value !== '';
      })
      .map(d => {
        return {
          color: d['Is PubMedia?'],
          count: +d['% of Budget dedicated to Marketing to help grow Audience_V27A']
        };
    })}
  />
  <Chart
    type={'beeswarm'}
    title={'% of Budget dedicated to Audience Development_VSQ2-5B'}
    x={'count'}
    z={'color'}
    data={$filteredData
      .filter(d => {
        const value = d['% of Budget dedicated to Audience Development_VSQ2-5B'];
        return value !== '';
      })
      .map(d => {
        return {
          color: d['Is PubMedia?'],
          count: +d['% of Budget dedicated to Audience Development_VSQ2-5B']
        };
    })}
  />
</div>