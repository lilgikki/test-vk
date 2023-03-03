const FIELD__SIZE = 16;

const field = document.querySelector('.field');
const fieldCell = document.getElementById('field-cell').content.querySelector('.field__cell');

//Отрисовка ячеек
const renderCells = (cb) => {

  // Отрисовка ячеек
  for (let i = 0; i < FIELD__SIZE*FIELD__SIZE; i++) {
    const cell = fieldCell.cloneNode(true);
    field.append(cell);
  }

  cb();
}

export {renderCells};
