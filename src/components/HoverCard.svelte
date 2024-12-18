<!--
  @component
 -->
<script>
	import { getContext } from 'svelte';

	function formatCoveragePriority(value) {
		if (value === 'Cover_News') {
			return 'News of the Day';
		} else if (value === 'Cover_Analysis') {
			return 'Explanatory/Analysis';
		} else if (value === 'Cover_Invest') {
			return 'Investigative';
		} else {
			return value;
		}
	}

	export let data;
</script>

<div
	class="hover-card"
	style="
  top: calc({data.y}px - 100px);
  left: {data.x}%;
  display: {data.active ? 'block' : 'none'};
  "
>
	<ul>
		{#each Object.entries(data.data) as [key, value]}
			{#if ['Geographic scope', 'Coverage Priority', 'Revenue Tier', 'Expenses Tier'].includes(key)}
				<li><span class="hover-card_key">{key}:</span> {formatCoveragePriority(value)}</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.hover-card {
		position: absolute;
		transform: translate(-50%, -10%);
		background-color: white;
		border: 1px solid black;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		display: none;
		z-index: 99;

		& ul {
			list-style: none;
			padding: 0;
		}

		& li {
			font-size: 14px;
		}

		& .hover-card_key {
			font-weight: bold;
			text-transform: uppercase;
		}
	}
</style>
