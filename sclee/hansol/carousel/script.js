function carousel(selector) {
  var context = document.querySelector(selector);

  //context overflow hidden
  context.style.overflow = "hidden";

  var children = context.children;

  var slides = [];
  var slideSize = children.length;

  var slideWidth = context.clientWidth;

  for (var i = 0; i < slideSize; ++i) {
    var slide = children[i];
    slides.push(slide);
  }

  //슬라이드 트랙 생성
  var track = document.createElement("div");
  track.style.position = "relative";
  track.style.transform = "translate(0px, 0px)";
  track.style.transition = "transform 300ms";

  for (var i = 0; i < slideSize; ++i) {
    var slide = slides[i];

    slide.style.position = "absolute";
    slide.style.top = "0px";
    slide.style.left = slideWidth * i + "px";

    var boxSizing = css(slide, "box-sizing");
    if (boxSizing === "border-box") {
      slide.style.width = slideWidth + "px";
    } else if (boxSizing === "content-box") {
      var paddingLeft = css(slide, "padding-left");
      var paddingRight = css(slide, "padding-right");
      var borderLeft = css(slide, "border-left-width");
      var borderRight = css(slide, "border-right-width");

      console.log(paddingLeft, paddingRight, borderLeft, borderRight);
      var width =
        slideWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
      slide.style.width = width + "px";
    }

    //slide를 trach으로 이동
    track.appendChild(slide);
  }

  //trach을 context의 자식 요소로 배치
  context.appendChild(track);

  //slide 상태
  var cursor = 0;
  function next() {
    cursor = Math.min(cursor + 1, slideSize - 1);
    track.style.transform = "translate(-" + cursor * slideWidth + "px, 0px)";
  }
  function previous() {
    cursor = Math.min(cursor - 1, 0);
    track.style.transform = "translate(-" + cursor * slideWidth + "px, 0px)";
  }

  window.next = next;
  window.previous = previous;
}

function css(element, cssProperty) {
  var cssValue = window.getComputedStyle(element)[cssProperty];
  //정규식으로 숫자부분만 추출
  var match = cssValue.match(/^(-?[0-9]+(\.[0-9]+)?)px$/);
  if (match != null && match[1]) {
    return Number(match[1]);
  }

  return cssValue;
}
