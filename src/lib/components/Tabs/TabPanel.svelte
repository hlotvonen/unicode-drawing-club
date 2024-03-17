<script>
  import { getContext } from "svelte";
  import { tabContextId } from "./Tabs.svelte";

  export let id;

  const { selectedTab } = getContext(tabContextId);
</script>

{#if $selectedTab === id}
  <slot />
{/if}
