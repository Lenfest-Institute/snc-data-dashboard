<script>
  import * as d3 from 'd3';
  import { LayerCake, ScaledSvg, Html } from 'layercake';
  import Chart from '../../../components/Chart.svelte';

  const xKey = 'year';
  const yKey = 'value';

  export let data;

  const formattedData = Array.from({ length: 10 }, (_, i) => ({
    year: 1979 + (i * 2),
    value: Math.random() * 10
  }));

  formattedData.forEach(d => {
    d[yKey] = +d[yKey];
  });

  const formattedData2 = Array.from({ length: 10 }, (_, i) => ({
    year: 1979 + (i * 2),
    value: Math.random() * 10
  }));

  formattedData2.forEach(d => {
    d[yKey] = +d[yKey];
  });

  const rawdata = data.props.rawdata;
  const data1 = rawdata.filter(d => {
    const stories = parseInt(d["Stories Produced per Month"], 10);
    return stories > 0;
  });
  console.log(data1.map(d => d["Stories Produced per Month"]));
</script>

<div class="charts__wrapper charts__coverage">
  <Chart
    type={'scatter'}
    title={'Coverage'}
    data={data1}
    x={'Stories Produced per Month'}
    y={'Web Traffic (AMUs)'}
    xDomain={d3.extent(data1, d => +d["Stories Produced per Month"])}
    yDomain={d3.extent(data1, d => +d["Web Traffic (AMUs)"])}
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