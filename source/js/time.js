const time = document.querySelector('.time');
const timeBlocks = time.querySelectorAll('.time__0')

const setNum = (block) => {
  if (block.classList.contains('time__0')) {
    block.classList.add('time__1')
    block.classList.remove('time__0')
  } else
  if (block.classList.contains('time__1')) {
    block.classList.add('time__2')
    block.classList.remove('time__1')
  } else
  if (block.classList.contains('time__2')) {
    block.classList.add('time__3')
    block.classList.remove('time__2')
  } else
  if (block.classList.contains('time__3')) {
    block.classList.add('time__4')
    block.classList.remove('time__3')
  } else
  if (block.classList.contains('time__4')) {
    block.classList.add('time__5')
    block.classList.remove('time__4')
  } else
  if (block.classList.contains('time__5')) {
    block.classList.add('time__6')
    block.classList.remove('time__5')
  } else
  if (block.classList.contains('time__6')) {
    block.classList.add('time__7')
    block.classList.remove('time__6')
  } else
  if (block.classList.contains('time__7')) {
    block.classList.add('time__8')
    block.classList.remove('time__7')
  } else
  if (block.classList.contains('time__8')) {
    block.classList.add('time__9')
    block.classList.remove('time__8')
  } else
  if (block.classList.contains('time__9')) {
    block.classList.add('time__0')
    block.classList.remove('time__9')
  }
};

const changeTime = () => {
  setInterval(setNum, 1000, timeBlocks[2]);
  setInterval(setNum, 10000, (timeBlocks[1]));
  setInterval(setNum, 100000, (timeBlocks[0]));
};

export {changeTime};