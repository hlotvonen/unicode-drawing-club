<script>
  let isPanning = false;
  let startX, startY;
  let translation = { x: 0, y: 0 };
  let frameId;
  let clickTimeout;
  let initialDistance = null;

  // Start panning
  function handleMouseDown(event) {
    if (event.button !== 2) return; // Ensure right-click

    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
    event.preventDefault(); // Prevent the default context menu
  }

  // Handle touch start
  function handleTouchStart(event) {
    if (event.touches.length === 2) {
      // Ensure two fingers
      isPanning = true;
      startX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      startY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      event.preventDefault(); // Prevent default actions like zoom
    }
  }

  // Perform panning
  const handleMouseMove = (event) => {
    if (!isPanning) return;

    let clientX = event.clientX;
    let clientY = event.clientY;

    // If it's a touch event, adjust clientX and clientY to the center point between the fingers
    if (event.touches && event.touches.length === 2) {
      clientX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      clientY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    }

    cancelAnimationFrame(frameId);

    frameId = requestAnimationFrame(() => {
      const dx = clientX - startX;
      const dy = clientY - startY;

      translation = { x: dx + translation.x, y: dy + translation.y };

      startX = clientX;
      startY = clientY;
    });
  };

  // Stop panning
  function handleMouseUp() {
    isPanning = false;
    initialDistance = null; // Reset initial distance for next touch interaction
  }

  // Function to handle right-click for potential double-click
  function handleRightClick(event) {
    event.preventDefault(); // Prevent default context menu

    if (clickTimeout) {
      // Detected a double right-click
      clearTimeout(clickTimeout);
      clickTimeout = null;
      translation = { x: 0, y: 0 }; // Reset translation to center the content
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 400); // 400ms threshold for double-click
    }
  }
</script>

<svelte:window
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:touchmove={handleMouseMove}
  on:touchend={handleMouseUp}
/>

<div
  class="container"
  on:mousedown={handleMouseDown}
  on:touchstart={handleTouchStart}
  on:contextmenu={handleRightClick}
>
  <div
    class:grabbing={isPanning}
    class="content"
    style:transform={`translate(${translation.x}px, ${translation.y}px)`}
  >
    <slot />
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    place-content: center;
  }
  .content {
    width: fit-content;
    height: fit-content;
    will-change: transform;
  }
  .grabbing {
    cursor: grabbing; /* Apply grabbing cursor */
  }
</style>
