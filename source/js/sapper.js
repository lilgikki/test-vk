import {changeTime} from './time.js';

const FIELD__SIZE = 16;
const BOMBS_COUNT = 40;

const field = document.querySelector('.field');
const playButton = document.querySelector('.sapper__play');

let firstClick = true;
let gameActive = false;

// Рандомные одномерные координаты бомб
const generateArrayRandomNumber = (min, max, firstNum) => {
	let totalNumbers = max - min + 1, arrayTotalNumbers = [], arrayRandomNumbers = [], tempRandomNumber;

	while (totalNumbers--) {
		arrayTotalNumbers.push(totalNumbers + min);
	}

  while (arrayRandomNumbers.length < BOMBS_COUNT) {
    tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
    if (arrayTotalNumbers[tempRandomNumber] !== firstNum) {
      arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
      arrayTotalNumbers.splice(tempRandomNumber, 1);
    }
  }
	return arrayRandomNumbers;
};

// Генерация массива
const renderArray = (l) => {
  let arr = [];

  for (let i = 0; i < FIELD__SIZE; i++) {
    arr[i] = [];
    for (let j = 0; j < FIELD__SIZE; j++) {
      arr[i][j] = 0;
    }
  }

  const bombs = generateArrayRandomNumber(0, 255, l);

  //Перенос расположение мин в одномерныхь координатах на двумерный массив
  for (let i = 0; i < BOMBS_COUNT; i++) {
    const n = Math.floor(bombs[i] / FIELD__SIZE);
    const m = bombs[i] % FIELD__SIZE;
    arr[n][m] = 9;
  }

  //Заполнение массива, где 0 - соседей нет, а 9 - ячейка заложена миной (от 1 до 8 - количество "опасных" соседей)
  for (let i = 0; i < FIELD__SIZE; i++) {
    for (let j = 0; j < FIELD__SIZE; j++) {
      if (arr[i][j] != 9) {
        let k = 0;

        // Считаю соседей-мины
        if ((i > 0) && (j > 0) && (arr[i-1][j-1] == 9)) {k++;}
        if ((i > 0) && (arr[i-1][j] == 9)) {k++;}
        if ((i > 0) && (j < FIELD__SIZE - 1) && (arr[i-1][j+1] == 9)) {k++;}
        if ((j > 0) && (arr[i][j-1] == 9)) {k++;}
        if ((j < FIELD__SIZE - 1) && (arr[i][j+1] == 9)) {k++;}
        if ((i < FIELD__SIZE - 1) && (j > 0) && (arr[i+1][j-1] == 9)) {k++;}
        if ((i < FIELD__SIZE - 1) && (arr[i+1][j] == 9)) {k++;}
        if ((i < FIELD__SIZE - 1) && (j < FIELD__SIZE - 1) && (arr[i+1][j+1] == 9)) {k++;}

        arr[i][j] = k;
      }
    }
  }

  return arr;
};

const activateCell = () => {
  let arr;
  const cells = field.querySelectorAll('.field__cell');

  cells.forEach((cell, i) => {
    cell.addEventListener('mousedown', () => {
      // Испуганный смайлик
      if (playButton.classList.contains('sapper__play--start')) {
        playButton.classList.remove('sapper__play--start');
        playButton.classList.add('sapper__play--scary');
      }
    });

    cell.addEventListener('mouseup', () => {
      // Первый клик или нет
      if (firstClick) {
        arr = renderArray(i);
        firstClick = false;
        gameActive = true;
        changeTime();
      }

      // Смена лица на улыбающееся
      if (playButton.classList.contains('sapper__play--scary')) {
        playButton.classList.add('sapper__play--start');
        playButton.classList.remove('sapper__play--scary');
      }

      if (cell.classList.contains('field__cell--closed')) {
        const n = Math.floor(i / FIELD__SIZE);
        const m = i % FIELD__SIZE;
        cell.classList.remove('field__cell--closed');

        switch(arr[n][m]) {
          case 0:
            cell.classList.add('field__cell--opened');
            break;
          case 1:
            cell.classList.add('field__cell--1');
            break;
          case 2:
            cell.classList.add('field__cell--2');
            break;
          case 3:
            cell.classList.add('field__cell--3');
            break;
          case 4:
            cell.classList.add('field__cell--4');
            break;
          case 5:
            cell.classList.add('field__cell--5');
            break;
          case 6:
              cell.classList.add('field__cell--6');
              break;
          case 7:
              cell.classList.add('field__cell--7');
              break;
          case 8:
              cell.classList.add('field__cell--8');
              break;
          case 9:
              cell.classList.add('field__cell--bomb-act');
              break;
        }
      }
    });
  })

};

export {activateCell};
