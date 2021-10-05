function Carousel(selector, options){
    this.context = document.querySelector(selector);

    // 옵션 기본값
    var defaults = {
        autoplay: false,
        autoplaySpeed: 5000, //ms
        arrows: true,
        dots: false,
        flexbox: false,
        vertical: false,
    };

    // Object.assign 함수: 두번째 이후 값들의 속성값들을 복사하여
    // 첫번째 값에 넣어준다.
    this.options = Object.assign({}, defaults, options || {});

    this.init = function(){
		//context의 overflow 스타일을 hidden으로
		this.context.style.overflow = "hidden";
        this.context.classList.add("carousel-context");

		var children = this.context.children;   // context의 자식 HTML 태그들이 반환됨
		// Type : HTMLCollection -> Array 형식
		// children[0], children[1] ... HTML 태그를 가져옴
		// children.length => 전체 크기를 알아낼 수 있음

		this.slides = [];
		this.slideSize = children.length;    // 슬라이드 페이지 개수

        this.calculateContext();

        // children 안에 있는 HTML 태그들을
        // slides 안에 저장한다.
        for(var i = 0; i < this.slideSize; ++i){
            var slide = children[i];
            this.slides.push(slide);
        }

        this.buildTrack();
        this.buildNavigation();
        this.bindEvents();

        if(this.options.autoplay === true){
            this.startAutoplay();
        }
    },

    this.calculateContext = function(){
        this.slideWidth = this.context.clientWidth;
    };

    this.buildTrack = function(){
        // 슬라이드 트랙 생성
        this.track = document.createElement("div");
        this.track.style.position = "relative";
        this.track.style.transform = "translate(0px, 0px)";
        this.track.style.transition = "transform 300ms, height 300ms";
        
        if(this.options.flexbox === true){
            this.track.style.display = 'flex';
            this.track.style.width = '100%';
            this.track.style['alignItems'] = 'flex-start';

            if(this.options.vertical === true){
                this.track.style['flexFlow'] = 'column nowrap';
            }
        }
        
        this.setSlidePositions(true);
    
        // track을 context의 자식 요소로 배치
        this.context.appendChild(this.track);
        
        this.setTrackPosition();
    };

    this.setSlidePositions = function(initialize){
        for(var i = 0; i < this.slideSize; ++i){
            var slide = this.setSlidePosition(this.slides[i], i);
            // slide를 track으로 이동
            if(initialize){
                this.track.appendChild(slide);
            }
        }
    };

    this.setSlidePosition = function(slide, i){
        if(this.options.fade === true){
            slide.style.position = "absolute";
            slide.style.top = "0px";
            slide.style.left = "0px";
            slide.style.transition = "opacity 300ms";
            slide.style.opacity = 0;

        } else if(this.options.flexbox === true){
            slide.style['flex-shrink'] = '0';

        }else{
            slide.style.position = "absolute";
            slide.style.top = "0px";
            slide.style.left = (this.slideWidth * i)+"px";
        }

        var boxSizing = css(slide, "box-sizing");
        if(boxSizing === 'border-box'){
            slide.style.width = this.slideWidth + "px";

        }else if(boxSizing === 'content-box'){
            // 슬라이드 가로 크기에서
            // padding left/right, border left/right width(pixel)
            // 값을 계산해서 빼야됨
            var paddingLeft = css(slide, "padding-left");
            var paddingRight = css(slide, "padding-right");
            var borderLeft = css(slide, "border-left-width");
            var borderRight = css(slide, "border-right-width");

            var width = this.slideWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
            slide.style.width = width + "px";
        }

        return slide;
    };


    // 현재 슬라이드 상태
    // 만약, 이 슬라이드 기능의 요구사항 중에
    // 현재 슬라이드 번호(cursor)가 뭔지 알 수 있게 해주세요.
    // 라는 요구사항이 있으면
    // 그때 cursor를 객체의 노출된 변수로 지정해야 될 필요가 생기는 것
    var cursor = 0;
    this.next = function(){
        this.goTo(cursor + 1);
    }

    this.previous = function(){
        this.goTo(cursor - 1);
    }

    this.goTo = function(slideNumber){
        if(slideNumber == NaN || typeof slideNumber !== 'number') return;
        
        if(slideNumber < 0){
            slideNumber = this.slideSize - Math.abs(slideNumber) % this.slideSize;
        }else{
            slideNumber = slideNumber % this.slideSize;
        }

        cursor = Math.round(slideNumber);

        this.setTrackPosition();

        if(this.options.dots === true){
            this.setActiveDot();
        }

        if(this.options.autoplay === true){
            this.startAutoplay();
        }
    }

    // cursor에 값만 알 수 있게 해주고
    // cursor를 임의로 바꿀 수 없게 해주세요.
    this.getSlideNumber = function(){
        return cursor;
    };

    this.setTrackPosition = function(){
        if(this.options.fade === true){
            this.slides.forEach(function(e){
                e.style.opacity = 0;
            });
            this.slides[cursor].style.opacity = 1;
        }else if(this.options.vertical === true){
            this.track.style.transform = "translate(0px, -"+this.slides[cursor].offsetTop+"px)";
        }else{
            this.track.style.transform = "translate(-"+(cursor * this.slideWidth)+"px, 0px)";
        }
        this.track.style.height = this.getCurrentSlideHeight() + "px";
    };

    this.getCurrentSlideHeight = function(){
        var slide = this.slides[cursor];
        return slide.clientHeight;
    }

    this.bindEvents = function(){
        var carousel = this;
        window.addEventListener("resize", function(e){
            carousel.calculateContext();
            carousel.setSlidePositions();
            carousel.setTrackPosition();
        });

        var imgs = carousel.context.querySelectorAll("img");
        var imgCount = 0;
        imgs.forEach(function(img){
            imgCount += img.complete ? 0 : 1;
            img.onload = function(e){
                notifyImgLoaded();
            };
        });

        function notifyImgLoaded(){
            imgCount--;
            if(imgCount == 0){
                carousel.setTrackPosition();
            }
        }
    }

    // Autoplay
    var autoplayTimeout = null;
    this.startAutoplay = function(){
        if(this.options.autoplay !== true){
            console.warn("Autoplay Disabled");
            return;
        }
        
        var carousel = this;
        if(autoplayTimeout != null){
            clearTimeout(autoplayTimeout);
        }
        autoplayTimeout = setTimeout(function(){
            carousel.next();
        }, carousel.options.autoplaySpeed);
    };

    // Navigation UI
    this.buildNavigation = function(){
        if(this.options.arrows === true){
            this.buildArrows();
        }

        if(this.options.dots === true){
            this.buildDots();
        }
    };

    this.buildArrows = function(){
        this.arrows = {};
        this.arrows.prev = this.buildArrow('prev');
        this.arrows.next = this.buildArrow('next');
    };

    this.buildArrow = function(type){
        var carousel = this;
        var arrow = document.createElement("span");
        arrow.classList.add("arrow", type);
        arrow.innerText = type == 'prev' ? '〈' : '〉';
        this.context.appendChild(arrow);

        arrow.addEventListener('click', function(e){
            e.preventDefault();
            if(type == 'prev'){
                carousel.previous();
            }else{
                carousel.next();
            }
        });
        
        return arrow;
    }

    this.buildDots = function(){
        var carousel = this;
        this.dotList = document.createElement("ol");
        this.dotList.classList.add("dot-list");

        for(var i = 0; i < this.slideSize; ++i){
            var dot = document.createElement("li");
            dot.classList.add("dot");
            this.dotList.append(dot);
            dot.index = i;

            dot.addEventListener("click", function(e){
                e.preventDefault();
                carousel.goTo(this.index);
            });
        }

        this.context.appendChild(this.dotList);

        this.setActiveDot();
    }

    this.setActiveDot = function(){
        this.dotList.querySelectorAll(".active").forEach(function(e){
            e.classList.remove('active');
        });

        this.dotList.children[cursor].classList.add("active");
    }

    
    this.init();
	
	/**
	 * Utility Functions
	 */
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

}