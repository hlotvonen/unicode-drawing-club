// RemoveColumnCommand.js
export class RemoveColumnCommand {
  constructor(gridStore) {
    this.gridStore = gridStore;
    this.removedColumn = []; // To store the removed column for undo
    this.removedColumnIndex = null; // To track the index of the removed column
  }

  execute() {
    this.gridStore.update((grid) => {
      if (grid.width > 0) {
        this.removedColumn = grid.data.map((row) => row.pop()); // Remove and store the last cell of each row
        grid.width -= 1;
        this.removedColumnIndex = grid.width; // Update after width reduction
      }
      return { ...grid };
    });
  }

  undo() {
    if (this.removedColumn.length > 0) {
      this.gridStore.update((grid) => {
        grid.data.forEach((row, index) => {
          row.splice(this.removedColumnIndex, 0, this.removedColumn[index]); // Re-insert the removed cell
        });
        grid.width += 1;
        return { ...grid };
      });
    }
  }
}
