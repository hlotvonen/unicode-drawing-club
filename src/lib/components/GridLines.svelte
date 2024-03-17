<script>
  import { grid } from "../store.js";
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
        stroke="var(--foregroundColor)"
        stroke-width="0.5"
        opacity="0.3"
      />
    </pattern>
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="url(#smallGrid)"
    stroke=" var(--foregroundColor)"
    stroke-width="0.5"
  />
</svg>

<style>
  svg {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
  }
</style>
