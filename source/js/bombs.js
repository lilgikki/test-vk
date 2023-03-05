const bombsDiv = document.querySelector('.bombs');
const bombs = bombsDiv.querySelectorAll('div');

const resetBombs = () => {
  for (let i = 0; i < 3; i++) {
    bombs[i].removeAttribute('class');
    if (i == 1) {
      bombs[i].classList.add('time__4');
    } else {
      bombs[i].classList.add('time__0');
    }
  }
};

const setCount = (block, k) => {
  if (k == 1) {
    block.classList.remove('bombs__0');
    block.classList.remove('bombs__1');
    block.classList.remove('bombs__2');
    block.classList.add('bombs__1');
  } else if (k == 2) {
    block.classList.remove('bombs__1');
    block.classList.remove('bombs__2');
    block.classList.remove('bombs__3');
    block.classList.add('bombs__2');
  } else if (k == 3) {
    block.classList.remove('bombs__2');
    block.classList.remove('bombs__3');
    block.classList.remove('bombs__4');
    block.classList.add('bombs__3');
  } else if (k == 4) {
    block.classList.remove('bombs__3');
    block.classList.remove('bombs__4');
    block.classList.remove('bombs__5');
    block.classList.add('bombs__4');
  } else if (k == 5) {
    block.classList.remove('bombs__4');
    block.classList.remove('bombs__5');
    block.classList.remove('bombs__6');
    block.classList.add('bombs__5');
  } else if (k == 6) {
    block.classList.remove('bombs__5');
    block.classList.remove('bombs__6');
    block.classList.remove('bombs__7');
    block.classList.add('bombs__6');
  } else if (k == 7) {
    block.classList.remove('bombs__6');
    block.classList.remove('bombs__7');
    block.classList.remove('bombs__8');
    block.classList.add('bombs__7');
  } else if (k == 8) {
    block.classList.remove('bombs__7');
    block.classList.remove('bombs__8');
    block.classList.remove('bombs__9');
    block.classList.add('bombs__8');
  } else if (k == 9) {
    block.classList.remove('bombs__8');
    block.classList.remove('bombs__9');
    block.classList.remove('bombs__0');
    block.classList.add('bombs__9');
  } else if (k == 0) {
    block.classList.remove('bombs__9');
    block.classList.remove('bombs__0');
    block.classList.remove('bombs__1');
    block.classList.add('bombs__0');
  }
};

const bombsCounter = (k) => {
  const k1 = k % 10;
  const k2 = Math.floor((k % 100 - k1) / 10);
  const k3 = Math.floor((k % 1000 - k2*10 - k1) / 100);
  setCount(bombs[0], k3);
  setCount(bombs[1], k2);
  setCount(bombs[2], k1);
};

export {bombsCounter, resetBombs};
