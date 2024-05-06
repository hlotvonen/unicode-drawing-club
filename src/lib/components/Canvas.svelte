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
  import { undo, redo, replaceCell, pasteGrid } from "../commands";
  import SelectionArea from "./SelectionArea.svelte";

	let key;
  let shiftDown = false;
  let showSelectionArea = false;
	let mouseIsDown = false;
  let copiedArray = [];

  $: showSelectionArea = JSON.stringify($selectedArea.start) !== JSON.stringify($selectedArea.end)
  $: if(shiftDown) {
    $selectedArea.start = [$cursorPos.y, $cursorPos.x] 
    $selectedArea.end = [$cursorPos.y, $cursorPos.x] 
  }

  onMount(() => {
    automaticallyShowMobileControls();

    if ($grid.data.length == 0) {
      createEmptyCanvas($grid.height, $grid.width);
    }
  });
	function handleKeydown(event) {
		key = event.key;
		if(key === "Shift") {
			shiftDown = true;
		}
	}
	function handleKeyup(event) {
		key = event.key;
		if(key === "Shift") {
		  shiftDown = false;
		}
	}
  function automaticallyShowMobileControls() {
    // check if screen is in portait mode
    const aspectRatio = window.innerWidth / window.innerHeight;
    if(aspectRatio <= 1) {
      $settings.mobileControls = true;
    }
  }
  function startSelection(x, y) {
    $selectedArea.start = [x, y]
    $selectedArea.end = [x, y]
	}
	function assessSelection(x, y) {
    $selectedArea.end = [x, y]
  }
  function handleClick(event, x, y) {
    $cursorPos.x = x
    $cursorPos.y = y
  }
  function handleMouseDown(event, x, y) {
    if (event.button !== 0) return // Ensure left-click
    mouseIsDown = true
    startSelection(x,y)
  }
  function handleMouseMove(event, x, y) {
    if (!mouseIsDown) return
    assessSelection(x,y)
  }
  function handleMouseUp(event, x, y) {
    if (!mouseIsDown) return
    assessSelection(x,y)
    mouseIsDown = false
  }
  function updateSelectionArea(axis, amount) {
    switch (axis) {
      case 'x':
        assessSelection($selectedArea.end[0], $selectedArea.end[1] + amount)
        break;
      case 'y':
        assessSelection($selectedArea.end[0] + amount, $selectedArea.end[1])
        break;
      default:
        console.log(`Can't make selection bigger in ${axis} direction.`);
    }
  }
  function copy(y, x) {
    if(showSelectionArea) {
      copiedArray = $grid.data.slice($selectedArea.start[0], $selectedArea.end[0] + 1).map(row => row.slice($selectedArea.start[1], $selectedArea.end[1] + 1));
    } else {
      $selected.unicode = $grid.data[y][x].unicode
    }
  }
  function paste(copiedArray, x, y) {
    pasteGrid(copiedArray, x, y)
  }

</script>

<svelte:window on:keydown|preventDefault={handleKeydown} on:keyup|preventDefault={handleKeyup}/>

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

      use:shortcut={{ shift: true, code: "ArrowRight", callback: () => updateSelectionArea("x", 1) }}
      use:shortcut={{ shift: true, code: "ArrowLeft", callback: () => updateSelectionArea("x", -1) }}
      use:shortcut={{ shift: true, code: "ArrowUp", callback: () => updateSelectionArea("y", -1) }}
      use:shortcut={{ shift: true, code: "ArrowDown", callback: () => updateSelectionArea("y", 1) }}

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
      use:shortcut={{
        control: true,
        code: "KeyC",
        callback: () => copy($cursorPos.y, $cursorPos.x)
      }}
      use:shortcut={{
        control: true,
        code: "KeyV",
        callback: () => paste(copiedArray, $cursorPos.x, $cursorPos.y)
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
                      on:click|preventDefault={(event) => handleClick(event, x, y)}
                      on:mousedown|preventDefault={(event) => handleMouseDown(event, y, x)}
                      on:mousemove|preventDefault={(event) => handleMouseMove(event, y, x)}
                      on:mouseup|preventDefault={(event) => handleMouseUp(event, y, x)}
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
