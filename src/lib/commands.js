import { grid, getEmptyCell, getEmptyRow, getEmptyCanvas } from "./store.js";
import { AddColumnCommand } from "./commands/AddColumnCommand.js";
import { AddRowCommand } from "./commands/AddRowCommand.js";
import { RemoveColumnCommand } from "./commands/RemoveColumnCommand.js";
import { RemoveRowCommand } from "./commands/RemoveRowCommand.js";
import { ReplaceCellCommand } from "./commands/ReplaceCellCommand.js";
import { ResetCanvasCommand } from "./commands/ResetCanvasCommand.js";
import { commandStore } from "./commandStore.js";

const commands = commandStore([]);

export function undo() {
  commands.undo();
}
export function redo() {
  commands.redo();
}
export function addColumn() {
  const command = new AddColumnCommand(grid, getEmptyCell);
  commands.execute(command);
}
export function addRow() {
  const command = new AddRowCommand(grid, getEmptyRow);
  commands.execute(command);
}
export function removeColumn() {
  const command = new RemoveColumnCommand(grid);
  commands.execute(command);
}
export function removeRow() {
  const command = new RemoveRowCommand(grid);
  commands.execute(command);
}
export function replaceCell(y, x, newValue) {
  const command = new ReplaceCellCommand(grid, y, x, newValue);
  commands.execute(command);
}
export function resetCanvas(height, width) {
  const command = new ResetCanvasCommand(grid, height, width, getEmptyCanvas);
  commands.execute(command);
}
