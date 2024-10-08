<!--
  @component
  Generates an HTML x-axis, useful for server-side rendered charts. This component is also configured to detect if your x-scale is an ordinal scale. If so, it will place the markers in the middle of the bandwidth.

  Although this is marked as a percent-range component, you can also use it with a normal scale with no configuration needed. By default, if you have `percentRange={true}` it will use percentages, otherwise it will use pixels. This makes this component compatible with server-side and client-side rendered charts. Set the `units` prop to either `'%'` or `'px'` to override the default behavior.
 -->
<script>
  import { getContext } from 'svelte';

  const { xScale, percentRange } = getContext('LayerCake');

  /** @type {Boolean} [tickMarks=false] - Show a vertical mark for each tick. */
  export let tickMarks = false;

  /** @type {Boolean} [gridlines=true] - Show gridlines extending into the chart area. */
  export let gridlines = true;

  /** @type {Number} [tickMarkLength=6] - The length of the tick mark. */
  export let tickMarkLength = 6;

  /** @type {Boolean} [baseline=false] – Show a solid line at the bottom. */
  export let baseline = false;

  /** @type {Boolean} [snapLabels=false] - Instead of centering the text labels on the first and the last items, align them to the edges of the chart. */
  export let snapLabels = false;

  /** @type {String} [textAlign=center] - The text alignment of the tick labels. */
  export let textAlign = 'center';

  /** @type {Function} [format=d => d] - A function that passes the current tick value and expects a nicely formatted value in return. */
  export let format = (d) => {
    if (typeof d === 'number') {
      return d.toLocaleString();
    }
    return d;
  };

  /** @type {Number|Array|Function} [ticks] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */
  export let ticks = undefined;

  /** @type {Number} [tickGutter=0] - The amount of whitespace between the start of the tick and the chart drawing area (the yRange min). */
  export let tickGutter = 0;

  /** @type {Number} [dx=0] - Any optional value passed to the `dx` attribute on the text label. */
  export let dx = 0;

  /** @type {Number} [dy=0] - Any optional value passed to the `dy` attribute on the text label. */
  export let dy = 0;

  /** @type {Number} [rotate=0] - Any optional value passed to the `rotate` attribute on the text label. */
  export let rotate = 0;

  /** @type {String} units - Whether this component should use percentage or pixel values. If `percentRange={true}` it defaults to `'%'`. Options: `'%'` or `'px'`. */
  export let units = $percentRange === true ? '%' : 'px';

  /** @type {String} type - The type of chart. */
  export let type;

  /** @type {String} axisLabel - The type of chart. */
  export let axisLabel;

  /** @type {Number} type - Optional manual start. */
  export let setStartTick;

  let labelBottomPadding = 3;

  if (rotate == -45) {
    dx = -15;
    dy = 15;
    textAlign = 'right';
  }

  $: tickLen = tickMarks === true ? tickMarkLength ?? 6 : 0;

  $: isBandwidth = typeof $xScale.bandwidth === 'function';

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
      ? $xScale.domain()
      : typeof ticks === 'function'
        ? ticks($xScale.ticks())
        : $xScale.ticks(ticks);

  $: if ((tickVals.length && tickVals[0] !== 0) && typeof tickVals[0] === 'number') {
    tickVals.splice(0, 0, 0);
  }

  $: halfBand = isBandwidth ? $xScale.bandwidth() / 2 : 0;

  // Function to split the formatted tick by lines
  function splitFormat(tick) {
    const formattedTick = format(tick);
    const parts = [];
    let start = 0;
    while (start < formattedTick.length) {
      let end = start + 7;
      if (end < formattedTick.length) {
        const spaceIndex = formattedTick.indexOf(' ', end);
        if (spaceIndex !== -1) {
          labelBottomPadding = 4.5; // increase axis label spacing to account for a 2-line data label
          end = spaceIndex;
        } else {
          end = formattedTick.length;
        }
      }
      parts.push(formattedTick.slice(start, end).trim());
      start = end + 1;
    }
    return parts;
  }
</script>

<div class="axis x-axis" class:snapLabels>
   {#if axisLabel}
    <div class="axis-label" style="bottom: -{labelBottomPadding}em;">
      {axisLabel}
    </div>
  {/if}
  {#each tickVals as tick, i (tick)}
    {@const tickValUnits = $xScale(tick)}

    {#if baseline === true}
      <div class="baseline" style="top:100%; width:100%;"></div>
    {/if}

    {#if gridlines === true}
      <div class="gridline" style:left="{tickValUnits}{units}" style="top:0; bottom:0;"></div>
    {/if}
    {#if tickMarks === true}
      <div
        class="tick-mark"
        style:left="{tickValUnits + halfBand}{units}"
        style:height="{tickLen}px"
        style:bottom="{-tickLen - tickGutter}px"
      ></div>
    {/if}
    <div
      class="tick tick-{i}"
      style:left="{tickValUnits + halfBand}{units}"
      style="top:calc(100% + {tickGutter}px);"
    >
      {#if type === 'column' && typeof tick === 'string'}
        <div
          class="text"
          style:top="{tickLen}px"
          style:transform="translate(calc(-50% + {dx}px), {dy}px) rotate({rotate}deg)" 
          style:text-align="{textAlign}"
        >
          {#each splitFormat(tick) as part, index}
            {part}
            {#if index < splitFormat(tick).length - 1}
              <br>
            {/if}
          {/each}
        </div>
      {:else}
        <div
          class="text"
          style:top="{tickLen}px"
          style:transform="translate(calc(-50% + {dx}px), {dy}px) rotate({rotate}deg)"
          style:text-align="{textAlign}"
        >
          {format(tick)}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .axis,
  .tick,
  .tick-mark,
  .gridline,
  .baseline {
    position: absolute;
  }
  .axis {
    width: 100%;
    height: 100%;
  }
  .tick {
    font-size: 11px;
  }

  .gridline {
    border-left: 1px dashed #aaa;
  }

  .tick-mark {
    border-left: 1px solid #aaa;
  }
  .baseline {
    border-top: 1px solid #aaa;
  }

  .tick .text {
    color: #666;
    position: relative;
    white-space: nowrap;
    transform: translateX(-50%);
  }
  /* This looks a little better at 40 percent than 50 */
  .axis.snapLabels .tick:last-child {
    transform: translateX(-40%);
  }
  .axis.snapLabels .tick.tick-0 {
    transform: translateX(40%);
  }

  .axis-label {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    text-align: center;
    width: 100%;
  }
</style>