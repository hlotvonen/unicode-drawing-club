<script>
  import Tabs from "./Tabs/Tabs.svelte";
  import TabPanel from "./Tabs/TabPanel.svelte";
  import TabList from "./Tabs/TabList.svelte";
  import Tab from "./Tabs/Tab.svelte";
  import Settings from "./Settings.svelte";
  import Glyphs from "./Glyphs.svelte";
  import { settings, preview } from "../store";
  import GlyphsPageSelector from "./GlyphsPageSelector.svelte";
  import Info from "./Info.svelte";

  let selectedId = "first";
</script>

<div class="sidebar">
  <Tabs {selectedId}>
    <div class="tab-list-wrapper">
      <TabList>
        <Tab id="first">Glyphs</Tab>
        <Tab id="second">Settings</Tab>
        <Tab id="third">?</Tab>
      </TabList>
      <div class="unicode">
        {$preview.unicode}
      </div>
      <div class="scale-controls">
        <button
          class={$settings.glyphsZoom === 1 ? "selected" : ""}
          on:click={() => ($settings.glyphsZoom = 1)}
        >
          1&times;
        </button>
        <button
          class={$settings.glyphsZoom === 2 ? "selected" : ""}
          on:click={() => ($settings.glyphsZoom = 2)}
        >
          2&times;
        </button>
        <button
          class={$settings.glyphsZoom === 3 ? "selected" : ""}
          on:click={() => ($settings.glyphsZoom = 3)}
        >
          3&times;
        </button>
        <button
          class={$settings.glyphsZoom === 4 ? "selected" : ""}
          on:click={() => ($settings.glyphsZoom = 4)}
        >
          4&times;
        </button>
      </div>
    </div>
    <div class="glyphs-page-selector">
      <GlyphsPageSelector />
    </div>

    <div class="tab-panel-wrapper">
      <TabPanel id="first">
        <Glyphs />
      </TabPanel>

      <TabPanel id="second">
        <Settings />
      </TabPanel>

      <TabPanel id="third">
        <Info />
      </TabPanel>
    </div>
  </Tabs>
</div>

<style>
  .sidebar {
    height: 100%;
    overflow: auto;
    font-size: 16px;
    user-select: none;
  }
  .tab-list-wrapper {
    flex: 0 0 auto;
    display: flex;
    padding: 3px;
    border-bottom: 1px solid var(--foregroundColor);
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .tab-list-wrapper > div {
    flex: 1;
  }
  .tab-panel-wrapper {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tab-list-wrapper .unicode {
    flex: 0 0 auto;
    width: fit-content;
  }
  .scale-controls {
    flex: 0 0 auto;
    display: flex;
    justify-content: end;
    gap: 5px;
  }
  .selected {
    background-color: var(--highlightColor);
  }
</style>
