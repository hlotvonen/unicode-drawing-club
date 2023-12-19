<script>
  import fullWidthCharacters from "./fullWidthCharacters.json";
  import halfWidthCharacters from "./halfWidthCharacters.json";
  import { selected } from "./store.js";

  function select(unicode, width) {
    $selected = {
      unicode: unicode,
      width: width,
    };
  }
</script>

<div class="sidebar">
  <h4>Half-width characters:</h4>
  <ul>
    {#each halfWidthCharacters as unicode}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li on:click={() => select(unicode, "half")}>
        {@html "&#" + unicode + ";"}
      </li>
    {/each}
  </ul>
  <h4>Full-width characters:</h4>
  <ul>
    {#each fullWidthCharacters as unicode}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li on:click={() => select(unicode, "full")}>
        {@html "&#" + unicode + ";"}
      </li>
    {/each}
  </ul>
</div>

<style>
  h4 {
    font-size: 0.6rem;
    margin: 5px 0;
    color: lime;
  }
</style>
