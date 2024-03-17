<script>
  import { getContext } from "svelte";
  import { tabContextId } from "./Tabs.svelte";

  export let id;

  const { selectedTab, selectTab } = getContext(tabContextId);
</script>

<button class:selected={$selectedTab === id} on:click={() => selectTab(id)}>
  <slot />
</button>

<style>
  .selected {
    color: var(--backgroundColor);
    background: var(--highlightColor);
  }
</style>
