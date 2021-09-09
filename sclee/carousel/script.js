function Carousel(selector){
    var context = document.querySelector(selector);

    //context의 overflow 스타일을 hidden으로
    context.style.overflow = "hidden";
    
    var children = context.children;   // context의 자식 HTML 태그들이 반환됨
    // Type : HTMLCollection -> Array 형식
    // children[0], children[1] ... HTML 태그를 가져옴
    // children.length => 전체 크기를 알아낼 수 있음

    var slides = [];
    var slideSize = children.length;    // 슬라이드 페이지 개수

    var slideWidth = context.clientWidth;

    // children 안에 있는 HTML 태그들을
    // slides 안에 저장한다.
    for(var i = 0; i < slideSize; ++i){
        var slide = children[i];
        slides.push(slide);
    }

    // 슬라이드 트랙 생성
    var track = document.createElement("div");
    track.style.position = "relative";
    track.style.transform = "translate(0px, 0px)";
    track.style.transition = "transform 300ms";
    
    for(var i = 0; i < slideSize; ++i){
        var slide = slides[i];    // i 번째 slide HTML 요소

        slide.style.position = "absolute";
        slide.style.top = "0px";
        slide.style.left = (slideWidth * i)+"px";

        var boxSizing = css(slide, "box-sizing");
        if(boxSizing === 'border-box'){
            slide.style.width = slideWidth + "px";

        }else if(boxSizing === 'content-box'){
            // 슬라이드 가로 크기에서
            // padding left/right, border left/right width(pixel)
            // 값을 계산해서 빼야됨
            var paddingLeft = css(slide, "padding-left");
            var paddingRight = css(slide, "padding-right");
            var borderLeft = css(slide, "border-left-width");
            var borderRight = css(slide, "border-right-width");

            var width = slideWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
            slide.style.width = width + "px";
        }

        // slide를 track으로 이동
        track.appendChild(slide);
    }

    // track을 context의 자식 요소로 배치
    context.appendChild(track);

    // 현재 슬라이드 상태
    // 만약, 이 슬라이드 기능의 요구사항 중에
    // 현재 슬라이드 번호(cursor)가 뭔지 알 수 있게 해주세요.
    // 라는 요구사항이 있으면
    // 그때 cursor를 객체의 노출된 변수로 지정해야 될 필요가 생기는 것
    var cursor = 0;
    this.next = function(){
        cursor = Math.min(cursor + 1, slideSize - 1);
        track.style.transform = "translate(-"+(cursor*slideWidth)+"px, 0px)";
    }

    this.previous = function(){
        cursor = Math.max(cursor - 1, 0);
        track.style.transform = "translate(-"+(cursor*slideWidth)+"px, 0px)";
    }

    // cursor에 값만 알 수 있게 해주고
    // cursor를 임의로 바꿀 수 없게 해주세요.
    this.getSlideNumber = function(){
        return cursor;
    }
    
}

function css(element, cssProperty){
    var cssValue = window.getComputedStyle(element)[cssProperty];
    // 예) cssValue <= "20px"
    // "20px", "-30px", "100.56px"
    // 정규식으로 숫자부분만 추출하기
    var match = cssValue.match(/^(-?[0-9]+(\.[0-9]+)?)px$/);
    if(match != null && match[1]){
        return Number(match[1])
    }

    return cssValue;
}