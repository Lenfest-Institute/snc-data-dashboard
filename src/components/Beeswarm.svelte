<!--
  @component
  Generates an SVG Beeswarm chart using a [d3-force simulation](https://github.com/d3/d3-force).
 -->
<script>
  import { getContext } from 'svelte';
  import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

  const { data, xGet, height, zGet, xScale, yScale } = getContext('LayerCake');

  const nodes = $data.map(d => ({ ...d }));

  /** @type {Number} [r=4] - The circle radius size in pixels. */
  export let r = 4;

  /** @type {String} [fill='#f95346'] - The circle's fill color. */
  export let fill = '#f95346';

  /** @type {String} [stroke='#000'] - The circle's stroke color. */
  export let stroke = '#000';

  /** @type {Number} [strokeWidth=1] - The circle's stroke width. */
  export let strokeWidth = 1;

  /** @type {Number} [xStrength=0.95] - The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
  export let xStrength = 0.99;

  /** @type {Number} [yStrength=0.075] - The value passed into the `.strength` method on `forceY`. See [the documentation](https://github.com/d3/d3-force#y_strength). */
  export let yStrength = 0.99;

  $: simulation = forceSimulation(nodes)
    .force(
      'x',
      forceX()
        .x(d => $xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0))
        .strength(xStrength)
    )
    // .force(
    //   'y',
    //   forceY()
    //     .y($height / 2)
    //     .strength(yStrength)
    // )
    .force('collide', forceCollide(r))
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
</script>

<!-- <g class="bee-group">
  {#each simulation.nodes() as node}
    <circle fill={$zGet(node)} {stroke} stroke-width={strokeWidth} cx={node.x} cy={node.y} {r}>
    </circle>
  {/each}
</g> -->

<div class="bee-container">
  {#each simulation.nodes() as node}
    <div
      class="circle"
      style="
        left: {node.x - r}%;
        top: {node.y - r + ($height / 2)}px;
        width: {r * 2}px;
        height: {r * 2}px;
        background-color: {fill};
        border: {strokeWidth}px solid {stroke};
      "
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