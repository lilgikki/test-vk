import {changeTime} from './time.js';
import {bombsCounter} from './bombs.js';

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

    // Условие того, бомба не поставится на первую нажаю ячейку или на ее соседей
    const emptyFirstClick = (arrayTotalNumbers[tempRandomNumber] !== firstNum) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - 1)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + 1)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - 1 + FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + 1 + FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - 1 - FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + 1 - FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - FIELD__SIZE));
    // Бомба не попадает на первую ячейке или на ее соседей, то она записывается в массив "бомб"
    if (emptyFirstClick) {
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
  let countBombs = BOMBS_COUNT;
  let arr;
  let arrChecked = [];
  const cells = field.querySelectorAll('.field__cell');

  cells.forEach((cell, i) => {
    // Испуганный смайлик
    const scaryEmoji = () => {
      if (playButton.classList.contains('sapper__play--start') && cell.classList.contains('field__cell--closed')) {
        playButton.classList.remove('sapper__play--start');
        playButton.classList.add('sapper__play--scary');
      }
    };

    // Клик на ячейку
    const clickCell = () => {

      // Открытие ячейки, в соотсветсвие с ее значeнием в массиве и ее соседями
      const showCell = (a, x, y) => {
        switch(a[x][y]) {
          case 0:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--opened');
            break;
          case 1:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--1');
            break;
          case 2:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--2');
            break;
          case 3:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--3');
            break;
          case 4:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--4');
            break;
          case 5:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--5');
            break;
          case 6:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--6');
              break;
          case 7:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--7');
              break;
          case 8:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--8');
              break;
          case 9:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--bomb-act');
              break;
        }
        return;
      };

      // Открытие соседних пустых ячеек
      const showEmptyNeighbours = (a, x, y) => {
        if (x > 0 && arrChecked[x-1][y] == 0 && (cells[(x-1)*FIELD__SIZE + y].classList.contains('field__cell--closed'))) {
          cells[(x-1)*FIELD__SIZE + y].classList.remove('field__cell--closed');
          cells[(x-1)*FIELD__SIZE + y].classList.remove('field__cell--quest');
          showCell(a, x-1, y);
          arrChecked[x-1][y] = 1;
          if (a[x-1][y] == 0) {
            showEmptyNeighbours(a, x-1, y);
          }
        }
        if (y > 0 && arrChecked[x][y-1] == 0 && (cells[x*FIELD__SIZE + (y-1)].classList.contains('field__cell--closed'))) {
          cells[x*FIELD__SIZE + (y-1)].classList.remove('field__cell--closed');
          cells[x*FIELD__SIZE + (y-1)].classList.remove('field__cell--quest');
          showCell(a, x, y-1);
          arrChecked[x][y-1] = 1;
          if (a[x][y-1] == 0) {
            showEmptyNeighbours(a, x, y-1);
          }
        }
        if (y < FIELD__SIZE - 1 && arrChecked[x][y+1] == 0 && (cells[x*FIELD__SIZE + (y+1)].classList.contains('field__cell--closed'))) {
          cells[x*FIELD__SIZE + (y+1)].classList.remove('field__cell--closed');
          cells[x*FIELD__SIZE + (y+1)].classList.remove('field__cell--quest');
          showCell(a, x, y+1);
          arrChecked[x][y+1] = 1;
          if (a[x][y+1] == 0) {
            showEmptyNeighbours(a, x, y+1);
          }
        }
        if (x < FIELD__SIZE - 1 && arrChecked[x+1][y] == 0 && (cells[(x+1)*FIELD__SIZE + y].classList.contains('field__cell--closed'))) {
          cells[(x+1)*FIELD__SIZE + y].classList.remove('field__cell--closed');
          cells[(x+1)*FIELD__SIZE + y].classList.remove('field__cell--quest');
          showCell(a, x+1, y);
          arrChecked[x+1][y] = 1;
          if (a[x+1][y] == 0) {
            showEmptyNeighbours(a, x+1, y);
          }
        }
        return;
      };

      // Первый клик или нет
      if (firstClick) {
        arr = renderArray(i);
        for (let o = 0; o < FIELD__SIZE; o++) {
          arrChecked[o] = [];
          for (let p = 0; p < FIELD__SIZE; p++) {
            arrChecked[o][p] = 0;
          }
        }
        firstClick = false;
        gameActive = true;
        changeTime();
      }

      // Смена лица на улыбающееся
      if (playButton.classList.contains('sapper__play--scary')) {
        playButton.classList.add('sapper__play--start');
        playButton.classList.remove('sapper__play--scary');
      }

      // Открытие ячейки
      if (cell.classList.contains('field__cell--closed')) {
        const n = Math.floor(i / FIELD__SIZE);
        const m = i % FIELD__SIZE;
        cell.classList.remove('field__cell--closed');
        showCell(arr, n, m);
        arrChecked[n][m] = 1;
        if (arr[n][m] == 0) {
          showEmptyNeighbours(arr, n, m);
        }
      }
    };

    const getFlag = () => {
      if (cell.classList.contains('field__cell--closed')) {
        cell.classList.remove('field__cell--closed');
        cell.classList.add('field__cell--flag');
        countBombs--;
        bombsCounter(countBombs);
      } else if (cell.classList.contains('field__cell--flag')) {
        cell.classList.remove('field__cell--flag');
        cell.classList.add('field__cell--quest');
        countBombs++;
        bombsCounter(countBombs);
      } else if (cell.classList.contains('field__cell--quest')) {
        cell.classList.remove('field__cell--quest');
        cell.classList.add('field__cell--closed');
      }
    }

    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    })

    cell.addEventListener('mouseup', (e) => {
      e.preventDefault();
      if (e.button == 2) {
        getFlag();
      } else if (e.button == 0) {
        clickCell();
      }
    })

    cell.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.button == 0) {
        scaryEmoji();
      }
    });
  })

};

export {activateCell};
