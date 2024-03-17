<script>
  import Canvas from "./lib/components/Canvas.svelte";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import Panes from "./lib/components/Panes.svelte";
  import { grid } from "./lib/store.js";
</script>

<div
  class="app"
  style="font-family: {$grid.font}; 
  --backgroundColor: {$grid.backgroundColor}; 
  --foregroundColor: {$grid.foregroundColor};
  --highlightColor: {$grid.highlightColor};
  "
>
  <Panes></Panes>
</div>

<style>
</style>
