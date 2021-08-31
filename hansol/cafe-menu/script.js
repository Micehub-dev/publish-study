"use strict";
var items = [
  { name: "리스트레토", price: 4000, category: "espresso" },
  { name: "에스프레소", price: 4000, category: "espresso" },
  { name: "에스프레소 마키아토", price: 4000, category: "espresso" },
  { name: "룽고", price: 4700, category: "coffee", grand: 500 },
  { name: "아메리카노", price: 4300, category: "coffee" },
  { name: "싱글 오리진 스페셜티", price: 4000, category: "coffee", grand: 500 },
  { name: "디카페인 브라질", price: 5300, category: "coffee" },
  { name: "콜드브루", price: 4700, category: "cold brew", grand: 500 },
  { name: "콜드브루 라떼", price: 5300, category: "cold brew", grand: 500 },
  {
    name: "스패니쉬 크림 콜드브루",
    price: 5800,
    category: "cold brew",
    grand: 500,
  },
  { name: "카페라떼", price: 5300, category: "latte", grand: 500 },
  {
    name: "카푸치노",
    price: 5300,
    category: "latte",
    grand: 500,
    options: ["Hot Only"],
  },
  { name: "카라멜 마키아토", price: 5800, category: "latte", grand: 500 },
  { name: "시나몬 라떼", price: 5800, category: "latte", grand: 500 },
  { name: "스패니쉬 라떼", price: 5800, category: "latte", grand: 500 },
  { name: "바닐라 라떼", price: 6300, category: "latte", grand: 500 },
  {
    name: "아이스크림 라떼",
    price: 6300,
    category: "latte",
    grand: 500,
    options: ["Ice Only"],
  },
  { name: "흑임자 카페 라떼", price: 6300, category: "latte" },
  {
    name: "제주 말차 라떼",
    price: 7000,
    category: "latte",
    grand: 1000,
    options: ["Seasonal"],
  },
];

var menu = document.querySelector("#cafe-menu");
var templates = document.querySelector(".templates");

console.log(menu, templates);

function renderItems(list) {
  list.forEach(function (item) {
    var category = getCategory(item);
    var itemNode = renderNewItem(category, item);
  });
}

function getTemplate(templateSelector) {
  var template = templates.querySelector(templateSelector);

  if (!template) {
    return null;
  }

  return template.cloneNode(true);
}

function getCategory(item) {
  var categoryClass = item.category.split(" ").join("-");
  var category = menu.querySelector(".category." + categoryClass);
  if (!category) {
    // !!(null) === false
    category = renderNewCatagory(item);
  }

  return category;
}

function renderNewCatagory(item) {
  var categoryClass = item.category.split(" ").join("-");

  //cloneNode(deep?) 함수로 해당 html tag 복사
  //deep == true여야 자식 tag들도 모두 복사해옴
  var category = getTemplate(".category");
  category.classList.add(categoryClass); //category HTML calss에 item의 category 데이터 입력
  category.querySelector("h3").innerText = item.category; //category HTML의 h3 태그에 item의 category 데이터를 text로 입력

  menu.appendChild(category);

  return category;
}

function renderNewItem(category, item) {
  var itemNode = getTemplate(".item");
  itemNode.querySelector(".name").innerText = item.name;
  itemNode.querySelector(".price .standard").innerText = String(item.price);
  itemNode.querySelector(".price .grand").innerText = item.grand
    ? String(item.price + item.grand)
    : "-";

  category.querySelector(".item-list").appendChild(itemNode);

  return itemNode;
}

renderItems(items);
