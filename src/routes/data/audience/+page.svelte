<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
  import { flatten } from 'layercake';
	import Chart from '../../../components/Chart.svelte';
    import { convertToNumber } from '$lib/index';
	$: filteredData = getContext('filteredData');

  $: targetAudienceData = d3.rollups(
      $filteredData,
      v => v.length,
      d => d['Target Audience Size']
  ).map(([key, value]) => ({
      group: key,
      count: value
  }));

  // Testing Stack Bar 
  const socialPlatforms = ['Facebook', 'X', 'LinkedIn', 'TikTok', 'Instagram', 'YouTube'];
  const socialOptions = ['Always (every day)', 'Frequently (weekly)', 'Sometimes (monthly)', 'Infrequently (less than once a month)', 'Never'];

  // Transform data using d3.rollups
  $: socialData = socialPlatforms.map(platform => {
    // Use d3.rollups to group and count occurrences of each response option for this platform
    const counts = d3.rollups(
      $filteredData,
      v => v.length, // Counting occurrences
      d => d[`V23B ${platform}`] // Group by the response in the corresponding platform key
    );

    // Convert the rollup result into an object
    const platformData = {
      "platform": platform.replace("V23B ", ""), // Remove prefix for cleaner output
    };

    // Initialize counts for all response options
    socialOptions.forEach(option => {
      platformData[option] = 0;
    });

    // Populate the counts for each response option
    counts.forEach(([key, count]) => {
      if (key) {
        platformData[key] = count;
      }
    });

    return platformData;
  });

  const fruitdata = [
  {
    "year": 2019,
    "apples": 3840,
    "bananas": 1920,
    "cherries": 960,
    "dates": 400
  },
  {
    "year": 2018,
    "apples": 1600,
    "bananas": 1440,
    "cherries": 960,
    "dates": 400
  },
  {
    "year": 2017,
    "apples": 820,
    "bananas": 1000,
    "cherries": 640,
    "dates": 400
  },
  {
    "year": 2016,
    "apples": 820,
    "bananas": 560,
    "cherries": 720,
    "dates": 400
  }
]

  const xKey = 'platform';
  const yKey = [0, 1];
  const zKey = 'key';
  const seriesColors = ["#F95346", "#F99186", "#F9D1C6", "#58b2af", "#C6EFED"];

  $: stackData = d3.stack().keys(socialOptions);

  $: series = stackData(socialData);

  $: console.log(series);
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
  <Chart
    type={'barstacked'}
    title={'Social Platforms Outlook'}
    paddingCustom={{ top: 0, right: 35, bottom: 20, left: 60 }}
    y={d => d.data?.[xKey]}
    x={yKey}
    z={zKey}
    yScale={d3.scaleBand().paddingInner(0.05).round(true)}
    yDomain={socialPlatforms}
    zScale={d3.scaleOrdinal()}
    zDomain={socialOptions}
    zRange={seriesColors}
    flatData={flatten(series)}
    data={series}
  />
</div>