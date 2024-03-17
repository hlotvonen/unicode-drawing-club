<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import Canvas from "./Canvas.svelte";
  import Sidebar from "./Sidebar.svelte";

  let direction = writable("horizontal"); // Default direction

  // Function to update the direction based on window size
  function updateDirection() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    direction.set(aspectRatio >= 1 ? "horizontal" : "vertical");
  }

  // Set up and tear down the window resize event listener
  onMount(() => {
    window.addEventListener("resize", updateDirection);
    updateDirection(); // Initial check
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateDirection);
  });
</script>

<PaneGroup direction={$direction}>
  <Pane defaultSize={60}>
    <Canvas />
  </Pane>

  <PaneResizer />

  <Pane defaultSize={40}>
    <Sidebar />
  </Pane>
</PaneGroup>
