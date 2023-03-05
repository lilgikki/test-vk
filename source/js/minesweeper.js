import {changeTime, clearTime, timeZero} from './time.js';
import {bombsCounter} from './bombs.js';

const FIELD__SIZE = 16;
const BOMBS_COUNT = 40;

const field = document.querySelector('.field');
const playButton = document.querySelector('.minesweeper__play');

let openCells = 0;
let firstClick = true;
let gameActive = false;

// Испуганный смайлик
const scaryEmoji = (cell) => {
  if (playButton.classList.contains('minesweeper__play--start') && cell) {
    playButton.classList.remove('minesweeper__play--start');
    playButton.classList.add('minesweeper__play--scary');
  }
};

// Обычный смайлик
const basicEmoji = () => {
  playButton.removeAttribute('class');
  playButton.classList.add('minesweeper__play');
  playButton.classList.add('minesweeper__play--start');
};

// "Мертвый" смайлик
const deadEmoji = () => {
  playButton.classList.remove('minesweeper__play--scary');
  playButton.classList.remove('minesweeper__play--start');
  playButton.classList.add('minesweeper__play--dead');
};

// Счастливый смайлик
const happyEmoji = () => {
  playButton.classList.remove('minesweeper__play--scary');
  playButton.classList.remove('minesweeper__play--start');
  playButton.classList.add('minesweeper__play--happy');
};

