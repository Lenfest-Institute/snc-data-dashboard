<script>
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  const pages = ['revenue', 'diversity', 'audience', 'staffing', 'coverage'];

  let currentPath;
  $: currentPath = $page.url.pathname;

  export let filters;
  const audience = writable('not set'); // set default value
  $: if (filters) audience.set(filters.audience); // check if filters is defined
  setContext('audience', audience); // set the context

  function toggleOption(option) {
    audience.set(option); // update the store value
  }
</script>


<div>
  <button
    class="toggle-button {$audience === 'default' ? 'active' : ''}"
    on:click={() => toggleOption('default')}
  >
    Default
  </button>
  <button
    class="toggle-button {$audience === 'limited' ? 'active' : ''}"
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

<div class="data__wrapper">
  <slot />
</div>