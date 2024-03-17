// RemoveRowCommand.js
export class RemoveRowCommand {
  constructor(gridStore) {
    this.gridStore = gridStore;
    this.removedRow = null; // To store the removed row for undo
  }

  execute() {
    this.gridStore.update((grid) => {
      if (grid.height > 0) {
        this.removedRow = grid.data.pop(); // Remove and store the last row
        grid.height -= 1; // Decrement the height to reflect the removed row
      }
      return { ...grid };
    });
  }

  undo() {
    if (this.removedRow) {
      this.gridStore.update((grid) => {
        grid.data.push(this.removedRow); // Re-insert the removed row
        grid.height += 1; // Increment the height to reflect the added row
        return { ...grid };
      });
      this.removedRow = null; // Clear the removed row after undoing
    }
  }
}
