// AddColumnCommand.js
export class AddColumnCommand {
  constructor(gridStore, getEmptyCell) {
    this.gridStore = gridStore;
    this.getEmptyCell = getEmptyCell;
    this.addedColumnIndex = null; // To track the index of the added column for undo
  }

  execute() {
    this.gridStore.update((grid) => {
      const newColumnIndex = grid.width; // Assuming width represents the number of columns
      grid.data.forEach((row) => row.push(this.getEmptyCell()));
      grid.width += 1;
      this.addedColumnIndex = newColumnIndex;
      return { ...grid };
    });
  }

  undo() {
    if (this.addedColumnIndex !== null) {
      this.gridStore.update((grid) => {
        grid.data.forEach((row) => row.splice(this.addedColumnIndex, 1));
        grid.width -= 1;
        return { ...grid };
      });
    }
  }
}
