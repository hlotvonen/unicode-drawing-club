// ReplaceCellCommand.js
export class ReplaceCellCommand {
  constructor(gridStore, row, column, newValue) {
    this.gridStore = gridStore; // The Svelte store managing the grid
    this.row = row;
    this.column = column;
    this.newValue = newValue;
    this.previousValue = null; // To be set when execute() is called
  }

  execute() {
    // Get the current grid data to find the previous value
    // and to set the new value
    //stats

    console.log("ReplaceCellCommand.execute");
    this.gridStore.update((grid) => {
      this.previousValue = grid.data[this.row][this.column];

      // Updating stats directly on the grid object passed to the update function
      if (this.newValue.unicode === 160) {
        grid.stats.deletes++;
      } else {
        grid.stats.inserts++;
      }
      grid.stats.keysPressed++;

      grid.data[this.row][this.column] = this.newValue;
      return { ...grid }; // Important to return the updated grid
    });
  }

  undo() {
    // Use the stored previousValue to undo the change
    this.gridStore.update((grid) => {
      grid.data[this.row][this.column] = this.previousValue;
      return { ...grid }; // Return the grid to ensure the store is updated
    });
  }
}
