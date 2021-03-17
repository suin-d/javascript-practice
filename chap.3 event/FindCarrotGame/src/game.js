'use strict';
import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

// 자바스크립트에서 타입 보장 방법
export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});
// Builder Pattern : 오브젝트를 만들 때 간단명료하게, 가독성 좋게 만들기
export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration; // 전달받은 duration 할당
    return this;
    // 클래스 자체 리턴
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  // build 함수 호출 시, Game 함수를 만들어서 리턴
  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.playBtn = document.querySelector('.game__button');
    this.playBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    // 게임의 시작 여부
    this.started = false;
    // 스코어
    this.score = 0;
    // 타이머
    this.timer = undefined;

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);
  }

  // 게임이 끝났을 때 main.js에 알려줄 수 있도록 콜백받기
  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }
  // reason을 받아와 왜 stop 되었는지 명시
  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameBtn();
    sound.stopBackground();

    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    // 조건이 맞지 않을 때 빨리 return하도록 만드는 것이 중요
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  showStopButton() {
    const icon = this.playBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.playBtn.style.visibility = `visible`;
  }

  hideGameBtn() {
    this.playBtn.style.visibility = `hidden`;
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
