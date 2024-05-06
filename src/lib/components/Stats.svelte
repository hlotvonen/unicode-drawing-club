<script>
  import { grid, select } from "../store.js";

  function calculateUniqueGlyphs(data) {
    if (!data) return;
    const allUnicodes = data.flatMap((row) => row.map((cell) => cell.unicode));
    const uniqueUnicodes = Array.from(new Set(allUnicodes));
    // Update the grid store with the new number of unique glyphs
    grid.update(($grid) => {
      $grid.stats.numberOfUniqueGlyphs = uniqueUnicodes.length;
      return $grid;
    });
  }
  $: calculateUniqueGlyphs($grid.data);

  function calculateUnicodeFrequency(data) {
    grid.update(($grid) => {
      const unicodeCount = {};

      // Count each unicode occurrence
      data.forEach((row) => {
        row.forEach((cell) => {
          const unicode = cell.unicode;
          unicodeCount[unicode] = (unicodeCount[unicode] || 0) + 1;
        });
      });

      // Convert the unicodeCount object into an array of [unicode, count] pairs
      const unicodeCountPairs = Object.entries(unicodeCount);

      // Sort the array based on count, in descending order
      unicodeCountPairs.sort((a, b) => b[1] - a[1]);

      // Optionally, update the grid store with this data or just return it
      // For example, let's store it in a new 'unicodeFrequency' field
      $grid.stats.unicodeFrequency = unicodeCountPairs;
      console.log($grid.stats.unicodeFrequency);
      return $grid;
    });
  }
  $: calculateUnicodeFrequency($grid.data);
</script>

<div>
  <h4>Stats</h4>
  <ul>
    <li>inserts: {$grid.stats.inserts}</li>
    <li>deletes: {$grid.stats.deletes}</li>
    <li>keysPressed: {$grid.stats.keysPressed}</li>
    <li>numberOfUniqueGlyphs: {$grid.stats.numberOfUniqueGlyphs}</li>
  </ul>
  <details open>
    <summary> Glyph count </summary>
    (Note: click to select)
    <ul>
      {#each $grid.stats.unicodeFrequency as unicodeCountPairs}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li on:click={() => select(unicodeCountPairs[0], "half")}>
          {@html "&#" +
            unicodeCountPairs[0] +
            "; &times; " +
            unicodeCountPairs[1]}
        </li>
      {/each}
    </ul>
  </details>
</div>
