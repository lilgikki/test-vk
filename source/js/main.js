import {renderCells} from './field.js';
import {activateCell} from './minesweeper.js';

window.addEventListener('DOMContentLoaded', () => {
  renderCells(activateCell);
});

