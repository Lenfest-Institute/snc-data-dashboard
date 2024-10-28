<script>
	import * as d3 from 'd3';
  import { getContext } from 'svelte';

  const { data, xGet, yGet, zGet } = getContext('LayerCake');

  export let zDomain;
  export let zRange;
  export let width;

  $: stackedData = $data.reduce((acc, item) => {
    const cumulativeCount = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].count : 0;
    acc.push({ ...item, offset: cumulativeCount });
    return acc;
  }, []);

  // // Create a scale for the x-axis based on the groups
  $: xScale = d3.scaleLinear()
    .domain([0, d3.sum($data, d => d.count)])
    .range([0, width]); // Define `width` based on your chart size

  const colorScale = d3.scaleOrdinal()
    .domain(zDomain)
    .range(zRange); // Define `width` based on your chart size
</script>

<div class="bar-group">
  {#each stackedData as d, i}
    <div
      class="group-rect"
      data-id={d.group}
      style="
        width: {xScale(d.count)}px;
        background-color: {colorScale(d.group)};
        left: {xScale(d.offset)}px;
      ">
    </div>
    <div
      class="group-label"
      style="
        width: calc({xScale(d.count)}px - 5px);
        left: calc({xScale(d.offset)}px);
      "
    >
      <div class="group-label-text">
        {d.count}
       </div>
    </div>
  {/each}
</div>

<style>
  .bar-group {
  display: flex;
  flex-direction: row;
}

.group-rect {
  position: absolute;
  height: 40px;
}

.group-label {
  position: absolute;
  height: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: right;
}

.group-label-text{
  background-color: rgba(255, 255, 255, 0.33);
  padding: 2px 5px;
}
</style>
