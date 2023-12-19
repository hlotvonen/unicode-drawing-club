import { writable } from 'svelte/store';
 
export const selected = writable({
  unicode: 67,
  width: "half"
});
export const cursorPos = writable({x:0,y:0});
export const grid = writable({
  width: 67,
  height: 20,
  fontSize:20,
  data: []
});