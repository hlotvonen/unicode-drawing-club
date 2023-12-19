<script>
  import { onMount } from "svelte";
  import Cursor from "./Cursor.svelte";
  import GridLines from "./GridLines.svelte";
  import { shortcut } from "./shortcut.js";
  import { cursorPos, grid, selected } from "./store";

  onMount(() => {
    if ($grid.data.length == 0) {
      createEmptyCanvas();
    }
  });
  const createEmptyCanvas = () => {
    $grid.data = getEmptyCanvas();
  };
  const getEmptyCanvas = () => {
    return Array.from({ length: $grid.height }, getEmptyRow);
  };
  const getEmptyRow = () => {
    return Array.from({ length: $grid.width }, () => getEmptyCell());
  };
  const getEmptyCell = () => {
    //unicode for en space 8194
    return {
      unicode: 8194,
      width: "half",
    };
  };

  function removeCell(y, x) {
    $grid.data[y][x] = {
      unicode: null,
      width: "zero",
    };
  }

  const insert = (y, x, selected) => {
    console.log(JSON.stringify($grid));
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

  function moveCursor(axis, amount) {
    if (axis === "x") {
      const newPos = $cursorPos.x + amount;
      //clamp it from 0 to grid width
      $cursorPos.x = Math.min(Math.max(parseInt(newPos), 0), $grid.width - 1);
    } else {
      const newPos = $cursorPos.y + amount;
      //clamp it from 0 to grid height
      $cursorPos.y = Math.min(Math.max(parseInt(newPos), 0), $grid.height - 1);
    }
    console.log($grid.data[$cursorPos.y][$cursorPos.x].width);
  }
</script>

<div
  class="canvas"
  use:shortcut={{ code: "ArrowRight", callback: () => moveCursor("x", 1) }}
  use:shortcut={{ code: "ArrowLeft", callback: () => moveCursor("x", -1) }}
  use:shortcut={{ code: "ArrowUp", callback: () => moveCursor("y", -1) }}
  use:shortcut={{ code: "ArrowDown", callback: () => moveCursor("y", 1) }}
  use:shortcut={{
    code: "KeyQ",
    callback: () => insert($cursorPos.y, $cursorPos.x, $selected),
  }}
  use:shortcut={{
    code: "Space",
    callback: () => insert($cursorPos.y, $cursorPos.x, getEmptyCell()),
  }}
>
  <div class="gridWrapper">
    <GridLines />
    <Cursor />

    <div class="grid">
      {#each $grid.data as row, y}
        <div class="row">
          {#each row as col, x}
            {#if $grid.data[y][x].width !== "zero"}
              <span>
                {@html "&#" + $grid.data[y][x].unicode + ";"}
              </span>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
    <!--
    space debugger
    <div class="grid">
      {#each $grid.data as row, y}
        <div class="row">
          {#each row as col, x}
            {#if $grid.data[y][x].width === "zero"}<span>z</span
              >{/if}{#if $grid.data[y][x].width === "half"}<span>h</span
              >{/if}{#if $grid.data[y][x].width === "full"}<span>f</span>{/if}
          {/each}
        </div>
      {/each}
    </div>
    -->
  </div>
</div>

<style>
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
    box-shadow: 0 0 0 1px #444;
  }
  span {
    height: 20px;
    display: inline-block;
  }
</style>
