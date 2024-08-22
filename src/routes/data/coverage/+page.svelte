<script>
  import { getContext } from 'svelte';
  import * as d3 from 'd3';
  import { LayerCake, ScaledSvg, Html } from 'layercake';
  import Chart from '../../../components/Chart.svelte';

  const xKey = 'year';
  const yKey = 'value';

  export let data;
  const rawdata = data.props.rawdata;
	const audience = getContext('audience');
  
  const formattedData2 = Array.from({ length: 10 }, (_, i) => ({
    year: 2000 + (i * 2),
    value: Math.random() * 10
  }));

  formattedData2.forEach(d => {
    d[yKey] = +d[yKey];
  });
</script>

<p>Active Option: {$audience}</p>

<div class="charts__wrapper charts__coverage">
  <Chart
    type={'scatter'}
    title={'Coverage'}
    x={'Stories Produced per Month'}
    y={'Web Traffic (AMUs)'}
    data={rawdata.filter(d => {
      const stories = parseInt(d["Stories Produced per Month"], 10);
      return stories > 0;
    })}
  />
  <Chart
    type={'linearea'}
    title={'Coverage'}
    data={formattedData2}
    x={xKey}
    y={yKey}
  />
  <!-- <div class="charts__chart-container">
    <h2>
      Data Source 1
    </h2>
    <div class="charts__chart">
      <LayerCake
        ssr
        percentRange
        padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
        x={xKey}
        y={yKey}
        xDomain={[1979, 1997]}
        yDomain={[0, 10]}
        data={formattedData}
      >
        <Html>
          <AxisX />
          <AxisY ticks={10} />
          <Scatter  {r} {fill} {stroke} {strokeWidth} />
        </Html>
      </LayerCake>
    </div>
  </div>
  <div class="charts__chart-container">
    <h2>
      Data Source 2
    </h2>
    <div class="charts__chart">
      <LayerCake
        ssr
        percentRange
        padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
        x={xKey}
        y={yKey}
        xDomain={[1979, 1997]}
        yDomain={[0, 10]}
        data={formattedData2}
      >
        <Html>
          <AxisX />
          <AxisY ticks={10} />
        </Html>
        <ScaledSvg>
          <Line />
          <Area />
        </ScaledSvg>
      </LayerCake>
    </div>
  </div> -->
</div>