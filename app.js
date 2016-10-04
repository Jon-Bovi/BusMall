'use strict';

var productNameList = ['bag.jpg', 'bathroom.jpg',	'breakfast.jpg', 'chair.jpg',	'dog-duck.jpg', 'pen.jpg', 'scissors.jpg', 'sweep.png',	'unicorn.jpg', 'water-can.jpg', 'banana.jpg', 'boots.jpg', 'bubblegum.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pet-sweep.jpg', 'shark.jpg', 'tauntaun.jpg', 'usb.gif', 'wine-glass.jpg'];
var productObjectList = [];
var previousThree = [];
var currentThree = [];
var clickData = [];
var labels = [];
var barGraph;
var numProducts = productNameList.length;
var imagesEl = document.getElementById('images');
var resultsEl = document.getElementById('results');
var buttonEl = document.createElement('button');
var allsuckEl = document.getElementById('allsuck');
var setCount = 0;

function Product(filename) {
  this.name = filename.substring(0, filename.length - 4);
  this.filePath = './img/' + filename;
  this.clicks = 0;
  this.timesShown = 0;
  this.percentageClicked = function() {
    return (100.0 * this.clicks / this.timesShown).toPrecision(3);
  };
};

function selectThree() {
  currentThree = [];
  var numSelected = 0;
  do {
    var randomObj = chooseRandomProduct();
    // console.log(randomObj.name);
    if ((currentThree.indexOf(randomObj) === -1) && (previousThree.indexOf(randomObj) === -1)) {
      // console.log('Adding ' + randomObj.name + ' to currentThree');
      currentThree.push(randomObj);
      randomObj.timesShown += 1;
      ++numSelected;
    }
    // console.log('current three: ');
    // console.log(currentThree);
  } while (numSelected < 3);
  previousThree = [];
  previousThree = currentThree.slice();
}

function chooseRandomProduct() {
  var randomIndex = Math.floor(Math.random() * numProducts);
  return productObjectList[randomIndex];
}

function renderThree() {
  imagesEl.innerHTML = '';
  for (var i = 0; i < 3; i++) {
    var divEl = document.createElement('div');
    divEl.setAttribute('id', i + 'imgcontainer');
    var imgEl = document.createElement('img');
    imgEl.setAttribute('src', currentThree[i].filePath);
    imgEl.setAttribute('id', i + 'img');
    var helperEl = document.createElement('span');
    divEl.appendChild(helperEl);
    divEl.appendChild(imgEl);
    imagesEl.appendChild(divEl);
  }
}

function handleImgClick(event) {

  var target = event.target;
  // console.log(target);
  if (target.getAttribute('id') === 'images') {
    return console.log('clicked...but not on image');
  }
  var targetObject = whichObject(target);
  targetObject.clicks += 1;
  ++setCount;
  if (setCount >= 25) {
    revealResultsButton();
    return imagesEl.removeEventListener('click', handleImgClick);
  } else {
    selectThree();
    renderThree();
    // console.log(setCount);
  }
  console.log(setCount);
}

function revealResultsButton() {

  buttonEl.setAttribute('type', 'button');
  buttonEl.textContent = 'Show Results';
  resultsEl.appendChild(buttonEl);

  buttonEl.addEventListener('click', handleResultsButtonClick);
}

function handleResultsButtonClick() {
  resultsEl.innerHTML = '';
  drawBarGraph();
}

function handleAllSuckClick() {
  selectThree();
  renderThree();
  console.log(setCount);
}

function whichObject(targetEl) {
  var i = parseInt(targetEl.getAttribute('id'));
  // console.log(i);
  return currentThree[i];
}

// var numClicks = productObjectList[i].clicks;
// var timesShown = productObjectList[i].timesShown;
// var percentageClicked = productObjectList[i].percentageClicked();


function generateData(array, dataType) {
  for (var i = 0; i < numProducts; i++) {
    array[i] = productObjectList[i][dataType];
  }
}

var data =  {
  labels: labels,
  datasets: [{
    label: '# of Votes',
    data: clickData,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ],
    borderColor: [
      'rgba(255,99,132,1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
  }]
};

function drawBarGraph() {
  generateData(clickData, 'clicks');
  generateData(labels, 'name');
  var ctx = document.getElementById('bargraph').getContext('2d');
  barGraph = new Chart(ctx, {
    type: 'bar',
    data: data,
  });
}

function makeObjectList() {
  for (var i = 0; i < numProducts; i++) {
    productObjectList.push(new Product(productNameList[i]));
  }
}

imagesEl.addEventListener('click', handleImgClick);
allsuckEl.addEventListener('click', handleAllSuckClick);

makeObjectList();
selectThree();
renderThree();
