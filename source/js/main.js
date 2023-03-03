import {renderCells} from './field.js';
import {activateCell} from './sapper.js';

window.addEventListener('DOMContentLoaded', () => {
  renderCells(activateCell);
});

