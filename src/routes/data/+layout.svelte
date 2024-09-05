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
           (filterAge ? +d["Age"] < filterAge.max : true) &&
           (filterStaff ? +d["Total Staff Size"] >= filterStaff.min : true) &&
           (filterStaff ? +d["Total Staff Size"] < filterStaff.max : true) &&
           (filterFocus ? d["Primary Editorial Focus"] === filterFocus : true) &&
           (filterPriority ? d["Coverage Priority"] === filterPriority : true);
  });

  const filteredDataStore = writable(filteredData);
  $: filteredDataStore.set(filteredData);
  setContext('filteredData', filteredDataStore);

	// Create a store and update it when necessary...
	const user = writable('not set');
	$: user.set(data.user);

	// ...and add it to the context for child components to access
	setContext('user', user);

  // Filter options.
  const filterOptionsRevenue = [
    "Less than $250K",
    "$250K to <$500K",
    "$500K to <$1 million",
    "$1 million to <$2 million",
    "$2 million and up",
  ];

  // Filter options.
  const filterOptionsFocus = [
    {label: "Single Topic", value: "Prime_Single"},
    {label: "Related Topics", value: "Prime_Multi"},
    {label: "General Coverage", value: "Prime_Gen"}
  ];

  const filterOptionsPriority = [
    {label: "News", value: "Cover_News"},
    {label: "Investigative", value: "Cover_Invest"},
    {label: "Analysis", value: "Cover_Analysis"}
  ];

  // Filters placeholders.
  let filterRevenueTier;
  let filterAge;
  let filterStaff;
  let filterFocus;
  let filterPriority;
  let filterPubMedia = false;

  function handleFilterRevenue(event) {
    let tier = event.target.options[event.target.selectedIndex].dataset.tier;
    if (tier !== "All") {
      filterRevenueTier = tier;
    } else {
      filterRevenueTier = null;
    }
  }

  function handleFilterAge(event) {
    let selectedMinAge = event.target.options[event.target.selectedIndex].dataset.minage;
    let selectedMaxAge = event.target.options[event.target.selectedIndex].dataset.maxage;
    filterAge = new Object({
      min: selectedMinAge,
      max: selectedMaxAge
    });
  }

  function handleFilterStaff(event) {
    let selectedMin = event.target.options[event.target.selectedIndex].dataset.min;
    let selectedMax = event.target.options[event.target.selectedIndex].dataset.max;
    filterStaff = new Object({
      min: selectedMin,
      max: selectedMax
    });
  }

  function handleFilterFocus(event) {
    let selection = event.target.options[event.target.selectedIndex].value;
    if (selection !== "all") {
      filterFocus = filterOptionsFocus.filter(option => option.value === selection)[0].value;
    } else {
      filterFocus = null;
    }
  }

  function handleFilterPriority(event) {
    let selection = event.target.options[event.target.selectedIndex].value;
    if (selection !== "all") {
      filterPriority = filterOptionsPriority.filter(option => option.value === selection)[0].value;
    } else {
      filterPriority = null;
    }
  }
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

        <div class="data__filter-staff">
          <h3>Staff</h3>
          <select on:change={handleFilterStaff} class="select">
            <option value="1" data-min="0" data-max="200">All</option>
            <option value="3" data-min="0" data-max="3">Fewer than 3 employees</option>
            <option value="4" data-min="3" data-max="10">3-10 employees</option>
            <option value="4" data-min="10" data-max="25">10-25 employees</option>
            <option value="5" data-min="25" data-max="200">25 or more employees</option>
          </select>
        </div>

        <div class="data__filter-focus">
          <h3>Coverage Focus</h3>
          <select on:change={handleFilterFocus} class="select">
            <option value="All">All</option>
            {#each filterOptionsFocus as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <div class="data__filter-priority">
          <h3>Coverage Priority</h3>
          <select on:change={handleFilterPriority} class="select">
            <option value="All">All</option>
            {#each filterOptionsPriority as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
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