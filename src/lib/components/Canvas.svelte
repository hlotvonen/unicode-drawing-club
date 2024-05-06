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
    moveCursor,
    selectedArea
  } from "../store.js";
  import MousePan from "./MousePan.svelte";
  import Toolbar from "./Toolbar.svelte";
  import { undo, redo, replaceCell } from "../commands";
  import SelectionArea from "./SelectionArea.svelte";

  function automaticallyShowMobileControls() {
    // check if screen is in portait mode
    const aspectRatio = window.innerWidth / window.innerHeight;
    if(aspectRatio <= 1) {
      $settings.mobileControls = true;
    }
  }

  onMount(() => {
    automaticallyShowMobileControls();

    if ($grid.data.length == 0) {
      createEmptyCanvas($grid.height, $grid.width);
    }
  });

  let showSelectionArea = false;
  $: showSelectionArea = JSON.stringify($selectedArea.start) !== JSON.stringify($selectedArea.end)

	let mouseIsDown = false;

  function startSelection(x, y) {
    mouseIsDown = true;
    $selectedArea.start = [x, y];
    $selectedArea.end = [x, y];
	}
	function assessSelection(x, y) {
    if (!mouseIsDown) return;
    $selectedArea.end = [x, y];
  }
	function endSelection(x, y) {
    if (!mouseIsDown) return;
    $selectedArea.end = [x, y];
    mouseIsDown = false;
	}
	
  function handleClick(x, y) {
    if($settings.selectingArea) return;
    $cursorPos.x = x;
    $cursorPos.y = y;
  }
  function handleMouseDown(x, y) {
    startSelection(x,y)
  }
  function handleMouseMove(x, y) {
    assessSelection(x,y)
  }
  function handleMouseUp(x, y) {
    endSelection(x,y)
  }


</script>

<div class="main-wrapper">
  <div class="toolbar-wrapper">
    <Toolbar />
  </div>
  <div class="canvas-wrapper">
    <div
      class="canvas"
      use:shortcut={{ code: "ArrowRight", callback: () => moveCursor("x", 1) }}
      use:shortcut={{ code: "ArrowLeft", callback: () => moveCursor("x", -1) }}
      use:shortcut={{ code: "ArrowUp", callback: () => moveCursor("y", -1) }}
      use:shortcut={{ code: "ArrowDown", callback: () => moveCursor("y", 1) }}

      use:shortcut={{ shift: true, code: "ArrowRight", callback: () => selectArea() }}
      use:shortcut={{ shift: true, code: "ArrowLeft", callback: () => selectArea() }}
      use:shortcut={{ shift: true, code: "ArrowUp", callback: () => selectArea() }}
      use:shortcut={{ shift: true, code: "ArrowDown", callback: () => selectArea() }}

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
          {#if showSelectionArea}
            <SelectionArea />
          {/if}

          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div 
            class="grid" 
            on:mouseleave|preventDefault={() => mouseIsDown = false}
          >
            {#each $grid.data as row, y}
              <div class="row">
                {#each row as col, x}
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  {#if $grid.data[y][x].width !== "zero"}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span
                      on:click|preventDefault={() => handleClick(x, y)}
                      on:mousedown|preventDefault={() => handleMouseDown(y, x)}
                      on:mousemove|preventDefault={() => handleMouseMove(y, x)}
                      on:mouseup|preventDefault={() => handleMouseUp(y, x)}
                      on:touchstart|preventDefault={() => handleMouseDown(y, x)}
                      on:touchmove|preventDefault={() => handleMouseMove(y, x)}
                      on:touchend|preventDefault={() => handleMouseUp(y, x)}
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
    user-select: none;
  }
  span {
    display: inline-block;
  }
</style>
