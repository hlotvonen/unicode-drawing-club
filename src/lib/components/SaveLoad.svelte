<script>
  import { grid } from "../store";
  import { fileSave, fileOpen } from "browser-fs-access";

  export async function saveAsFile() {
    const blob = new Blob([JSON.stringify($grid)], {
      type: "application/json",
    });
    await fileSave(blob, {
      fileName: `unicode_drawing.json`,
      extensions: [".json"],
    });
  }
  export async function loadFromFile() {
    const blob = await fileOpen({
      mimeTypes: ["application/json"],
      extensions: [".json"],
      multiple: false,
      description: "Unicode Drawing file",
      startIn: "downloads",
    });
    function loadFile() {
      blob
        .text()
        .then((result) => {
          return JSON.parse(result);
        })
        .then((result) => {
          grid.update(($grid) => {
            $grid = result;
            return { ...$grid };
          });
        });
    }
    loadFile();
  }
</script>

<button on:click={saveAsFile}>Save</button>
<button on:click={loadFromFile}>Load</button>
