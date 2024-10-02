<script>
  import { getContext } from 'svelte';
  import * as d3 from 'd3';

  const { xScale, percentRange } = getContext('LayerCake');

  export let labels; // Array of labels for the chart segments
  export let colors;

  $: colorScale = d3.scaleOrdinal().range(colors); // D3 color scale

  let legendItems = [];

  // Create an array of legend items with color and label
  $: legendItems = labels.map((label, i) => ({
    label,
    color: colorScale(label)
  }));
</script>

<style>
  .legend-container {
    display: flex;
    flex-direction: row;
    position:absolute;
    bottom: -4rem;
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
    margin-right: 8px;
  }
</style>

<div class="legend-container">
  {#each legendItems as item}
    <div class="legend-item">
      <div
        class="color-box"
        style="background-color: {item.color};"
      ></div>
      <div>{item.label}</div>
    </div>
  {/each}
</div>
