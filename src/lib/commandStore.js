import { get, writable } from "svelte/store";
import { timelapseRunning } from "./store.js";

export function commandStore(initialValue) {
  const { subscribe, set } = writable(initialValue);
  let history = [];
  let currentIndex = -1;
  let groupStack = [];

  const execute = (command) => {
    if (groupStack.length > 0) {
      // We're currently grouping commands, so append this command to the latest group
      const latestGroup = groupStack[groupStack.length - 1];
      latestGroup.push(command);
    } else {
      // No grouping, execute as normal
      command.execute();
      history = [...history.slice(0, currentIndex + 1), command];
      currentIndex++;
    }
  };

  const beginGroup = () => {
    // Start a new command group
    groupStack.push([]);
  };

  const endGroup = () => {
    if (groupStack.length === 0) {
      console.error("No command group to end");
      return;
    }

    // Pop the latest group off the stack and execute it as a single command
    const group = groupStack.pop();
    const groupCommand = {
      execute: () => group.forEach((cmd) => cmd.execute()),
      undo: () =>
        group
          .slice()
          .reverse()
          .forEach((cmd) => cmd.undo()),
    };

    // Add the grouped command to history
    execute(groupCommand);
  };

  const undo = () => {
    if (currentIndex >= 0) {
      const command = history[currentIndex];
      if (command.undo) {
        console.log("Undoing command:", command);
        command.undo();
        currentIndex--;
        set(history);
        return true; // Indicates undo was successful
      }
    }
    return false; // Indicates there was nothing to undo
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const command = history[currentIndex + 1];
      if (command.execute) {
        command.execute();
        currentIndex++;
        set(history);
        return true; // Indicates redo was successful
      }
    }
    return false; // Indicates there was nothing to redo
  };

  const canUndo = () => currentIndex >= 0;
  const canRedo = () => currentIndex < history.length - 1;

  // Resets the history to its initial state
  const reset = () => {
    history = [];
    currentIndex = -1;
    set(history);
  };

  return { execute, beginGroup, endGroup, undo, redo, canUndo, canRedo };
}
