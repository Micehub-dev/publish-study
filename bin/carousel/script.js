function carousel(selector){
    var context = document.querySelector(selector);

    //context의 overflow 스타일을 hidden 으로,
    context.style.overflow = 'hidden';

    var children = context.children;// context 자식 html 요소들 잡기
    // Type : HTMLCollection -> Array 형식
    // children[0], children[1]... html 태그 가져옴
    // children.length -> 전체크기 알아낼 수 있음.

    var slides = []
    var slideSize = children.length; //슬라이드 페이지 개수

    var slideWidth = context.clientWidth;

    // children 안에 있는 html 태그들을
    // slides 안에 저장한다.
    for(var i = 0; i < slideSize; ++i){
        var slide = children[i];
        slides.push(slide);
    }
    //슬라이드 트랙 생성
    var track = document.createElement('div');
    track.style.position = 'relative';
    track.style.transform = 'translate(0px,0px)'; // 최초 트랜스폼 속성
    track.style.transition = 'transform 300ms';

    for(var i = 0; i < slideSize; ++i){
        var slide = slides[i]; // i번째 slide 태그 Html 요소

        slide.style.position = 'absolute';
        slide.style.top = '0px';
        slide.style.left = (slideWidth * i) + 'px';
        slide.style.width = slideWidth + 'px';

        var boxSizing = window.getComputedStyle(slide)['box-sizing'];
        if(boxSizing === 'border-box'){
            slide.style.width = slideWidth + 'px';
        }else if(boxSizing === 'content-box'){

            var paddingLeft = css(slide, 'padding-left');
            var paddingRight = css(slide, 'padding-right');
            var borderLeft = css(slide, 'border-left-width');
            var borderRight = css(slide, 'border-right-width');

            var width = slideWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
            slide.style.width = width + 'px';
        }
        //slide를 track 으로 이동
        track.appendChild(slide); // node 타입이 아니라서 안들어간단 게 이해 불가

    }

    // track을 context의 자식요소로 배치
    context.appendChild(track);

    //현재 슬라이드 상태
    var cursor = 0;
    function next(){
        cursor = Math.min(cursor + 1, slideSize - 1);
        track.style.transform = 'translate(-'+(cursor*slideWidth)+'px, 0px)';
    }

    function previous(){
        cursor = Math.max(cursor - 1, 0);
        track.style.transform = 'translate(-'+(cursor*slideWidth)+'px, 0px)';
    }

    window.next = next;
    window.previous = previous;
}

function css(element, cssProperty){
    var cssValue = window.getComputedStyle(element)[cssProperty];
    // 예 ) cssValuie <= '20px'
    // '20px', '-30px', '100.56px';
    // 정규식으로 숫자 부분만 추출하기
    var match = cssValue.match(/^(-?[0-9]+(\.[0-9]+)?)px$/);
    if(match != null && match[1]){
        return Number(match[1])
    }

    return cssValue;
}