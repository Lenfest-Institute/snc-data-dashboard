<script>
	import * as d3 from 'd3';
  import { getContext } from 'svelte';

  const { data, xGet, yGet, zGet } = getContext('LayerCake');

  export let labels;

  $: stackedData = $data.reduce((acc, item) => {
    const cumulativeCount = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].count : 0;
    acc.push({ ...item, offset: cumulativeCount });
    return acc;
  }, []);

  // // Create a scale for the x-axis based on the groups
  $: xScale = d3.scaleLinear()
    .domain([0, d3.sum($data, d => d.count)])
    .range([0, 100]); // Define `width` based on your chart size

  const colorScale = d3.scaleOrdinal()
    .domain(['YES', 'NO'])
    .range(['#f95346', '#ddd']); // Define `width` based on your chart size

  const labelScale = d3.scaleOrdinal()
    .domain(['YES', 'NO'])
    .range(labels); // Define `width` based on your chart size

  // // Create a scale for the y-axis based on the counts
  // const yScale = d3.scaleLinear()
  //   .domain([0, d3.max($data, d => d.count)]) // Maximum count for the y-axis
  //   .range([50, 0]); // Define `height` based on your chart size

  // $: columnWidth = d => {
  //   return xScale.bandwidth();
  // };
</script>

<g class="bar-group">
  {#each stackedData as d, i}
    <rect
      class="group-rect"
      data-id={d.group}
      x={xScale(d.offset)}
      y={0}
      height={10}
      width={xScale(d.count)}
      fill={colorScale(d.group)}
    ></rect>
  {/each}
</g>

<style>
  text {
    font-size: 20%;
  }
</style>
