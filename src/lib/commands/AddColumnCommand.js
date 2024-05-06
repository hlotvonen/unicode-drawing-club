// AddColumnCommand.js
export class AddColumnCommand {
  constructor(gridStore, getEmptyCell, direction, x) {
    this.gridStore = gridStore;
    this.getEmptyCell = getEmptyCell;
    this.addedColumnIndex = null;
    this.direction = direction;
    this.x = x;
  }

  execute() {
    this.gridStore.update((grid) => {
      let newColumnIndex = 0;
      if(this.direction === 'right') {
        newColumnIndex = this.x + 1;
        grid.data.forEach((row) => row.splice(this.x + 1, 0, this.getEmptyCell()));
      }
      if(this.direction === 'left') {
        newColumnIndex = this.x;
        grid.data.forEach((row) => row.splice(this.x, 0, this.getEmptyCell()));
      }
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
