'use strict';
var items = [
    { name: '리스트레토', price: 4000, category: 'espresso' },
    { name: '에스프레소', price: 4000, category: 'espresso' },
    { name: '에스프레소 마키아토', price: 4000, category: 'espresso' },
    { name: '룽고', price: 4700, category: 'coffee', grand: 500 },
    { name: '아메리카노', price: 4300, category: 'coffee'},
    { name: '싱글 오리진 스페셜티', price: 4000, category: 'coffee', grand: 500 },
    { name: '디카페인 브라질', price: 5300, category: 'coffee' },
    { name: '콜드브루', price: 4700, category: 'cold brew', grand: 500 },
    { name: '콜드브루 라떼', price: 5300, category: 'cold brew', grand: 500 },
    { name: '스패니쉬 크림 콜드브루', price: 5800, category: 'cold brew', grand: 500 },
    { name: '카페라떼', price: 5300, category: 'latte', grand: 500 },
    { name: '카푸치노', price: 5300, category: 'latte', grand: 500, options: ['Hot Only'] },
    { name: '카라멜 마키아토', price: 5800, category: 'latte', grand: 500 },
    { name: '시나몬 라떼', price: 5800, category: 'latte', grand: 500 },
    { name: '스패니쉬 라떼', price: 5800, category: 'latte', grand: 500 },
    { name: '바닐라 라떼', price: 6300, category: 'latte', grand: 500 },
    { name: '아이스크림 라떼', price: 6300, category: 'latte', grand: 500, options: ['Ice Only'] },
    { name: '흑임자 카페 라떼', price: 6300, category: 'latte'},
    { name: '제주 말차 라떼', price: 7000, category: 'latte', grand: 1000, options: ['Seasonal'] },
];

var menu = document.querySelector("#cafe-menu");    //ID가 cafe-menu 인 DIV Node(Element)를 menu 변수로 저장
var templates = document.querySelector(".templates")   // class가 templates인 Div Node (Element)를 templates 변수로 저장

//전체 item list(Array) 받아서, 메뉴 구조 HTML로 렌더링
function renderItems(list){
    list.forEach(function(item){
        // item 에는 list의 각 요소가 저장된다.
        
        // getCategory 함수에서, item의 현재 category에 해당하는 HTML이
        // 있으면 그 HTML Tag(Elements)를 가져오고
        // 없으면 templates에서 category 요소를 복사한 뒤에, 그 요소를 menu에 넣고, 해당 요소를 가져온다.
        var category = getCategory(item);

        // 매번 새 Item HTML Tag를 만들어서, category HTML에 넣어준다.
        var itemNode = renderNewItem(category, item);

    });
}

function getTemplate(templateSelector){ // #app, .cold brew
    var template = templates.querySelector(templateSelector);

    if(!template){
        return null;
    }

    return template.cloneNode(true);
}


function getCategory(item){
    var categoryClass = item.category.split(" ").join("-");
    var category = menu.querySelector(".category."+categoryClass); // 없으면 null이 category에 저장됨
    if(!category){ // null이란 데이터는 아무것도 없는 변수라는 뜻 !!(null) === false
        // category가 없음

        category = renderNewCategory(item);

        //cloneNode(deep?) 함수로 해당 HTML TAG를 복사
        // deep == true 인 경우 해당 태그의 자식 태그들도 함께 복사
        category = templates.querySelector(".category").cloneNode(true);
        category.classList.add(item.category.categoryClass);  // category HTML class 에 item의 category 데이터 입력
        // category HMTL의 h3 에 item의  category 데이터를 text로 입력
        category.querySelector("h3").innerText = item.category;

        // category 태그를 menu의 자식 node로 붙여준다.
        menu.appendChild(category);

    }

    return category;
}

function renderNewCategory(item){

}


function renderNewItem(category, item){
   var itemNode = templates.querySelector(".item").cloneNode(true);
   itemNode.querySelector(".name").innerText = item.name;
   itemNode.querySelector(".price .standard").innerText = String(item.price);
   itemNode.querySelector(".price .grand").innerText = item.grand ? String(item.price + item.grand) : "-";

   // category TAG의 ul.item-list 태그에 itemNode를 자식으로 붙여준다.
   category.querySelector(".item-list").appendChild(itemNode);

   return itemNode;
}

renderItems(items);
