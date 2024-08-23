<script>
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  const pages = ['revenue', 'diversity', 'audience', 'staffing', 'coverage'];

  // Get page URL.
  let currentPath;
  $: currentPath = $page.url.pathname;

  // Get the data from the parent layout and set up the filterable store.
  export let data;
  export const rawdata = data.props.rawdata;
  export let filteredData = rawdata;
  const filteredDataStore = writable(filteredData);
  $: filteredDataStore.set(filteredData);
  setContext('filteredData', filteredDataStore);

	// Create a store and update it when necessary...
	const user = writable('not set');
	$: user.set(data.user);

	// ...and add it to the context for child components to access
	setContext('user', user);

  function toggleOption(option) {
    user.set(option); // update the store value
  }

  function handleAgeFilter() {
    let selectedMinAge = event.target.options[event.target.selectedIndex].dataset.minage;
    let selectedMaxAge = event.target.options[event.target.selectedIndex].dataset.maxage;
    filteredData = rawdata.filter(d => {
      return +d["Age"] >= selectedMinAge && +d["Age"] < selectedMaxAge;
    });
  }
</script>

<div>
  <select on:change={handleAgeFilter} class="select">
    <option value="1" data-minage="0" data-maxage="200">All</option>
    <option value="2" data-minage="0" data-maxage="3">Less than 3 years old</option>
    <option value="3" data-minage="0" data-maxage="5">Less than 5 years old</option>
    <option value="4" data-minage="5" data-maxage="10">5-10 years old</option>
    <option value="5" data-minage="10" data-maxage="200">10 or more years old</option>
  </select>
</div>

<span class="badge variant-filled">Badge</span>


<aside class="alert variant-ghost">
    <div class="alert-message">
        <p>Showing data from {filteredData.length} organizations</p>
    </div>
</aside>

<nav class="data__nav">
  <ul>
    {#each pages as page}
      <li class={currentPath === `/data/${page}` ? 'active' : ''}>
        <a href={`/data/${page}`}>
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<div class="data__wrapper">
  <slot />
</div>