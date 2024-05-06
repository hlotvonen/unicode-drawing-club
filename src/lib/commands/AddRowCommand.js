// AddRowCommand.js
export class AddRowCommand {
  constructor(gridStore, getEmptyRow, direction, y) {
    this.gridStore = gridStore;
    this.getEmptyRow = getEmptyRow;
    this.direction = direction;
    this.y = y;
    this.addedRowIndex = null;
  }

  execute() {
    this.gridStore.update((grid) => {
      let newRowIndex = 0;
      if(this.direction === 'down') {
        newRowIndex = this.y + 1;
        grid.data.splice(this.y + 1, 0, this.getEmptyRow(grid.width));
      }
      if(this.direction === 'up') {
        newRowIndex = this.y;
        grid.data.splice(this.y, 0, this.getEmptyRow(grid.width));
      }
      grid.height += 1;
      this.addedRowIndex = newRowIndex;
      return { ...grid };
    });
  }

  undo() {
    this.gridStore.update((grid) => {
      if (grid.height > 0 && this.addedRowIndex !== null) {
        grid.data.splice(this.addedRowIndex, 1);
        grid.height -= 1;
      }
      return { ...grid };
    });
  }
}
