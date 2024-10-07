<script>
    import * as d3 from 'd3';
    import { getContext } from 'svelte';
    import Chart from '../../components/Chart.svelte';
    import { convertToNumber } from '$lib/index';
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
        'Rev. from Major Donors': d3.mean(v, d => d['Major Donations Revenue_VSQ2-1'])
      }),
      d => d['Revenue Tier']
    ).map(([tier, averages]) => ({
      tier,
      ...averages
    }));

    $: console.log(donorSizeData);
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

  <Chart
    type={'scatter'}
    title={'Average Revenue By Donor Group'}
    padding={{ top: 0, right: 10, bottom: 50, left: 120 }}
    x={['Rev. from Small Donors', 'Rev. from Mid-range Donors', 'Rev. from Major Donors']}
    y={'tier'}
    yDomain={[...new Set(donorSizeData.map(d => d.tier))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yScale={d3.scaleBand().paddingInner(0.1).round(true)}
    zRange={["#F95346", "#58B2AF", "#757083"]}
    data={donorSizeData}
  />  
  <Chart
    type={'scatter'}
    title={'Average Number of Donors By Donor Group'}
    padding={{ top: 0, right: 10, bottom: 50, left: 120 }}
    x={['small', 'mid', 'major']}
    y={'tier'}
    yDomain={[...new Set(donorSizeData.map(d => d.tier))].sort((a, b) => convertToNumber(a) - convertToNumber(b))}
    yScale={d3.scaleBand().paddingInner(0.1).round(true)}
    zRange={["#F95346", "#58B2AF", "#757083"]}
    data={donorSizeData}
  />
</div>