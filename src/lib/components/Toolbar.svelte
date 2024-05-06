<script>
  import { settings, grid, cursorPos, selected, getEmptyCell } from "../store";
  import { replaceCell, undo, redo } from "../commands";
</script>

<div class="toolbar">
  <div>
    <button
      class={$settings.canvasZoom === 1 ? "selected" : ""}
      on:click={() => ($settings.canvasZoom = 1)}
    >
      1&times;
    </button>
    <button
      class={$settings.canvasZoom === 2 ? "selected" : ""}
      on:click={() => ($settings.canvasZoom = 2)}
    >
      2&times;
    </button>
    <button
      class={$settings.canvasZoom === 3 ? "selected" : ""}
      on:click={() => ($settings.canvasZoom = 3)}
    >
      3&times;
    </button>
    <button
      class={$settings.canvasZoom === 4 ? "selected" : ""}
      on:click={() => ($settings.canvasZoom = 4)}
    >
      4&times;
    </button>
  </div>
  <!--
    <div>
      <button
        on:click={() => replaceCell($cursorPos.y, $cursorPos.x, { ...$selected })}
        >Insert</button
      >
      <button
        on:click={() => replaceCell($cursorPos.y, $cursorPos.x, getEmptyCell())}
        >Delete</button
      >
    </div>
    <div>
      <button on:click={() => undo()}>Undo</button>
      <button on:click={() => redo()}>Redo</button>
    </div>
  -->
</div>

<style>
  .toolbar {
    flex: 1;
    display: flex;
    font-size: 12px;
    gap: 5px;
    justify-content: space-between;
  }
  .toolbar > div {
    width: fit-content;
  }
  .selected {
    background-color: var(--highlightColor);
  }
</style>
