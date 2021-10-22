function Carousel(selector, slider) {
  this.context = document.querySelector(selector);

  this.init = function () {
    //context overflow hidden
    this.context.style.overflow = "hidden";

    var children = this.context.children;

    this.slides = [];
    this.slideSize = children.length;

    this.calculateContext(); //기준이 되는 가로값 계산

    for (var i = 0; i < this.slideSize; ++i) {
      var slide = children[i];
      this.slides.push(slide);
    }

    //슬라이드 트랙 생성
    this.buildTrack();

    //event 등록
    this.bindEvents();
  };

  this.calculateContext = function () {
    this.slideWidth = this.context.clientWidth;
  };

  this.buildTrack = function () {
    this.track = document.createElement("div");
    this.track.style.position = "relative";
    this.track.style.transform = "translate(0px, 0px)";
    this.track.style.transition = "transform 300ms, height 300ms";

    this.setSlidePositions(true);

    //track을 context의 자식 요소로 배치
    this.context.appendChild(this.track);

    //track의 transform translate 값과 현ㄷ재 슬라이드에 해당하는 높이값을 계산해서 대입
    this.setTrackPosition();
  };

  this.setSlidePositions = function (initialize) {
    for (var i = 0; i < this.slideSize; ++i) {
      var slide = this.slides[i];

      this.setSlidePosition(slide, i);

      if (initialize === true) {
        //slide를 track으로 이동
        this.track.appendChild(slide);
      }
    }
  };

  this.setSlidePosition = function (slide, i) {
    slide.style.position = "absolute";
    slide.style.top = "0px";
    slide.style.left = this.slideWidth * i + "px";

    var boxSizing = css(slide, "box-sizing");
    if (boxSizing === "border-box") {
      slide.style.width = this.slideWidth + "px";
    } else if (boxSizing === "content-box") {
      var paddingLeft = css(slide, "padding-left");
      var paddingRight = css(slide, "padding-right");
      var borderLeft = css(slide, "border-left-width");
      var borderRight = css(slide, "border-right-width");

      var width =
        this.slideWidth -
        (paddingLeft + paddingRight + borderLeft + borderRight);
      slide.style.width = width + "px";
    }
  };

  this.bindEvents = function () {
    var carousel = this;
    window.addEventListener("resize", function () {
      //이 안의 this와 밖의 this 다름
      //밖의 this를 carousel이라는 변수에 할당해서 사용
      carousel.calculateContext(); //기준값 재계산
      carousel.setSlidePositions(); //슬라이드 전체 스타일 재계산
      carousel.setTrackPosition();
    });

    var imgs = carousel.context.querySelectorAll("img"); //img 태그 전체
    var imgCount = 0;
    imgs.forEach(function (img) {
      imgCount += img.complate ? 0 : 1;
      img.onload = function () {
        notifyImgLoaded();
      };
    });

    function notifyImgLoaded() {
      imgCount--;
      if (imgCount == 0) {
        carousel.setTrackPosition();
      }
    }
  };

  //slide 상태
  var cursor = 0;
  this.next = function () {
    cursor = Math.min(cursor + 1, this.slideSize - 1);
    this.setTrackPosition();
  };

  this.previous = function () {
    cursor = Math.max(cursor - 1, 0);
    this.setTrackPosition();
  };

  this.setTrackPosition = function () {
    this.track.style.transform =
      "translate(-" + cursor * this.slideWidth + "px, 0px)";
    this.track.style.height = this.getCurrentSlideHeight() + "px";
  };

  this.getCurrentSlideHeight = function () {
    return this.slides[cursor].clientHeight; //현재 슬라이드
  };

  //cursor readonly
  this.getSlideNumber = function () {
    return cursor;
  };

  this.init();

  if (slider.autoplay) {
    setInterval(this.next.bind(this), slider.autoplaySpeed);
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
}
