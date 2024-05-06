<script>
  import { getBoundingRectangle } from "../utils/geometry.js";
  import { selectedArea, grid, cursorPos } from "../store.js";

  $: [[start_y, start_x], [end_y, end_x]] = getBoundingRectangle(
    $selectedArea.start,
    $selectedArea.end || [$cursorPos.y, $cursorPos.x]
  );

  $: posTopX = start_x * $grid.fontSize / 2
	$: posTopY = start_y * $grid.fontSize
	$: width = ($grid.fontSize / 2) * (end_x - start_x + 1)
	$: height = $grid.fontSize * (end_y - start_y + 1)

  $: if ($selectedArea.end[1] >= $grid.width) {
    $selectedArea.end[1]--;
  }
  $: if ($selectedArea.end[0] >= $grid.height) {
    $selectedArea.end[0]--;
  }
  $: if ($selectedArea.start[1] <= 0) {
    $selectedArea.start[1] = 0;
  }
  $: if ($selectedArea.start[0] <= 0) {
    $selectedArea.start[0] = 0;
  }
  $: if ($selectedArea.end[1] <= 0) {
    $selectedArea.end[1] = 0;
  }
  $: if ($selectedArea.end[0] <= 0) {
    $selectedArea.end[0] = 0;
  }

</script>

<div
  class="selectionHighlight"
  style={`
    transform: translate(${posTopX}px, ${posTopY}px);
    width: ${width}px;
    height: ${height}px;
  `}

></div>

<style>
  .selectionHighlight {	
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: 
      linear-gradient(90deg, var(--highlightColor) 50%, transparent 50%),
      linear-gradient(90deg, var(--highlightColor) 50%, transparent 50%),
      linear-gradient(0deg, var(--highlightColor) 50%, transparent 50%),
      linear-gradient(0deg, var(--highlightColor) 50%, transparent 50%)
    ;
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 15px 1px, 15px 1px, 1px 15px, 1px 15px;
    background-position: left top, right bottom, left bottom, right top;
    animation: border-dance 1s infinite linear;
  }
  @keyframes border-dance {
    0% {
      background-position: left top, right bottom, left bottom, right top;
    }
    100% {
      background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
  }
</style>
