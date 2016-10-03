'use strict';

var productNameList = ['bag.jpg', 'bathroom.jpg',	'breakfast.jpg', 'chair.jpg',	'dog-duck.jpg', 'pen.jpg', 'scissors.jpg', 'sweep.png',	'unicorn.jpg', 'water-can.jpg', 'banana.jpg', 'boots.jpg', 'bubblegum.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pet-sweep.jpg', 'shark.jpg', 'tauntaun.jpg', 'usb.gif', 'wine-glass.jpg'];
var productObjectList = [];
var previousThree = [];
var numProducts = productList.length;
var imagesEl = document.getElementById('images');

function Product(filename) {
  this.name = filename.substring(0, filename.length - 4);
  this.filePath = 'img/' + filename;
  this.clicks = 0;
  this.timesShown = 0;
  this.percentageClicked = function() {
    return 100 * clicks / timesShown;
  }
};

function selectThree() {
  var numSelected = 0
  do {
    var randomObj = chooseRandomProduct()
    if (!isAlreadySelected(randomObj)) {
      previousThree.push(randomObj);
      ++numSelected;
    }
  } while (numSelected < 3);
}

function isAlreadySelected(Obj) {
  for (var i = 0; i < previousThree.length; i++) {
    if (previousThree[i] === Obj) {
      return true;
    }
  }
  return false;
}

function chooseRandomProduct() {
  var randomIndex = Math.floor(Math.random() * numProducts);
  return productObjectList[randomIndex];
}

function renderThree() {

}

function handleClick(event) {
  var target = event.target;

}

function makeObjectList() {
  for (var i = 0; i < numProducts; i++) {
    productObjectList.push(new Product(productNameList[i]));
  }
}

imagesEl.addEventListener('click', handleClick);

makeObjectList();
