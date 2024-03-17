<script>
  import glyphsData from "../data/unscii_unicode_segments3.json";
  import { select, grid, cursorPos, preview, settings } from "../store.js";
  import { replaceCell } from "../commands";
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";

  // Derived store to calculate current page glyphs
  let currentPageGlyphs = derived(settings, ($settings) => {
    const pageNumber = `${$settings.pageNumberLeft}${$settings.pageNumberRight}`;
    return glyphsData[pageNumber] || [];
  });

  function handleClick(event, selected) {
    event.preventDefault();
    const { x, y } = $cursorPos;
    const { width, unicode } = selected;

    select(unicode, width);
    replaceCell(y, x, selected);
  }
  function handleRightClick(event, selected) {
    event.preventDefault();
    const { width, unicode } = selected;
    select(unicode, width);
  }
</script>

{#if $grid.font === "Unscii"}
  <ul
    class="glyphs"
    style="font-size: {$grid.fontSize * $settings.glyphsZoom}px;"
  >
    {#each $currentPageGlyphs as unicode}
      <li
        style="width:{$grid.fontSize * $settings.glyphsZoom}px"
        on:click={(event) => handleClick(event, { unicode, width: "half" })}
        on:contextmenu={(event) =>
          handleRightClick(event, { unicode, width: "half" })}
        on:mouseenter={() => ($preview = { unicode, width: "half" })}
        on:mouseleave={() => ($preview.unicode = null)}
      >
        {@html "&#x" + unicode.toString(16) + ";"}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .glyphs {
    list-style: none;
    padding: 0;
    margin: 3px auto;
  }
  .glyphs li {
    display: inline-block;
    cursor: pointer;
    content-visibility: auto;
    padding: 1px;
  }
  .glyphs li:hover {
    background: var(--highlightColor);
  }
</style>
