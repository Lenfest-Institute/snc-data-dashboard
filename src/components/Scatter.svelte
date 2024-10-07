<!--
  @component
  Generates an HTML scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
  import { getContext } from 'svelte';

  const { data, xGet, yGet, xScale, yScale, zRange, x } = getContext('LayerCake');

  /** @type {Number} [r=5] - The circle's radius. */
  export let r = 10;

  /** @type {String} [fill='#f95346'] - The circle's fill color. */
  export let fill = '#f95346';

  /** @type {String} [stroke='#000'] - The circle's stroke color. */
  export let stroke = '#000';

  /** @type {Number} [strokeWidth=1] - The circle's stroke width. */
  export let strokeWidth = 1; 

  /** @type {String} [yVal=''] - Optional Y-val override. */
  export let yVal;
</script>

<div class="scatter-group">
  {#each $data as d}
    {#if typeof $xGet(d) === 'object'}
      {#each $xGet(d) as dx, i}
        <div
          class="circle"
          style="
            left: {dx + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}%;
            top: {(yVal ? $yScale(d[yVal]) : $yGet(d)) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}%;
            width: {r * 2}px;
            height: {r * 2}px;
            background-color: {$zRange[i]};
            border: {strokeWidth}px solid {$zRange[i]};
          "
        ></div>
        <!-- draw a line that connects this circle with the previous one -->
        {#if i < 0}
          <div
            class="line"
            style="
              left: {dx + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}%;
              top: {(yVal ? $yScale(d[yVal]) : $yGet(d)) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}%;
              width: {dx - $xGet(d)[i - 1]}%;
              height: 0;
              border-bottom: {strokeWidth}px solid {$zRange[i]};
            "
          ></div>
        {/if}
      {/each}
    {:else}
      <div
        class="circle"
        style="
          left: {$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}%;
          top: {(yVal ? $yScale(d[yVal]) : $yGet(d)) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}%;
          width: {r * 2}px;
          height: {r * 2}px;
          background-color: {fill};
          border: {strokeWidth}px solid {stroke};
        "
      ></div>
    {/if}
  {/each}
</div>

<style>
  .circle {
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }

  .line {
    position: absolute;
  }
</style>