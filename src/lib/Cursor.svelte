<script>
  import { cursorPos, grid, selected } from "./store";

  let isIllegalPosition = false;

  $: if (
    $selected.width === "full" &&
    $cursorPos.x + 1 >= $grid.data[$cursorPos.y]?.length
  ) {
    isIllegalPosition = true;
  } else {
    isIllegalPosition = false;
  }
</script>

<div class="cursorGrid">
  <div
    style={`
    transform: translate(
      ${$cursorPos.x * 10}px, 
      ${$cursorPos.y * 20}px);
    `}
    style:color={isIllegalPosition ? "red" : "lime"}
  >
    {@html "&#" + $selected.unicode + ";"}
  </div>
</div>

<style>
  .cursorGrid {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .cursorGrid div {
    width: fit-content;
  }
</style>
