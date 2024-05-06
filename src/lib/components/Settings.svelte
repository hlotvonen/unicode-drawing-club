<script>
  import Stats from "./Stats.svelte";
  import { grid, cursorPos, settings } from "../store.js";
  import { onMount } from "svelte";
  import {
    addColumn,
    addRow,
    removeColumn,
    removeRow,
    resetCanvas,
  } from "../commands";
  import SaveLoad from "./SaveLoad.svelte";

  function onChange(event) {
    grid.update((current) => {
      current.font = event.target.value;
      return current;
    });
  }

</script>

<!--
<form>
  <fieldset>
    <legend>Choose font</legend>
    <input
      type="radio"
      id="BabelStoneShapes"
      name="font"
      value="BabelStoneShapes"
      on:change={onChange}
      bind:group={$grid.font}
    />
    <label for="BabelStoneShapes">BabelStoneShapes</label><br />

    <input
      type="radio"
      id="Unscii"
      name="font"
      value="Unscii"
      on:change={onChange}
      bind:group={$grid.font}
    />
    <label for="Unscii">Unscii</label><br />
  </fieldset>
</form>
-->

<div class="settings">
  <h4>Save & Load</h4>
  <SaveLoad />
  <p>
    You can also copy&paste the drawing as plain text. To display it correctly, make sure to download the <a
      href="http://viznut.fi/unscii/"
      target="_blank">unscii font</a
    >.
  </p>

  <hr />
  <h4>Canvas Size</h4>
  Canvas Width:
  <button on:click={() => addColumn("left", $cursorPos.x)}>Add 1 column to the left</button>
  <button on:click={() => addColumn("right", $cursorPos.x)}>Add 1 column the right</button>
  <button on:click={() => removeColumn()}>Delete column</button>
  <br />
  Canvas Height:
  <button on:click={() => addRow("down", $cursorPos.y)}>Add 1 row below</button>
  <button on:click={() => addRow("up", $cursorPos.y)}>Add 1 row above</button>
  <button on:click={() => removeRow()}>Delete row</button>
  <hr />
  <h4>Options</h4>
  <label>
    <input type="checkbox" bind:checked={$settings.mobileControls} />
    Show mobile controls
  </label>
  <br />
  <label>
    <input type="checkbox" bind:checked={$settings.showGrid} />
    Show grid
  </label>
  <br />
  <label>
    <input type="checkbox" bind:checked={$settings.showCursor} />
    Show glyph preview
  </label>
  <br />
  <label>
    <input type="checkbox" bind:checked={$settings.checkeredBackground} />
    Show checkered background behind glyphs
  </label>

  <hr />
  <h4>Colors:</h4>
  <div>
    <input
      type="color"
      id="foreground"
      name="foreground"
      bind:value={$grid.foregroundColor}
    />
    <label for="foreground">Foreground</label>
  </div>
  <div>
    <input
      type="color"
      id="background"
      name="background"
      bind:value={$grid.backgroundColor}
    />
    <label for="background">Background</label>
  </div>
  <div>
    <input
      type="color"
      id="highlight"
      name="highlight"
      bind:value={$grid.highlightColor}
    />
    <label for="highlight">Highlight</label>
  </div>

  <hr />
  <h4>Reset</h4>
  <button on:click={() => resetCanvas($grid.height, $grid.width)}>
    Reset canvas
  </button>
  <hr />
  <Stats />
</div>

<style>
  .settings {
    padding: 5px;
    hyphens: auto;
    word-break: break-all;
  }
</style>
