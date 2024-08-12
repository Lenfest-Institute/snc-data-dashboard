<script>
  import { LayerCake, Svg } from 'layercake';

  import Line from '../../../components/Line.svelte';
  import Area from '../../../components/Area.svelte';
  import AxisX from '../../../components/AxisX.svelte';
  import AxisY from '../../../components/AxisY.svelte';

  export let data = [];
  // create a JSON array of dummy data where each object has a 'year' and 'value' key, and there are 10 objects
  const formattedData = Array.from({ length: 10 }, (_, i) => ({
    year: 1979 + (i * 2),
    value: Math.random() * 10
  }));

  const xKey = 'year';
  const yKey = 'value';


    console.log(formattedData);

  formattedData.forEach(d => {
    d[yKey] = +d[yKey];
  
  });
</script>

<div class="chart-container charts__coverage">
  <LayerCake
    padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
    x={xKey}
    y={yKey}
    xDomain={[1979, 1997]}
    yDomain={[0, 10]}
    data={formattedData}
  >
    <Svg>
      <AxisX />
      <AxisY ticks={10} />
      <Line />
      <Area />
    </Svg>
  </LayerCake>
</div>

<style>
  /*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
  .chart-container {
    width: 100%;
    height: 250px;
  }
</style>