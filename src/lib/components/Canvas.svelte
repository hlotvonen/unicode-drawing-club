<script>
  import { onMount } from "svelte";
  import Cursor from "./Cursor.svelte";
  import GridLines from "./GridLines.svelte";
  import { shortcut } from "../utils/shortcut.js";
  import {
    cursorPos,
    grid,
    selected,
    settings,
    createEmptyCanvas,
    getEmptyCell,
  } from "../store.js";
  import MousePan from "./MousePan.svelte";
  import Toolbar from "./Toolbar.svelte";
  import { undo, redo, replaceCell } from "../commands";

  onMount(() => {
    if ($grid.data.length == 0) {
      createEmptyCanvas($grid.height, $grid.width);
    }
  });

  /*
  const insert = (y, x, selected) => {
    //stats
    if (selected.unicode === 8194) {
      $grid.stats.deletes++;
    } else {
      $grid.stats.inserts++;
    }
    $grid.stats.keysPressed++;

    if (selected.width === "full") {
      //if at the end of row, can't insert full width characters
      if (x + 1 >= $grid.data[y].length) return;

      //if next character is half width, remove it
      if (
        $grid.data[y][x + 1].width === "half" &&
        $grid.data[y][x].width === "half"
      ) {
        removeCell(y, x + 1);
      }
      //if next character is full width, replace it with en space
      if ($grid.data[y][x + 1].width === "full") {
        $grid.data[y][x + 1] = getEmptyCell();
        $grid.data[y][x + 2] = getEmptyCell();
        removeCell(y, x + 1);
      }
      //if previous character is full width, replace it with en space
      if ($grid.data[y][x - 1]?.width === "full") {
        $grid.data[y][x - 1] = getEmptyCell();
        removeCell(y, x + 1);
      }
      //if current character is zero width, remove previous
      if ($grid.data[y][x]?.width === "zero") {
        $grid.data[y][x - 1] = getEmptyCell();
        removeCell(y, x + 1);
      }
    }

    if (selected.width === "half") {
      //if next character is full width, replace it with en space
      if ($grid.data[y][x].width === "full") {
        $grid.data[y][x + 1] = getEmptyCell();
      }
      //if previous character is full width, replace it with en space
      if ($grid.data[y][x - 1]?.width === "full") {
        $grid.data[y][x - 1] = getEmptyCell();
      }
    }

    $grid.data[y][x] = selected;
  };
  */

  function moveCursor(axis, amount) {
    $grid.stats.keysPressed++;
    if (axis === "x") {
      const newPos = $cursorPos.x + amount;
      //clamp it from 0 to grid width
      $cursorPos.x = Math.min(Math.max(parseInt(newPos), 0), $grid.width - 1);
    } else {
      const newPos = $cursorPos.y + amount;
      //clamp it from 0 to grid height
      $cursorPos.y = Math.min(Math.max(parseInt(newPos), 0), $grid.height - 1);
    }
  }
</script>

<div class="main-wrapper">
  <div class="toolbar-wrapper">
    <Toolbar />
  </div>
  <div class="canvas-wrapper">
    {#if $settings.bigArrows}
      <div class="arrows">
        <div on:click={() => moveCursor("y", -1)}></div>
        <div on:click={() => moveCursor("y", 1)}></div>
        <div on:click={() => moveCursor("x", 1)}></div>
        <div on:click={() => moveCursor("x", -1)}></div>
      </div>
    {/if}
    <div
      class="canvas"
      use:shortcut={{ code: "ArrowRight", callback: () => moveCursor("x", 1) }}
      use:shortcut={{ code: "ArrowLeft", callback: () => moveCursor("x", -1) }}
      use:shortcut={{ code: "ArrowUp", callback: () => moveCursor("y", -1) }}
      use:shortcut={{ code: "ArrowDown", callback: () => moveCursor("y", 1) }}
      use:shortcut={{
        code: "KeyQ",
        callback: () =>
          replaceCell($cursorPos.y, $cursorPos.x, { ...$selected }),
      }}
      use:shortcut={{
        code: "Space",
        callback: () => replaceCell($cursorPos.y, $cursorPos.x, getEmptyCell()),
      }}
      use:shortcut={{
        control: true,
        code: "KeyZ",
        callback: () => undo(),
      }}
      use:shortcut={{
        control: true,
        shift: true,
        code: "KeyZ",
        callback: () => redo(),
      }}
    >
      <MousePan>
        <div
          class="gridWrapper"
          style="
            scale: {$settings.canvasZoom};
            width:{$grid.width * ($grid.fontSize / 2)}px;
            height:{$grid.height * $grid.fontSize}px
          "
        >
          {#if $settings.showGrid}
            <GridLines />
          {/if}
          {#if $settings.showCursor}
            <Cursor />
          {/if}

          <div class="grid">
            {#each $grid.data as row, y}
              <div class="row">
                {#each row as col, x}
                  {#if $grid.data[y][x].width !== "zero"}
                    <span
                      on:click={() => {
                        $cursorPos.x = x;
                        $cursorPos.y = y;
                      }}
                    >
                      {@html "&#" + $grid.data[y][x].unicode + ";"}
                    </span>
                  {/if}
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </MousePan>
    </div>
  </div>
</div>

<style>
  .main-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .toolbar-wrapper {
    flex: 0 0 auto;
    display: flex;
    padding: 3px;
    border-bottom: 1px solid var(--foregroundColor);
  }
  .canvas-wrapper {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
  }
  .canvas {
    height: 100%;
    flex: 1;
    display: grid;
    place-items: center;
  }
  .gridWrapper {
    position: relative;
  }
  .grid {
    cursor: cell;
  }
  span {
    display: inline-block;
  }
  .arrows > div {
    position: absolute;
    opacity: 0.2;
    user-select: none;
    z-index: 2;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .arrows > div:nth-child(1) {
    top: 0;
    left: 30px;
    width: calc(100% - 60px);
    height: 30px;
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: var(--foregroundColor);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
  }
  .arrows > div:nth-child(2) {
    bottom: 0;
    right: 30px;
    width: calc(100% - 60px);
    height: 30px;
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: var(--foregroundColor);
      clip-path: polygon(100% 0, 0 0, 50% 100%);
    }
  }
  .arrows > div:nth-child(3) {
    bottom: 30px;
    right: 0;
    width: 30px;
    height: calc(100% - 60px);
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: var(--foregroundColor);
      clip-path: polygon(100% 50%, 0 0, 0 100%);
    }
  }
  .arrows > div:nth-child(4) {
    bottom: 30px;
    left: 0;
    width: 30px;
    height: calc(100% - 60px);
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: var(--foregroundColor);
      clip-path: polygon(100% 100%, 100% 0, 0 50%);
    }
  }
</style>
