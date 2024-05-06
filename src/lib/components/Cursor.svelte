<script>
  import { cursorPos, grid, selected, preview } from "../store.js";

  $: if ($cursorPos.x >= $grid.width) {
    $cursorPos.x = $grid.width - 1;
  }
  $: if ($cursorPos.y >= $grid.height) {
    $cursorPos.y = $grid.height - 1;
  }
  $: if ($cursorPos.x <= 0) {
    $cursorPos.x = 0;
  }
  $: if ($cursorPos.y <= 0) {
    $cursorPos.y = 0;
  }
  let glyph;
  $: glyph = $preview.unicode === null ? $selected.unicode : $preview.unicode;
</script>

<div class="cursorGrid">
  <div
    style={`
    transform: translate(
      ${$cursorPos.x * ($grid.fontSize / 2)}px, 
      ${$cursorPos.y * $grid.fontSize}px);
    `}
  >
    {@html "&#" + glyph + ";"}
  </div>
</div>

<style>
  .cursorGrid {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .cursorGrid div {
    width: fit-content;
    opacity: 0.7;
    color: var(--highlightColor);
  }
</style>
