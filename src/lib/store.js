import { get } from 'svelte/store';
import { writable } from "@macfja/svelte-persistent-store";
import { getBoundingRectangle } from './utils/geometry';

export let timelapseRunning = writable("timelapseRunning", false);
export const selected = writable("selected", {
  unicode: 67
});
export const preview = writable("preview", {
  unicode: 67
});
export const cursorPos = writable("cursorPos", { x: 0, y: 0 });
export const selectedArea = writable("selectedArea", { start: [2,5], end: [3, 10] });
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
  mobileControls: true,
  checkeredBackground: true,
  selectingArea: true
});
export function select(unicode) {
  selected.set({
    unicode: unicode
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
    unicode: 160
  };
};

export function updateStats(statToUpdate) {
  if(statToUpdate === 'keysPressed') {
    grid.update(current => {
      return {
        ...current,
        stats: {
          ...current.stats,
          keysPressed: current.stats.keysPressed + 1
        }
      };
    });
  }
}

export function moveCursor(axis, amount) {
  updateStats('keysPressed');

  cursorPos.update(cursor => {
      const gridValue = get(grid);
      const newPos = cursor[axis] + amount;
      const maxPos = axis === 'x' ? gridValue.width - 1 : gridValue.height - 1;
      const clampedPos = Math.min(Math.max(parseInt(newPos), 0), maxPos);
      return { ...cursor, [axis]: clampedPos };
  });
}

// function getSelectedArea(selectionAreaValues, cursorPosValues) {
//   if (!selectionAreaValues.start) {
//     return null
//   }
//   if (selectionAreaValues.start && !selectionAreaValues.end) {
//     return getBoundingRectangle(selectionAreaValues.start, [
//       cursorPosValues.y,
//       cursorPosValues.x,
//     ])
//   }
//   return [selectionAreaValues.start, this.selectionArea.end]
// }

// export function selectArea(axis, amount) {
//   moveCursor(axis, amount)
  
//   const selectionAreaValues = get(selectionArea);
//   const cursorPosValues = get(cursorPos);

//   if (selectionAreaValues.start && !selectionAreaValues.end) {
//     const [selectionStart, selectionEnd] = getSelectedArea(selectionAreaValues, cursorPosValues)
//     selectionArea.update(current => {
//       return {
//         start: selectionStart,
//         end: selectionEnd
//       };
//     });
//   } else {
//     selectionArea.update(current => {
//       return {
//         start: [cursorPosValues.y, cursorPosValues.x],
//         end: [0, 0]
//       };
//     });
//   }
// }
// export function getSelectedArea() {
//   const selectionAreaValues = get(selectionArea);
//   const selectionAreaValues = get(selectionArea);

//   if (!selectionAreaValues.start) {
//     return null
//   }

//   if (selectionAreaValues.start && !selectionAreaValues.end) {
//     return getBoundingRectangle(selectionAreaValues.start, [
//       this.selected_y,
//       this.selected_x,
//     ])
//   }
//   return [this.selectionArea.start, this.selectionArea.end]
// }