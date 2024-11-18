<!--
  @component
  Generates an SVG Beeswarm chart using a [d3-force simulation](https://github.com/d3/d3-force).
 -->
<script>
  import { scaleOrdinal } from 'd3-scale';
  import { getContext } from 'svelte';
  import HoverCard from './HoverCard.svelte';
  import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
    import { convertToNumber, colorsCategorical, colorsCategoricalExtra } from '$lib/index';
	import { color } from 'd3';

  const { data, xGet, height, zGet, xScale, yScale } = getContext('LayerCake');

  $: nodes = $data.map(d => ({ ...d }));

  /** @type {Number} [r=4] - The circle radius size in pixels. */
  export let r = 4;

  /** @type {String} [fill='#f95346'] - The circle's fill color. */
  export let fill = '#f95346';

  /** @type {String} [stroke='#000'] - The circle's stroke color. */
  export let stroke = '#000';

  /** @type {Number} [strokeWidth=1] - The circle's stroke width. */
  export let strokeWidth = 1;

  /** @type {Number} [xStrength=0.95] - The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
  export let xStrength = 1;

  // define zDomain as the range of possible values for "Revenue Tier" of node
  $: zDomain = Array
    .from(new Set($data.map(d => d["Revenue Tier"])))
    .sort((a, b) => convertToNumber(a) - convertToNumber(b));

  $: colorScale = scaleOrdinal()
    .domain(zDomain)
    .range(colorsCategorical);

  $: simulation = forceSimulation(nodes)
    .force(
      'x',
      forceX()
        .x(d => $xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0))
        .strength(xStrength)
    )
    .force('collide', forceCollide(r * .8))
    .stop();

  $: {
    for (
      let i = 0,
        n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
      i < n;
      ++i
    ) {
      simulation.tick();
    }
  }

  $: hoverCardInfo = {
    data: {},
    x: 0,
    y: 0,
    active: false,
  }
</script>

<div class="bee-container">
  <HoverCard 
    data={hoverCardInfo}
  />
  {#each simulation.nodes() as node}
    <div
      class="circle"
      role="button"
      tabindex="0"
      style="
        left: {node.x}%;
        top: {node.y + ($height / 2)}px;
        width: {r * 2}px;
        height: {r * 2}px;
        background-color: {colorScale(node["Revenue Tier"])};
        border: {strokeWidth}px solid {colorScale(node["Revenue Tier"])};
      "
      on:mouseover={() => {
        hoverCardInfo = {
          data: $data[node.index],
          x: node.x,
          y: node.y + ($height / 2),
          active: true,
        };
      }}
      on:focus={() => {
        hoverCardInfo = {
          data: $data[node.index],
          x: node.x,
          y: node.y + ($height / 2),
          active: true,
        };
      }}
      on:mouseleave={() => {
        hoverCardInfo = {
          data: {},
          x: 0,
          y: 0,
          active: false,
        };
      }}
    ></div>
  {/each}
</div>

<style>
  .bee-container {
    position: relative;
  }

  .circle {
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
</style>