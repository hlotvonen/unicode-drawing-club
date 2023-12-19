<script>
  import { grid } from "./store";
</script>

<svg
  class="UiGrid"
  width={$grid.width * ($grid.fontSize / 2) + "px"}
  height={$grid.height * $grid.fontSize + "px"}
>
  <defs>
    <pattern
      id="smallGrid"
      width={$grid.fontSize / 2}
      height={$grid.fontSize}
      patternUnits="userSpaceOnUse"
    >
      <path
        d={`M ${$grid.fontSize} 0 L 0 0 0 ${$grid.fontSize}`}
        fill="none"
        stroke="grey"
        stroke-width="0.5"
      />
    </pattern>
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="url(#smallGrid)"
    stroke="black"
    stroke-width="0.5"
  />
</svg>

<style>
  svg {
    position: absolute;
  }
</style>
