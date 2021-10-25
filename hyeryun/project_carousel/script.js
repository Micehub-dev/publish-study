function Carousel(selector, auto, sec, mode){
    this.context = document.querySelector(selector);

    this.init = function(){
        
        // context의 overflow 스타일을 hidden으로
        this.context.style.overflow = "hidden";
        this.context.style.position = "relative";

        var children = this.context.children; // context의 자식 HTML 태그들이 반환됨
        // Type : HTMLCollection -> Array 형싱
        // children[0], children[2] .... HTML 태그를 가져옴
        // children.length => 전체 크기를 알아낼 수 있음

        this.slides = []
        this.slideSize = children.length; // 슬라이드 페이지 개수

        this.calculateContext(); // 기준이 되는 가로 값 계산

        // children 안에 있는 HTML 태그들은
        // slides 안에 저장한다.
        for(var i = 0; i < this.slideSize; ++i){
            var slide = children[i];
            this.slides.push(slide);
        }

        // 슬라이드 트랙 생성
        this.buildTrack();

        // 이벤트 등록
        this.bindEvents();

        // 자동 재생
        if(auto == true){
            this.autoPlay();
        }
        
        // 화살표 생성
        this.makeArrows();

        // 슬라이드 번호 영역 생성
        this.makeNumArea();
    }

    this.calculateContext = function(){
        this.slideWidth = this.context.clientWidth;
        this.slideHeight = this.context.clientHeight;
    }

    this.buildTrack = function(){
        this.track = document.createElement("div");
        if(mode == 'normal' || mode == 'vertical'){
            this.track.style.position = "relative";
            this.track.style.transform = "translate(0px, 0px)";
            this.track.style.transition = "transform 300ms, height 300ms"
        }else if(mode == 'flex'){
            this.track.style.display = 'flex';
            this.track.style.flexWrap = 'wrap';
            this.track.style.alignItems = 'flex-start';
            this.track.style.width = this.slideWidth * this.slideSize + "px";
            this.track.style.transition = "transform 300ms";
        }

        this.setSlidePositions(true);

        // track을 context의 자식 요소로 배치
        this.context.appendChild(this.track);

        // track의 transform translate 값과
        // 현재 슬라이드에 해당하는 높이값을 계산해서 대입
        this.setTrackPosition();
    }

    // 전체 슬라이드의 스타일 계산
    this.setSlidePositions = function(initialize){
        for(var i = 0; i < this.slideSize; ++i){
            var slide = this.slides[i]; // i번째 slide HTML 요소

            this.setSlidePosition(slide, i);

            if(initialize === true){
                // slide를 track으로 이동
                this.track.appendChild(slide);
            }
        }
    }

    // 단일(개별) 슬라이드의 스타일 계산
    if(mode == 'normal'){
        this.setSlidePosition = function(slide, i){
            slide.style.position = "absolute";
            slide.style.top = "0px";
            slide.style.left = (this.slideWidth * i) + "px";

            var boxSizing = css(slide, "box-sizing");
            if(boxSizing === "border-box"){
                slide.style.width = this.slideWidth + "px";
            }else if(boxSizing === "content-box"){
                // 슬라이드 가로 크기에서
                // padding-left/right, border-left/right width(pixel)
                // 값을 계산해서 뺴야 됨
                var paddingLeft = css(slide, "padding-left");
                var paddingRight = css(slide, "padding-right");
                var borderLeft = css(slide, "border-left-width");
                var borderRight = css(slide, "border-right-width");

                var width = this.slideWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
                slide.style.width = width + "px";
            }
        }
    }else if(mode == 'vertical'){
        this.setSlidePosition = function(slide, i){
            slide.style.position = "absolute";
            slide.style.top = (this.slideHeight * i) + "px";;
            slide.style.left = "0px"

            var boxSizing = css(slide, "box-sizing");
            if(boxSizing === "border-box"){
                slide.style.height = this.slideHeight + "px";
            }else if(boxSizing === "content-box"){
                var paddingLeft = css(slide, "padding-left");
                var paddingRight = css(slide, "padding-right");
                var borderLeft = css(slide, "border-left-width");
                var borderRight = css(slide, "border-right-width");

                var height = this.slideHeight - (paddingLeft + paddingRight + borderLeft + borderRight);
                slide.style.height = height + "px";
            }
        }
    }else if(mode == 'flex'){
        this.setSlidePosition = function(slide, i){
            var boxSizing = css(slide, "box-sizing");
            if(boxSizing === "border-box"){
                slide.style.width = this.slideWidth + "px";
            }else if(boxSizing === "content-box"){
                var paddingLeft = css(slide, "padding-left");
                var paddingRight = css(slide, "padding-right");
                var borderLeft = css(slide, "border-left-width");
                var borderRight = css(slide, "border-right-width");

                var width = this.slideWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
                slide.style.width = width + "px";
            }
        }
    }

    this.bindEvents = function(){
        var carousel = this;
        window.addEventListener('resize', function(){
            // 이 안에서 this하고 밖에서 this가 달라서
            // 바깥의 this를 carousel 이라는 변수에 할당해서 사용
            carousel.calculateContext(); // 기준 값 재계산
            carousel.setSlidePositions(); // 슬라이드 전체 스타일 재계산
            carousel.setTrackPosition(); // cursor 값에 맞춰 Track 위치 재계산
        });

        var imgs = carousel.context.querySelectorAll("img"); // img 태그 전체
        var imgCount = 0;
        imgs.forEach(function(img){
            imgCount += img.complate ? 0 : 1;
            img.onload = function(){
                notifuImgLoaded();
            }
        })

        function notifuImgLoaded(){
            imgCount --;
            if(imgCount == 0){
                carousel.setTrackPosition();
            }
        }
    }


    // 현재 슬라이드 상태
    // 만약 이 슬라이드 기능의 요구사항 중에
    // 현재 슬라이드 번호(cursor)가 뭔지 알 수 있게 해주세요.
    // 라는 요구사항이 있으면
    // 그때 cursor를 객체의 노출된 변수로 지정해야 될 필요가 생기는 것
    this.cursor = 0;

    this.next = function(){
        this.cursor = Math.min(this.cursor + 1, this.slideSize - 1);
        this.setTrackPosition();
    }

    this.previous = function(){
        this.cursor = Math.max(this.cursor - 1, 0);
        this.setTrackPosition();
    }

    this.setTrackPosition = function(){
        if(mode == 'normal' || mode == 'flex'){
            this.track.style.transform = "translate(-"+(this.cursor*this.slideWidth)+"px, 0px)"
        }else if(mode == 'vertical'){
            this.track.style.transform = "translate(0px, -"+(this.cursor * this.slideHeight)+"px)"
        }
        this.track.style.height = this.getCurrentSlideHeight() + "px";
    }

    this.getCurrentSlideHeight = function(){
        return this.slides[this.cursor] // 현재 슬라이드
                   .clientHeight;
    }

    // cursor에 값만 알 수 있게 해주고
    // cursor를 임의로 바꿀 수 없게 해주세요.
    this.getSlideNumber = function(){
        return this.cursor;
    }

    // 자동재생
    this.autoPlay = function(){
        var self = this;

        setInterval(function(){
            self.cursor = Math.min(self.cursor + 1, self.slideSize - 1);
            self.setTrackPosition();

            if(self.cursor == self.slideSize - 1){
                self.cursor = -1
            }

            self.nextSlideNum();
        },sec)
    }

    // 화살표 생성
    this.makeArrows = function(){
        var self = this;

        this.prevBtn = document.createElement("button");
        this.prevBtn.type = "button";
        this.prevBtn.innerText = "이전";
        this.prevBtn.style.position = "absolute";
        this.prevBtn.style.top = "50%";
        this.prevBtn.style.left = "0";
        this.prevBtn.addEventListener('click',function(){
            self.cursor = Math.max(self.cursor - 1, 0);
            self.setTrackPosition();

            if(self.cursor == 0){
                self.cursor = self.slideSize
            }

            self.prevSlideNum();
        })
        this.context.appendChild(this.prevBtn);

        this.nextBtn = document.createElement("button");
        this.nextBtn.type = "button";
        this.nextBtn.innerText = "다음";
        this.nextBtn.style.position = "absolute";
        this.nextBtn.style.top = "50%";
        this.nextBtn.style.right = "0";
        this.nextBtn.addEventListener('click',function(){
            self.cursor = Math.min(self.cursor + 1, self.slideSize - 1);
            self.setTrackPosition();

            if(self.cursor == self.slideSize - 1){
                self.cursor = -1
            }

            self.nextSlideNum();
        })
        this.context.appendChild(this.nextBtn);
    }

    // 슬라이드 번호
    this.makeNumArea = function(){
        this.numArea = document.createElement("div");
        this.numArea.className = 'num-area';
        this.nowNum = document.createElement("span");
        this.nowNum.className = 'now-num';
        this.nowNum.innerText = "1"
        this.allNum = document.createElement("span");
        this.allNum.className = 'all-num';
        this.allNum.innerText = " / " + this.slideSize;

        this.context.appendChild(this.numArea);
        this.numArea.appendChild(this.nowNum);
        this.numArea.appendChild(this.allNum);
    }
    this.nextSlideNum = function(){
        var self = this;

        if(self.cursor + 1 == 0){
            self.nowNum.innerText = self.slideSize
        }else{
            self.nowNum.innerText = self.cursor + 1;
        }
    }
    this.prevSlideNum = function(){
        var self = this;

        console.log(self.cursor);
        if(self.cursor == self.slideSize){
            self.nowNum.innerText = 1;
        }else{
            self.nowNum.innerText = self.cursor + 1;
        }
    }

    this.init();
    
    function css(element, cssProperty){
        var cssValue = window.getComputedStyle(element)[cssProperty];
        // 예> cssValue = "20px"
        // "20px", "-30px", "100.56px"
        // 정규식으로 숫자 부분만 추출하기
        var match = cssValue.match(/^(-?[0-9]+(\.[0-9]+)?)px$/);
        if(match != null && match[1]){
            return Number(match[1])
        }
    
        return cssValue;
    }
}

