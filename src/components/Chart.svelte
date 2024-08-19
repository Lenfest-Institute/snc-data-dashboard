<script>
  import { LayerCake, ScaledSvg, Html } from 'layercake';

  import Line from './Line.svelte';
  import Area from './Area.svelte';
  import Scatter from './Scatter.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';

  export let data = [];
  export let title;
  export let type;
  export let x;
  export let y;
  export let xDomain;
  export let yDomain;

  console.log(xDomain);

  const r = 4.5;
  const padding = { top: 8, right: 10, bottom: 20, left: 25 };
  const fill = '#ed7014';
  const stroke = '#d16002';
  const strokeWidth = 1.5;
</script>


<div class="charts__chart-container">
    <h2>
      {title}
    </h2>
    <div class="charts__chart">
      <LayerCake
        ssr
        percentRange
        {padding}
        {x}
        {y}
        {xDomain}
        {yDomain}
        {data}
      >
        {#if type === 'scatter'}
          <Html>
            <AxisX />
            <AxisY ticks={10} />
            <Scatter  {r} {fill} {stroke} {strokeWidth} />
          </Html>
        {:else if type === 'linearea'}
          <Html>
            <AxisX />
            <AxisY ticks={10} />
          </Html>
          <ScaledSvg>
            <Line />
            <Area />
          </ScaledSvg>
        {/if}
      </LayerCake>
    </div>
  </div>