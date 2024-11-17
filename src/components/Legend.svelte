<script>
  import { getContext } from 'svelte';
  import * as d3 from 'd3';

  const { xScale, percentRange, padding } = getContext('LayerCake');

  export let labels; // Array of labels for the chart segments
  export let colors;
  export let chartType;

  $: colorScale = d3.scaleOrdinal().range(colors); // D3 color scale

  let legendItems = [];

  // Create an array of legend items with color and label
  $: legendItems = labels.map((label, i) => ({
    label,
    color: colorScale(label)
  }));
</script>

<div class="legend-container" style="left: -{$padding.left}px; bottom: -{$padding.bottom}px;">
  {#each legendItems as item}
    <div class="legend-item">
      <div
        class="color-box"
        style="background-color: {item.color};"
      ></div>
      <div class="color-label-text">{item.label}</div>
    </div>
  {/each}
</div>

<style>
  .legend-container {
    display: flex;
    flex-direction: row;
    position: absolute;
    border: 1px solid #ccc;
    padding: 5px 5px 0;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    margin-right: 16px;
    font-size: 13px;
  }
  .color-box {
    width: 16px;
    height: 16px;
    margin-right: 2px;
  }
  .color-label-text {
    font-size: 11px;
    line-height: 11px;
  }
</style>
