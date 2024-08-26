<script>
  import * as d3 from 'd3';
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import {
    Accordion,
    AccordionItem,
    SlideToggle,
  } from '@skeletonlabs/skeleton';

  const pages = ['revenue', 'diversity', 'audience', 'staffing', 'coverage'];

  // Get page URL.
  let currentPath;
  $: currentPath = $page.url.pathname;

  // Get the data from the parent layout and set up the filterable store.
  export let data;
  export const rawdata = data.props.rawdata;
  $: filteredData = rawdata.filter(d => {
    return (filterRevenueTier ? d["Revenue Tier"] === filterRevenueTier : true) &&
           (filterAge ? +d["Age"] >= filterAge.min : true) &&
           (filterAge ? +d["Age"] < filterAge.max : true);
  });

  const filteredDataStore = writable(filteredData);
  $: filteredDataStore.set(filteredData);
  setContext('filteredData', filteredDataStore);

	// Create a store and update it when necessary...
	const user = writable('not set');
	$: user.set(data.user);

	// ...and add it to the context for child components to access
	setContext('user', user);

  // Filters
  let filterRevenueTier;
  let filterAge;
  let filterPubMedia = false;

  function handleFilterRevenue() {
    let tier = event.target.options[event.target.selectedIndex].dataset.tier;
    if (tier !== "All") {
      filterRevenueTier = tier;
    } else {
      filterRevenueTier = null;
    }
  }

  function handleFilterAge() {
    let selectedMinAge = event.target.options[event.target.selectedIndex].dataset.minage;
    let selectedMaxAge = event.target.options[event.target.selectedIndex].dataset.maxage;
    filterAge = new Object({
      min: selectedMinAge,
      max: selectedMaxAge
    });
  }

  function handleFilterPubMedia() {
    if (filterPubMedia) {
      filteredData = filteredData.filter(d => {
        return d["Is PubMedia?"] === "PubMedia_Yes";
      });
    } else {
      filteredData = filteredData.filter(d => {
        return d["Is PubMedia?"];
      });
    }
  }

  const filterOptionsRevenue = [
    "Less than $250K",
    "$250K to <$500K",
    "$500K to <$1 million",
    "$1 million to <$2 million",
    "$2 million and up",
  ]

    console.log(filterOptionsRevenue);
</script>

<Accordion>
  <AccordionItem open>
    <svelte:fragment slot="summary">Filters</svelte:fragment>
    <svelte:fragment slot="content">
      <div class="data__filters">
        <div class="data__filter-revenue">
          <h3>Revenue</h3>
          <select on:change={handleFilterRevenue} class="select">
            <option value="1" data-tier="All">All</option>
            {#each filterOptionsRevenue as tier}
              <option value="2" data-tier={tier}>{tier}</option>
            {/each}
          </select>
        </div>

        <div class="data__filter-age">
          <h3>Organization Age</h3>
          <select on:change={handleFilterAge} class="select">
            <option value="1" data-minage="0" data-maxage="200">All</option>
            <option value="3" data-minage="0" data-maxage="5">Less than 5 years old</option>
            <option value="4" data-minage="5" data-maxage="10">5-10 years old</option>
            <option value="5" data-minage="10" data-maxage="200">10 or more years old</option>
          </select>
        </div>

        <div class="data__filter-age">
          <h3>Organization Age</h3>
          <select on:change={handleFilterAge} class="select">
            <option value="1" data-minage="0" data-maxage="200">All</option>
            <option value="3" data-minage="0" data-maxage="5">Less than 5 years old</option>
            <option value="4" data-minage="5" data-maxage="10">5-10 years old</option>
            <option value="5" data-minage="10" data-maxage="200">10 or more years old</option>
          </select>
        </div>

        <div class="data__filter-age">
          <h3>Organization Age</h3>
          <select on:change={handleFilterAge} class="select">
            <option value="1" data-minage="0" data-maxage="200">All</option>
            <option value="3" data-minage="0" data-maxage="5">Less than 5 years old</option>
            <option value="4" data-minage="5" data-maxage="10">5-10 years old</option>
            <option value="5" data-minage="10" data-maxage="200">10 or more years old</option>
          </select>
        </div>

        <!-- <div class="data__filter-pubmedia">
          <SlideToggle bind:checked={filterPubMedia} name="slider-label" on:change={handleFilterPubMedia}>Show only public media</SlideToggle>
        </div> -->
      </div>
    </svelte:fragment>
  </AccordionItem>
</Accordion>

<aside class="alert variant-ringed">
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