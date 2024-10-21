<script>
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
  import { flatten } from 'layercake';
	import Chart from '../../components/Chart.svelte';
    import { convertToNumber, colorsCategorical } from '$lib/index';
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
  $: series = d3.stack().keys(socialOptions)(socialData);

</script>

<div class="charts__wrapper charts__audience">
 <Chart
    type={'column'}
    title={'Target Audience Size'}
    x={'group'}
    y={'count'}
    xLabel={'Size of target audience'}
    yLabel={'Number of outlets'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(targetAudienceData.map(d => d.group))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yDomain={[0, null]}
    data={targetAudienceData}
    isWide={true}
  />
  <Chart
    type={'beeswarm'}
    title={'Web Traffic'}
    x={'Web Traffic (AMUs)'}
    xLabel={'Average monthly users'}
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
    title={'Email Subscriber Size'}
    x={'Email Subscriber Size'}
    xLabel={'Number of subscribers'}
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
    title={'% of Budget Dedicated to Marketing to Help Grow Audience'}
    x={'% of Budget dedicated to Marketing to help grow Audience_V27A'}
    xLabel={'% of budget'}
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
    title={'% of Budget Dedicated to Audience Development'}
    x={'% of Budget dedicated to Audience Development_VSQ2-5B'}
    xLabel={'% of budget'}
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
    type={'barstacked'}
    title={'How Often Organizations Publish to Social Platforms'}
    padding={{ top: 0, right: 10, bottom: 70, left: 60 }}
    x={[0,1]}
    xLabel={'Posts per day'}
    y={d => d.data?.platform}
    yScale={d3.scaleBand().paddingInner(0.05).round(true)}
    yDomain={socialPlatforms}
    z={'key'}
    zScale={d3.scaleOrdinal()}
    zDomain={socialOptions}
    zRange={colorsCategorical}
    flatData={flatten(series)}
    data={series}
    isWide={true}
  />
</div>