import { writable } from "@macfja/svelte-persistent-store";

export let timelapseRunning = writable("timelapseRunning", false);
export const selected = writable("selected", {
  unicode: 67,
  width: "half",
});
export const preview = writable("preview", {
  unicode: 67,
  width: "half",
});
export const cursorPos = writable("cursorPos", { x: 0, y: 0 });
export const grid = writable("grid", {
  font: "Unscii",
  width: 16,
  height: 8,
  fontSize: 16,
  backgroundColor: "#000000",
  foregroundColor: "#ffffff",
  highlightColor: "#ff0000",
  stats: {
    chars: 0,
    keysPressed: 0,
    inserts: 0,
    deletes: 0,
    numberOfUniqueGlyphs: 0,
    unicodeFrequency: [],
  },
  data: [],
});
export const settings = writable("settings", {
  showGrid: true,
  showCursor: true,
  sidebarPosition: "right",
  canvasZoom: 2,
  glyphsZoom: 1,
  pageNumberLeft: 0,
  pageNumberRight: 0,
  bigArrows: true,
});
export function select(unicode, width) {
  selected.set({
    unicode: unicode,
    width: width,
  });
}
export const createEmptyCanvas = (height, width) => {
  grid.update((current) => {
    return { ...current, data: getEmptyCanvas(height, width) };
  });
};
export const getEmptyCanvas = (height, width) => {
  return Array.from({ length: height }, () => getEmptyRow(width));
};
export const getEmptyRow = (width) => {
  return Array.from({ length: width }, () => getEmptyCell());
};
export const getEmptyCell = () => {
  //unicode for en space 8194
  return {
    unicode: 160,
    width: "half",
  };
};

// Function to add a column to the canvas
export const addColumn = () => {
  grid.update((current) => {
    current.data.forEach((row) => {
      row.push(getEmptyCell()); // Add a new cell to each row
    });
    current.width += 1; // Increment the width to reflect the added column
    return current;
  });
};

// Function to subtract a column from the canvas
export const removeColumn = () => {
  grid.update((current) => {
    if (current.width > 0) {
      current.data.forEach((row) => {
        row.pop(); // Remove the last cell from each row
      });
      current.width -= 1; // Decrement the width to reflect the removed column
    }
    return current;
  });
};