// Рандомные одномерные координаты бомб
const generateArrayRandomNumber = (min, max, firstNum) => {
	let totalNumbers = max - min + 1, arrayTotalNumbers = [], arrayRandomNumbers = [], tempRandomNumber;

	while (totalNumbers--) {
		arrayTotalNumbers.push(totalNumbers + min);
	}

  while (arrayRandomNumbers.length < BOMBS_COUNT) {
    tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));

    // Условие того, бомба не поставится на первую нажаю ячейку или не станет соседкой этой ячейки
    // const emptyFirstClick = (arrayTotalNumbers[tempRandomNumber] !== firstNum) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - 1)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + 1)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - 1 + FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + 1 + FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - 1 - FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum + 1 - FIELD__SIZE)) && (arrayTotalNumbers[tempRandomNumber] !== (firstNum - FIELD__SIZE));

    // Условие того, что бомба не поставится на первую нажаю ячейку
    const emptyFirstClick = arrayTotalNumbers[tempRandomNumber] !== firstNum;
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

  // Рестарт игры
  const clearGame = () => {
    openCells = 0;
    // Очищаем массив ячеек и массив проверенных ячеек
    for (let o = 0; o < FIELD__SIZE; o++) {
      arr[o] = [];
      arrChecked[o] = [];
      for (let p = 0; p < FIELD__SIZE; p++) {
        arr[o][p] = 0;
        arrChecked[o][p] = 0;
      }
    }
    // Очищение времени и количество бомб
    clearTime();
    timeZero();
    countBombs = BOMBS_COUNT;
    bombsCounter(countBombs);
    // Закрытие всех ячеек
    for (let o = 0; o < FIELD__SIZE*FIELD__SIZE; o++) {
      cells[o].removeAttribute('class');
      cells[o].classList.add('field__cell');
      cells[o].classList.add('field__cell--closed');
    }
    basicEmoji();
    firstClick = true;
    gameActive = false;
  };

  // Победа в игре
  const gameWin = () => {
    openCells = 0;
    // Очищаю кол-во бомб и останавливаю время
    bombsCounter(0);
    countBombs = BOMBS_COUNT;
    clearTime();
    // Перевожу оставшиеся закрытые ячейки с бомбами в статус "флажок"
    for (let o = 0; o < FIELD__SIZE*FIELD__SIZE; o++) {
      if (cells[o].classList.contains('field__cell--closed') || cells[o].classList.contains('field__cell--quest')) {
        cells[o].classList.remove('field__cell--closed');
        cells[o].classList.remove('field__cell--quest');
        cells[o].classList.add('field__cell--flag');
      }
    }
    gameActive = false;
  };

  // Проигрыш
  const gameLoss = () => {
    // Открываю все бомбы
    for (let o = 0; o < FIELD__SIZE*FIELD__SIZE; o++) {
      if (cells[o].classList.contains('field__cell--closed') && arr[Math.floor(o / FIELD__SIZE)][o % FIELD__SIZE] == 9 || cells[o].classList.contains('field__cell--quest') && arr[Math.floor(o / FIELD__SIZE)][o % FIELD__SIZE] == 9) {
        cells[o].classList.remove('field__cell--closed');
        cells[o].classList.remove('field__cell--quest');
        cells[o].classList.add('field__cell--bomb');
      } else if (cells[o].classList.contains('field__cell--flag') && arr[Math.floor(o / FIELD__SIZE)][o % FIELD__SIZE] == 9) {
        cells[o].classList.remove('field__cell--flag');
        cells[o].classList.add('field__cell--bomb-flag');
      }
    }
    deadEmoji();
    clearTime();
    gameActive = false;
  };

  cells.forEach((cell, i) => {
    // Клик на ячейку
    const clickCell = () => {
      // Открытие ячейки, в соотсветсвие с ее значeнием в массиве и ее соседями
      const showCell = (a, x, y) => {
        switch(a[x][y]) {
          case 0:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--opened');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
            break;
          case 1:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--1');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
            break;
          case 2:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--2');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
            break;
          case 3:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--3');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
            break;
          case 4:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--4');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
            break;
          case 5:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--5');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
            break;
          case 6:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--6');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
              break;
          case 7:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--7');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
              break;
          case 8:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--8');
            openCells++;
            if (openCells == FIELD__SIZE*FIELD__SIZE - BOMBS_COUNT) {
              gameWin();
            }
              break;
          case 9:
            cells[x*FIELD__SIZE + y].classList.add('field__cell--bomb-act');
            gameLoss();
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
        if (x > 0 && y > 0 && arrChecked[x-1][y-1] == 0 && (cells[(x-1)*FIELD__SIZE + (y-1)].classList.contains('field__cell--closed'))) {
          cells[(x-1)*FIELD__SIZE + (y-1)].classList.remove('field__cell--closed');
          cells[(x-1)*FIELD__SIZE + (y-1)].classList.remove('field__cell--quest');
          showCell(a, x-1, y-1);
          arrChecked[x-1][y-1] = 1;
          if (a[x-1][y-1] == 0) {
            showEmptyNeighbours(a, x-1, y-1);
          }
        }
        if (x > 0 && y < FIELD__SIZE - 1 && arrChecked[x-1][y+1] == 0 && (cells[(x-1)*FIELD__SIZE + (y+1)].classList.contains('field__cell--closed'))) {
          cells[(x-1)*FIELD__SIZE + (y+1)].classList.remove('field__cell--closed');
          cells[(x-1)*FIELD__SIZE + (y+1)].classList.remove('field__cell--quest');
          showCell(a, x-1, y+1);
          arrChecked[x-1][y+1] = 1;
          if (a[x-1][y+1] == 0) {
            showEmptyNeighbours(a, x-1, y+1);
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
        if (x < FIELD__SIZE - 1 && y > 0 && arrChecked[x+1][y-1] == 0 && (cells[(x+1)*FIELD__SIZE + (y-1)].classList.contains('field__cell--closed'))) {
          cells[(x+1)*FIELD__SIZE + (y-1)].classList.remove('field__cell--closed');
          cells[(x+1)*FIELD__SIZE + (y-1)].classList.remove('field__cell--quest');
          showCell(a, x+1, y-1);
          arrChecked[x+1][y-1] = 1;
          if (a[x+1][y-1] == 0) {
            showEmptyNeighbours(a, x+1, y-1);
          }
        }
        if (x < FIELD__SIZE - 1 && y < FIELD__SIZE - 1 && arrChecked[x+1][y+1] == 0 && (cells[(x+1)*FIELD__SIZE + (y+1)].classList.contains('field__cell--closed'))) {
          cells[(x+1)*FIELD__SIZE + (y+1)].classList.remove('field__cell--closed');
          cells[(x+1)*FIELD__SIZE + (y+1)].classList.remove('field__cell--quest');
          showCell(a, x+1, y+1);
          arrChecked[x+1][y+1] = 1;
          if (a[x+1][y+1] == 0) {
            showEmptyNeighbours(a, x+1, y+1);
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

      // Открытие ячейки
      if (gameActive) {
        basicEmoji();
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
      }
    };

    // Установка\Снятие флага или знака вопроса
    const getFlag = () => {
      if (cell.classList.contains('field__cell--closed') && gameActive == true) {
        cell.classList.remove('field__cell--closed');
        cell.classList.add('field__cell--flag');
        countBombs--;
        bombsCounter(countBombs);
      } else if (cell.classList.contains('field__cell--flag') && gameActive == true) {
        cell.classList.remove('field__cell--flag');
        cell.classList.add('field__cell--quest');
        countBombs++;
        bombsCounter(countBombs);
      } else if (cell.classList.contains('field__cell--quest') && gameActive == true) {
        cell.classList.remove('field__cell--quest');
        cell.classList.add('field__cell--closed');
      }
    }

    // Убираю появление меню, при клике правой кнопки мыши по ячейке
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    })

    // Клик на ячейку
    cell.addEventListener('mouseup', (e) => {
      e.preventDefault();
      if (e.button == 2) {
        getFlag();
      } else if (e.button == 0) {
        clickCell();
      }
    })

    // Зажатие ячейки, для появления испуганного эмодзи
    cell.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.button == 0) {
        scaryEmoji(cell.classList.contains('field__cell--closed'));
      }
    });

    // Рестарт игры
    playButton.addEventListener('click', clearGame);
  })
};

export {activateCell};
