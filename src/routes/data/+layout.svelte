<script>
  export let data;
  import { page } from '$app/stores';
  let currentPage = $page.url.pathname;
  const pages = ['revenue', 'diversity', 'audience', 'staffing'];
</script>

<nav class="data__nav">
  <ul>
    {#each pages as page}
      <li>
        <a href={`/data/${page}`} class={currentPage === `/data/${page}` ? 'active' : ''}>
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<div class="data__wrapper">
  <slot />
</div>