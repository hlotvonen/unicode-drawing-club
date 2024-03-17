// ResetCanvasCommand.js
export class ResetCanvasCommand {
  constructor(gridStore, height, width, getEmptyCanvas) {
    this.gridStore = gridStore;
    this.newHeight = height;
    this.newWidth = width;
    this.getEmptyCanvas = getEmptyCanvas;
    this.previousState = null; // To store the grid's state before reset
  }

  execute() {
    // Store the current state before resetting
    this.gridStore.update((current) => {
      this.previousState = { ...current };
      return {
        ...current,
        data: this.getEmptyCanvas(this.newHeight, this.newWidth),
        height: this.newHeight,
        width: this.newWidth,
      };
    });
  }

  undo() {
    // Restore the previous state
    if (this.previousState) {
      this.gridStore.set(this.previousState);
    }
  }
}
