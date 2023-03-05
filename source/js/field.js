const FIELD__SIZE = 16;

const field = document.querySelector('.field');
const fieldCell = document.getElementById('field-cell').content.querySelector('.field__cell');

//Отрисовка ячеек
const renderCells = (cb) => {
  for (let i = 0; i < FIELD__SIZE*FIELD__SIZE; i++) {
    const cell = fieldCell.cloneNode(true);
    field.append(cell);
  }

  // Вызов функции отвечающей за работу ячеек
  cb();
}

export {renderCells};
