<script>
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  const pages = ['revenue', 'diversity', 'audience', 'staffing', 'coverage'];

  let currentPath;
  $: currentPath = $page.url.pathname;

  // Get the data from the parent layout
  export let data;
  export const rawdata = data.props.rawdata;
  export let filteredData = rawdata;

  $: console.log(filteredData);

  // Create a store
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

  function filterDataset() {
    filteredData = rawdata.filter(d => {
      return parseInt(d["Launch Year"], 10) > 2015;
    });
  }
</script>

<div>
  <button
    class="toggle-button"
    on:click={() => filterDataset()}
  >
    Filter the Data Set
  </button>
</div>


<div>
  <button
    class="toggle-button {$user === 'default' ? 'active' : ''}"
    on:click={() => toggleOption('default')}
  >
    Default
  </button>
  <button
    class="toggle-button {$user === 'limited' ? 'active' : ''}"
    on:click={() => toggleOption('limited')}
  >
    Limited
  </button>
</div>

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

<h2>Data Length : {filteredData.length}</h2>

<div class="data__wrapper">
  <slot />
</div>