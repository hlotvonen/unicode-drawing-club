// AddRowCommand.js
export class AddRowCommand {
  constructor(gridStore, getEmptyRow) {
    this.gridStore = gridStore;
    this.getEmptyRow = getEmptyRow; // Function to create an empty row
  }

  execute() {
    this.gridStore.update((grid) => {
      grid.data.push(this.getEmptyRow(grid.width)); // Assuming width represents the number of columns in a row
      grid.height += 1; // Increment the height to reflect the added row
      return { ...grid };
    });
  }

  undo() {
    this.gridStore.update((grid) => {
      if (grid.height > 0) {
        grid.data.pop(); // Remove the last row
        grid.height -= 1; // Decrement the height to reflect the removed row
      }
      return { ...grid };
    });
  }
}
