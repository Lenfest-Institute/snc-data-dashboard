<script>
  import { LayerCake, ScaledSvg, Html } from 'layercake';
  import Chart from '../../../components/Chart.svelte';

  const xKey = 'year';
  const yKey = 'value';

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
</script>

<div class="charts__wrapper charts__coverage">
  <Chart
    type={'scatter'}
    title={'Coverage'}
    data={formattedData}
    xKey={xKey}
    yKey={yKey}
  />
  <Chart
    type={'linearea'}
    title={'Coverage'}
    data={formattedData2}
    xKey={xKey}
    yKey={yKey}
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