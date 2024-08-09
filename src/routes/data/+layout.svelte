<script>
  export let data;
  import { page } from '$app/stores';
  const pages = ['revenue', 'diversity', 'audience', 'staffing', 'coverage'];

  let currentPath;

  $: currentPath = $page.url.pathname;
</script>

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