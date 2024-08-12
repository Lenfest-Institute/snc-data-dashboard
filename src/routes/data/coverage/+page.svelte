<script>
  export let data = [];
</script>

<div class="charts__staffing">

  <ul>
    {#each data.props.data as row}
      <li>{JSON.stringify(row)}</li>
    {/each}
  </ul>
</div>