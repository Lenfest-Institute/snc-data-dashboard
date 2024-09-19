<script>
    import * as d3 from 'd3';

    import { getContext } from 'svelte';
    import Chart from '../../../components/Chart.svelte';

    $: filteredData = getContext('filteredData');
</script>

<div class="charts__wrapper charts__audience">

</div>