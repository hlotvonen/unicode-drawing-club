<script>
  import Stats from "./Stats.svelte";
  import { grid, settings } from "../store.js";
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
    You can also copy&paste the text. Make sure to download the same <a
      href="http://viznut.fi/unscii/"
      target="_blank">font</a
    > as you are using in this app.
  </p>

  <hr />
  <h4>Canvas Size</h4>
  Canvas Width:
  <button on:click={() => addColumn()}>+</button>
  <button on:click={() => removeColumn()}>-</button>
  <br />
  Canvas Height:
  <button on:click={() => addRow()}>+</button>
  <button on:click={() => removeRow()}>-</button>

  <hr />
  <h4>Options</h4>
  <label>
    <input type="checkbox" bind:checked={$settings.bigArrows} />
    Show big arrows
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
