'use strict';

var productNameList = ['bag.jpg', 'bathroom.jpg',	'breakfast.jpg', 'chair.jpg',	'dog-duck.jpg', 'pen.jpg', 'scissors.jpg', 'sweep.png',	'unicorn.jpg', 'water-can.jpg', 'banana.jpg', 'boots.jpg', 'bubblegum.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pet-sweep.jpg', 'shark.jpg', 'tauntaun.jpg', 'usb.gif', 'wine-glass.jpg'];
var productObjectList = [];
var previousThree = [];
var currentThree = [];
var numProducts = productNameList.length;
var imagesEl = document.getElementById('images');

function Product(filename) {
  this.name = filename.substring(0, filename.length - 4);
  this.filePath = './img/' + filename;
  this.clicks = 0;
  this.timesShown = 0;
  this.percentageClicked = function() {
    return 100 * clicks / timesShown;
  }
};

function selectThree() {
  currentThree = [];
  var numSelected = 0;
  do {
    console.log('current three: ');
    console.log(currentThree);
    var randomObj = chooseRandomProduct()
    if (!isAlreadySelected(randomObj) && !wasShownPreviously(randomObj)) {
      console.log('Adding ' + randomObj.name + ' to currentThree') ;
      currentThree.push(randomObj);
      ++numSelected;
    }
  } while (numSelected < 3);
  previousThree = [];
  previousThree = currentThree.slice();
}

function isAlreadySelected(Obj) {
  for (var i = 0; i < currentThree.length; i++) {
    if (currentThree[i] === Obj) {
      console.log(Obj.name + ' IS already selected.');
      return true;
    }
  }
  console.log(Obj.name + ' is NOT already selected.');
  return false;
}

function wasShownPreviously(Obj) {
  for (var i = 0; i < previousThree.length; i++) {
    if (Obj === previousThree[i]) {
      console.log(Obj.name + ' WAS shown previously.');
      return true;
    }
  }
  console.log(Obj.name + ' was NOT shown previously.');
  return false;
}

function chooseRandomProduct() {
  var randomIndex = Math.floor(Math.random() * numProducts);
  return productObjectList[randomIndex];
}

function renderThree() {
  imagesEl.innerHTML = '';
  for (var i = 0; i < 3; i++) {
    var imgEl = document.createElement('img');
    imgEl.setAttribute('src', currentThree[i].filePath);
    imagesEl.appendChild(imgEl);
  }
}

function handleClick(event) {
  var target = event.target;

}

function makeObjectList() {
  for (var i = 0; i < numProducts; i++) {
    productObjectList.push(new Product(productNameList[i]));
  }
}

function test() {
  console.log('Previous three before: ');
  console.log(previousThree);
  selectThree();
  renderThree();
  console.log('Previous three after: ');
  console.log(previousThree);
}

imagesEl.addEventListener('click', handleClick);


makeObjectList();
test();
