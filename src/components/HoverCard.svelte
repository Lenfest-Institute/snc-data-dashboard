<!--
  @component
 -->
<script>
  import { getContext } from 'svelte';
  
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
    <li><span class="hover-card_key">{key}:</span> {value}</li>
  {/each}
  </ul>
</div>

<style>
  .hover-card {
    position: absolute;
    transform: translate(-50%, 30%);
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