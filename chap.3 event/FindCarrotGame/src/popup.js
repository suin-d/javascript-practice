'use strict';

export default class PopUp {
  // PopUp 이라는 클래스에 멤버 변수 3개 만들고, 생성자 안에서 DOM 요소 받아와 할당
  constructor() {
    // constructor를 통해 필요한 것들 초기화
    // 필요한 DOM 요소 가져오기
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');

    this.popUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }
  setClickListener(onClick) {
    this.onClick = onClick;
    // 클래스 PopUp 안에 있는 멤버변수 onClick에 지금 함수에서 전달받은 onClick이라는 인자를 할당해준 것
  }
  // PopUp, 내가 여기 onClick 콜백을 등록해 놓을 테니까, 팝업에서 버튼이 클릭되면 내가 전달해준 onClick을 호출해

  showWithText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove('pop--up--hide');
  }

  hide() {
    this.popUp.classList.add('pop--up--hide');
  }
}
