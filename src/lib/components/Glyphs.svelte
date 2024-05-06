<script>
  import glyphsData from "../data/unscii_unicode_segments3.json";
  import { select, grid, cursorPos, preview, settings, selected, getEmptyCell, moveCursor } from "../store.js";
  import { replaceCell, redo, undo } from "../commands";
  import { derived } from "svelte/store";

  // Derived store to calculate current page glyphs
  let currentPageGlyphs = derived(settings, ($settings) => {
    const pageNumber = `${$settings.pageNumberLeft}${$settings.pageNumberRight}`;
    return glyphsData[pageNumber] || [];
  });

  function handleClick(event, selected) {
    event.preventDefault();
    const { x, y } = $cursorPos;
    const { unicode } = selected;

    select(unicode);
    replaceCell(y, x, selected);
  }

  function handleRightClick(event, selected) {
    event.preventDefault();
    const { unicode } = selected;
    select(unicode);
  }
</script>

<div class="glyphs-grid {$settings.mobileControls ? 'mobilecontrols' : ''}">
  {#if $settings.mobileControls}
    <div class='arrow top' on:click={() => moveCursor("y", -1)}></div>
    <div class='arrow bottom' on:click={() => moveCursor("y", 1)}></div>
    <div class='arrow right' on:click={() => moveCursor("x", 1)}></div>
    <div class='arrow left' on:click={() => moveCursor("x", -1)}></div>

    <button class='topright' on:click={() => replaceCell($cursorPos.y, $cursorPos.x, { ...$selected })}>INS</button>
    <button class='bottomright' on:click={() => replaceCell($cursorPos.y, $cursorPos.x, getEmptyCell())}>DEL</button>
    <button class='topleft' on:click={() => redo()}>REDO</button>
    <button class='bottomleft' on:click={() => undo()}>UNDO</button>
  {/if}

  {#if $grid.font === "Unscii"}
    <ul
      class="glyphs center"
      style="font-size: {$grid.fontSize * $settings.glyphsZoom}px;"
    >
      {#each $currentPageGlyphs as unicode}
        <li
          style="width:{$grid.fontSize * $settings.glyphsZoom}px"
          class="{$settings.checkeredBackground ? 'checkeredBackground' : ''}"
          on:click={(event) => handleClick(event, { unicode})}
          on:contextmenu={(event) =>
            handleRightClick(event, { unicode})}
          on:mouseenter={() => ($preview = { unicode })}
          on:mouseleave={() => ($preview.unicode = null)}
        >
          {@html "&#x" + unicode.toString(16) + ";"}
        </li>
      {/each}
    </ul>
  {/if}

</div>

<style>
  .mobilecontrols {
    grid-template-areas:
      "topleft top topright"
      "left center right" 
      "bottomleft bottom bottomright"
    ;
    grid-template-rows: 30px 1fr 30px;
    grid-template-columns: 30px 1fr 30px;
  }
  .glyphs-grid {
    display: grid;
    width: 100%;
    height: 100%;
  }
  .topleft { grid-area: topleft;}
  .top { grid-area: top;}
  .topright { grid-area: topright;}
  .left { grid-area: left;}
  .center { grid-area: center;}
  .right { grid-area: right;}
  .bottomleft { grid-area: bottomleft;}
  .bottom { grid-area: bottom;}
  .bottomright { grid-area: bottomright;}

  .glyphs {
    list-style: none;
    padding: 0;
    margin: 3px auto;
    overflow: auto;
    outline: 1px solid var(--foregroundColor);
  }
  .glyphs li {
    display: inline-block;
    cursor: pointer;
    content-visibility: auto;
  }
  .glyphs li:hover {
    background: var(--highlightColor);
  }
  .glyphs li.checkeredBackground {
    box-shadow: 0 0 0.5px inset var(--foregroundColor);
    background: conic-gradient(
      transparent 0 .25turn,
      color-mix(in srgb, currentColor 10%, transparent) 0 .5turn,
      transparent 0 .75turn,
      color-mix(in srgb, currentColor 10%, transparent) 0 1turn
    );
  }
  .glyphs li.checkeredBackground:hover {
    box-shadow: 0 0 0.5px inset var(--foregroundColor);
    background: conic-gradient(
      color-mix(in srgb, var(--highlightColor) 70%, transparent) 0 .25turn,
      color-mix(in srgb, var(--highlightColor) 100%, transparent) 0 .5turn,
      color-mix(in srgb, var(--highlightColor) 70%, transparent) 0 .75turn,
      color-mix(in srgb, var(--highlightColor) 100%, transparent) 0 1turn
    );
  }
  .mobilecontrols button {
    writing-mode: vertical-rl;
    text-combine-upright: all;
    font-size: 18px;
    text-align: center;
  }
  .arrow {
    opacity: 0.2;
    user-select: none;
    z-index: 2;
    cursor: pointer;
    position: relative;
    &:hover {
      opacity: 0.7;
    }
  }
  .arrow.top::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: var(--foregroundColor);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  .arrow.bottom::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: var(--foregroundColor);
    clip-path: polygon(100% 0, 0 0, 50% 100%);
  }
  .arrow.right::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: var(--foregroundColor);
    clip-path: polygon(100% 50%, 0 0, 0 100%);
  }
  .arrow.left::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: var(--foregroundColor);
    clip-path: polygon(100% 100%, 100% 0, 0 50%);
  }
</style>
