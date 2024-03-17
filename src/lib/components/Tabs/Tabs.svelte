<script context="module">
  export const tabContextId = new Set();
</script>

<script>
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let selectedId;

  const selectedTab = writable(selectedId);

  $: selectedTab.set(selectedId);

  setContext(tabContextId, {
    selectTab: (tabId) => (selectedId = tabId),
    selectedTab,
  });
</script>

<div class="tabs">
  <slot />
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
</style>
