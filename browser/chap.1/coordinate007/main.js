const vertical = document.querySelector(".vertical");
const horizontal = document.querySelector(".horizontal");
const target = document.querySelector(".target");
const tag = document.querySelector(".tag");

// performance 개발 툴에서 성능 확인 가능
addEventListener("load", () => {
  // window가 전부 다 로드가 되면 그때 target의 크기를 읽어와서 document에 mousemove라는 event 등록
  const targetRect = target.getBoundingClientRect();
  const targetHalfWidth = targetRect.width / 2;
  const targetHalfHeight = targetRect.height / 2;

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    console.log(`${x}, ${y}`);

    vertical.style.transform = `translateX(${x}px)`;
    horizontal.style.transform = `translateY(${y}px)`;
    // vertical.style.left = `${x}px`;
    // horizontal.style.top = `${y}px`;

    target.style.transform = `translate(${x - targetHalfWidth}px, ${
      y - targetHalfHeight
    }px)`;
    // target.style.left = `${x}px`;
    // target.style.top = `${y}px`;

    tag.style.transform = `translate(${x}px, ${y}px)`;
    // tag.style.left = `${x}px`;
    // tag.style.top = `${y}px`;

    tag.textContent = `${x}px, ${y}px`;
  });
});
