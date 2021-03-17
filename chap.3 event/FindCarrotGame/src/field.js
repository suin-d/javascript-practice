'use strict';
import * as sound from './sound.js';

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});
export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    // 받아온 carrot&bugCount 멤버변수에 할당
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    // this.onClick = this.onClick.bind(this); // 방법(1) => 일반적으로 쓰진 않음 보통은 arrow 함수

    // this.field.addEventListener('click', (event) => this.onClick()); // 방법(2) => event를 전달받아 onClick에 event 넣어서 호출

    this.field.addEventListener('click', this.onClick);
    /*
        버그가 클릭이 안되는 바인딩 이슈 
        JS에서는 함수를 인자로 어딘가에 전달할 때 클래스 정보는 함께 전달되지 않는다.(onClick함수에서 this가 이 클래스인지 인지하지 못함)
        클래스정보를 무시하고 싶지 않을 때는 함수를 클래스와 바인딩 해줘야 한다. (this 바인딩!)

        this라는 것은 어떤 클래스 안에 있는 함수를 다른 콜백으로 전달할 때, 그 함수가 포함되어져 있는 클래스의 정보가 사라진다. 
         그래서 클래스와 함수를 묶을 수 있는 바인딩이라는 것이 있는데, 
         함수야 이 클래스와 바인딩해 라고 코드를 작성할 수도, arrow function을 쓸 수 있다. 
    */
  }

  init() {
    this.field.innerHTML = '';
    this._addItem(ItemType.carrot, this.carrotCount, 'img/carrot.png');
    this._addItem(ItemType.bug, this.bugCount, 'img/bug.png');
  }

  //onItemClick이 클릭되면 호출
  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  // typeScript는 private 멤버변수(클래스 내부에서만 사용 가능)를 만들 수 있는데 js에서는 (underscore)_ 를 이용해 프라이빗 함수임을 명시(예전에 쓰던 방법)
  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE * 1.5;
    const y2 = this.fieldRect.height - CARROT_SIZE * 1.5;

    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }
  // 방법(3) => onClick이라는 멤버변수로 만들고 arrow function을 가리키게
  onClick = (event) => {
    const target = event.target;
    if (target.matches('.carrot')) {
      // matches(): css셀렉터가 해당하는지 확인하는 함수
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick(ItemType.carrot);
      // this.onItemClick에 콜백이 등록되어 있으면 onItemClick의 함수를 호출
    } else if (target.matches('.bug')) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
