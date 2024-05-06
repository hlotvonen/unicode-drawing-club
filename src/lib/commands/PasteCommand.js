export class PasteCommand {
  constructor(gridStore, dataToPaste, startY, startX) {
    this.gridStore = gridStore; // The Svelte store managing the grid
    this.startX = startX;
    this.startY = startY;
    this.dataToPaste = dataToPaste;
    this.previousData = []; // Array to store previous data for undo
  }

  execute() {
    // Store previous data and paste new data
    this.gridStore.update(grid => {
      this.previousData = [];
      // Loop through the dataToPaste and replace grid cells
      for (let i = 0; i < this.dataToPaste.length; i++) {
        for (let j = 0; j < this.dataToPaste[i].length; j++) {
          let x = this.startX + i;
          let y = this.startY + j;
          // Ensure we're not out of bounds
          if (x >= 0 && x < grid.data.length && y >= 0 && y < grid.data[x].length) {
            this.previousData[i] = this.previousData[i] || [];
            this.previousData[i][j] = grid.data[x][y]; // Store previous data
            grid.data[x][y] = this.dataToPaste[i][j]; // Paste new data
          }
        }
      }
      return { ...grid };
    });
  }

  undo() {
    // Restore the previous data
    this.gridStore.update(grid => {
      for (let i = 0; i < this.previousData.length; i++) {
        for (let j = 0; j < this.previousData[i].length; j++) {
          let x = this.startX + i;
          let y = this.startY + j;
          if (x >= 0 && x < grid.data.length && y >= 0 && y < grid.data[x].length) {
            grid.data[x][y] = this.previousData[i][j];
          }
        }
      }
      return { ...grid };
    });
  }
}
