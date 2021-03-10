'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 10;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const playBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

// 게임의 시작 여부
let started = false;
// 스코어
let score = 0;
// 타이머
let timer = undefined;

field.addEventListener('click', onFieldClick);

playBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopUpWithText('Replay❓');
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  hideGameBtn();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? 'YOU WON🎉' : 'YOU LOST😛');
}

popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function hidePopUp() {
  popUp.classList.add('pop--up--hide');
}

function showStopButton() {
  const icon = document.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  playBtn.style.visibility = `visible`;
}

function hideGameBtn() {
  playBtn.style.visibility = `hidden`;
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop--up--hide');
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  // 벌레와 당근 생성 뒤 field에 추가
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

function onFieldClick(event) {
  // 조건이 맞지 않을 때 빨리 return하도록 만드는 것이 중요
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    // matches(): css셀렉터가 해당하는지 확인하는 함수
    // carrot!
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    // bug!
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE * 1.5;
  const y2 = fieldRect.height - CARROT_SIZE * 1.5;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
