<script>
	import '../app.css';
	import '../styles/app.scss';
	import { setContext, getContext, onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { Accordion, AccordionItem, SlideToggle } from '@skeletonlabs/skeleton';
	import { filterOptionsFocus, filterOptionsPriority } from '$lib/index';

	const pages = ['audience', 'revenue', 'diversity', 'staffing', 'coverage'];

	let clientWidth;
	let controlsBarFixed = false;
	let accordionOpen = true;  
	let isMenuOpen = false;


	let controlsElement;
	let controlsHeight = 0;
	let filtersElement;
	let filtersHeight = 0;

	const handleScroll = () => {
        if (controlsElement) {
            const offsetTop = controlsElement.offsetTop + filtersHeight;
            controlsBarFixed = window.scrollY > offsetTop;
            if (clientWidth < 757 && controlsBarFixed) {
                accordionOpen = false;
            }
        }
    };

	onMount(() => {
		clientWidth = document.body.clientWidth;
		controlsHeight = controlsElement.offsetHeight;
		filtersHeight = filtersElement.offsetHeight;
		window.addEventListener('scroll', handleScroll);
	});

	// Get page URL.
	let currentPath;
	$: currentPath = $page.url.pathname;

	const pathPrefix = process.env.NODE_ENV === 'production' ? '/snc-data-dashboard' : '';

	// Get the data from the parent layout and set up the filterable store.
	export let data;
	export const rawdata = data?.props?.rawdata || [];
	$: filteredData = rawdata.length
		? rawdata.filter((d) => {
				return (
					(filterRevenueTier ? d['Revenue Tier'] === filterRevenueTier : true) &&
					(filterAge ? +d['Age'] >= filterAge.min : true) &&
					(filterAge ? +d['Age'] < filterAge.max : true) &&
					(filterStaff ? +d['Total Staff Size'] >= filterStaff.min : true) &&
					(filterStaff ? +d['Total Staff Size'] < filterStaff.max : true) &&
					(filterFocus ? d['Primary Editorial Focus'] === filterFocus : true) &&
					(filterPriority ? d['Coverage Priority'] === filterPriority : true)
				);
			})
		: [];

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
		'Less than $250K',
		'$250K to <$500K',
		'$500K to <$1 million',
		'$1 million to <$2 million',
		'$2 million and up'
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
		if (tier !== 'All') {
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
		if (selection !== 'all') {
			filterFocus = filterOptionsFocus.filter((option) => option.value === selection)[0].value;
		} else {
			filterFocus = null;
		}
	}

	function handleFilterPriority(event) {
		let selection = event.target.options[event.target.selectedIndex].value;
		if (selection !== 'all') {
			filterPriority = filterOptionsPriority.filter((option) => option.value === selection)[0]
				.value;
		} else {
			filterPriority = null;
		}
	}


  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<header>
	<h1>Statewide News Collective Data Dashboard</h1>
</header>

<section>
	<p>
		Welcome to the <a href="https://www.lenfestinstitute.org/our-work/communities-of-practice/statewide-news-collective/">Statewide News Collective</a>	+ INN Index Dashboard. Created by The Lenfest Institute for Journalism and the Institute for Nonprofit News (INN), this dashboard showcases anonymized revenue, audience, staffing andcoverage data across 48 statewide, nonprofit news outlets. These data are from INN's annual Index survey and represent performance in 2023. See <a href="https://inn.org/research/inn-index/the-inn-index/about-the-index/">INN's full Index</a> for nonprofit news trends. The Statewide News Collective is a community for news organizations serving statewide audiences.
	</p>

	<p>
		Dashboard designed and built by <a href="//tylermachado.com">Tyler Machado</a>; please send suggestions and feedback <a href="mailto:tyler.machado@gmail.com?subject=SNC Data Dashboard Feedback" aria-label="Send suggestions and feedback to Tyler via email">via email</a>.
	</p>
</section>

	<section style="height: {controlsBarFixed ? `${controlsHeight}px` : '0'};"></section>

	<section bind:this={controlsElement} class="controls" class:controls-fixed={controlsBarFixed}>
		<Accordion>
			<AccordionItem open={accordionOpen}>
				<svelte:fragment slot="summary">Filters</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="data__filters" bind:this={filtersElement}>
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
								<option value="all">All</option>
								{#each filterOptionsFocus as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<div class="data__filter-priority">
							<h3>Coverage Priority</h3>
							<select on:change={handleFilterPriority} class="select">
								<option value="all">All</option>
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

<div>
  <div class="hamburger" on:click={toggleMenu}>
    &#9776; <!-- Unicode character for hamburger menu -->
  </div>

  <nav class="data__nav {isMenuOpen ? 'open' : ''}">
			<ul>
				{#each pages as page}
					<li class={currentPath === `${pathPrefix}/${page}` ? 'active' : ''}>
						<a href={`${pathPrefix}/${page}`}>
							{page.charAt(0).toUpperCase() + page.slice(1)}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		</div>
	</section>

	<main class="data__wrapper" bind:clientWidth={clientWidth}>
		{#if filteredData.length < 5}
			<p>Not enough organizations meet this combination of filters.</p>
		{:else}
			<slot />
		{/if}
	</main>

<style lang="scss">
	.controls-fixed {
		background-color: white;
		padding: 0;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1000;
	}

  .hamburger {
    display: none;
    cursor: pointer;
    font-size: 24px;
  }

	nav.data__nav {
    display: flex;
    justify-content: space-between;
    background-color: var(--gray-30);
    color: var(color-white);
    padding: 0 16px;

    ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--gray-30);
        width: 50%;

        @media screen and (max-width: 768px) {
            width: 100%;
        }

        li {
            list-style: none;
            align-items: center;
            display: flex;

            &.active {
                background-color: var(--gray-15);
            }

            &:hover {
                background-color: var(--gray-15);
            }

            a {
                text-decoration: none;
                color: #000;
                padding: 1rem;
                border-bottom: unset;
            }
        }
    }
}

  @media (max-width: 768px) {
    .data__nav {
      display: none;
    }

    .data__nav.open {
      display: flex;
			ul {
      display: flex;
    	flex-direction: column;
			}
    }

    .hamburger {
      display: block;
    }
  }
</style>
