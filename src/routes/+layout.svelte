<script>
  export let data;
  import "../styles/app.scss";
</script>

<header>
  <h1>Filters</h1>
</header>

<nav>
  <ul>
    <li><a href="/data-revenue">Revenue</a></li>
    <li><a href="/data-dei">DEI</a></li>
    <li><a href="/data/audience">Audience</a></li>
    <li><a href="/data-staffing">Staffing</a></li>
  </ul>
</nav>

<main>
  <slot />
</main>