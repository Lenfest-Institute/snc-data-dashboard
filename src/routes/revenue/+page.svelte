<script>
    import * as d3 from 'd3';
    import { getContext } from 'svelte';
  import { flatten } from 'layercake';
    import Chart from '../../components/Chart.svelte';
    import { convertToNumber, colorsCategorical } from '$lib/index';
    $: filteredData = getContext('filteredData');

    $: revenueTierData = d3.rollups(
        $filteredData,
        v => v.length,
        d => d['Revenue Tier']
    ).map(([key, value]) => ({
        group: key,
        count: value
    }));

    $: donorSizeData = d3.rollups(
      $filteredData.filter(d => d['Revenue Tier'] !== 'NA'),
      v => ({
        'Rev. from Small Donors': d3.mean(v, d => d['Small Donations Revenue_VSQ2-1']),
        'Rev. from Mid-range Donors': d3.mean(v, d => d['Mid-range Donations Revenue_VSQ2-1']),
        'Rev. from Major Donors': d3.mean(v, d => d['Major Donations Revenue_VSQ2-1']),
        'Small Donors': d3.mean(v, d => d['Number of Small Donors_VSQ2-4']),
        'Mid-range Donors': d3.mean(v, d => d['Number of Mid-range Donors_VSQ2-4']),
        'Major Donors': d3.mean(v, d => d['Number of Major Donors_VSQ2-4']),
      }),
      d => d['Revenue Tier']
    ).map(([tier, averages]) => ({
      tier,
      ...averages
    }));

    $: donorSizeDataRevenue = donorSizeData.map(d => ({
      tier: d.tier,
      'Rev. from Small Donors': d['Rev. from Small Donors'],
      'Rev. from Mid-range Donors': d['Rev. from Mid-range Donors'],
      'Rev. from Major Donors': d['Rev. from Major Donors'],
    }));

    $: donorSizeDataCount = donorSizeData.map(d => ({
      tier: d.tier,
      'Small Donors': d['Small Donors'],
      'Mid-range Donors': d['Mid-range Donors'],
      'Major Donors': d['Major Donors'],
    }));

    $: donorSizeDataKeys = [...new Set(donorSizeData.map(d => d.tier))].sort((a, b) => convertToNumber(a) - convertToNumber(b));


    $: console.log(donorSizeDataKeys);
    $: console.log(['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors']);
    $: console.log(d3.stack().keys(['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors'])(donorSizeDataRevenue));
</script>

<div class="charts__wrapper charts__revenue">
  <Chart
    isWide
    type={'column'}
    title={'Annual Revenue'}
    padding={{ top: 0, right: 10, bottom: 60, left: 40 }}
    x={'group'}
    y={'count'}
    xLabel={'Total revenue for CY2023'}
    yLabel={'Number of outlets'}
    xScale={d3.scaleBand().paddingInner(0.1).round(true)}
    xDomain={[...new Set(revenueTierData.map(d => d.group))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yDomain={[0, null]}
    data={revenueTierData}
  />

  <!-- <Chart
    type={'scatter'}
    title={'Average Revenue By Donor Group'}
    padding={{ top: 0, right: 10, bottom: 50, left: 120 }}
    x={['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors']}
    y={'tier'}
    yDomain={donorSizeDataKeys}
    yScale={d3.scaleBand().paddingInner(0.1).round(true)}
    zRange={["#F95346", "#58B2AF", "#757083"]}
    data={donorSizeData}
  />   -->
  <Chart
    type={'barstacked'}
    title={'Average Revenue By Donor Group'}
    padding={{ top: 0, right: 10, bottom: 70, left: 120 }}
    x={[0,1]}
    xLabel={'Average'}
    y={d => d.data?.tier}
    yScale={d3.scaleBand().paddingInner(0.05).round(true)}
    yDomain={donorSizeDataKeys}
    z={'key'}
    zScale={d3.scaleOrdinal()}
    zDomain={['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors']}
    zRange={colorsCategorical}
    flatData={flatten(d3.stack().keys(['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors'])(donorSizeDataRevenue))}
    data={d3.stack().keys(['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors'])(donorSizeDataRevenue)}
    isWide={true}
  />
  <Chart
    type={'barstacked'}
    title={'Average Number of Donors By Donor Group'}
    padding={{ top: 0, right: 10, bottom: 70, left: 120 }}
    x={[0,1]}
    xLabel={'Average'}
    y={d => d.data?.tier}
    yScale={d3.scaleBand().paddingInner(0.05).round(true)}
    yDomain={donorSizeDataKeys}
    z={'key'}
    zScale={d3.scaleOrdinal()}
    zDomain={['Small Donors', 'Mid-range Donors', 'Major Donors']}
    zRange={colorsCategorical}
    flatData={flatten(d3.stack().keys(['Small Donors', 'Mid-range Donors', 'Major Donors'])(donorSizeDataCount))}
    data={d3.stack().keys(['Small Donors', 'Mid-range Donors', 'Major Donors'])(donorSizeDataCount)}
    isWide={true}
  />
</div>