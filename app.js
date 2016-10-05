'use strict';

var productNameList = ['bag.jpg', 'bathroom.jpg',	'breakfast.jpg', 'chair.jpg',	'dog-duck.jpg', 'pen.jpg', 'scissors.jpg', 'sweep.png',	'unicorn.jpg', 'water-can.jpg', 'banana.jpg', 'boots.jpg', 'bubblegum.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pet-sweep.jpg', 'shark.jpg', 'tauntaun.jpg', 'usb.gif', 'wine-glass.jpg'];
var productObjectList = [];
var previousThree = [];
var currentThree = [];
var clickData = [];
var labels = [];
var ratioData = [];
var barGraph;
var numProducts = productNameList.length;
var imagesEl = document.getElementById('images');
var resultsEl = document.getElementById('results');
var buttonEl = document.createElement('button');
var allsuckEl = document.getElementById('allsuck');
var setCount = 0;
var notShownYet = [];

function Product(filename) {
  this.name = filename.substring(0, filename.length - 4);
  this.filePath = './img/' + filename;
  this.clicks = 0;
  this.timesShown = 0;
  this.clickedToShownRatio = function() {
    return (this.clicks / this.timesShown).toPrecision(3);
  };
};

function selectThree() {
  currentThree = [];
  var numSelected = 0;

  do {
    var randomObj = chooseRandomProduct();
    if ((currentThree.indexOf(randomObj) === -1) && (previousThree.indexOf(randomObj) === -1)) {
      currentThree.push(randomObj);
      randomObj.timesShown += 1;
      ++numSelected;
    }
  } while (numSelected < 3);

  previousThree = [];
  previousThree = currentThree.slice();
}

function chooseRandomProduct() {
  if (notShownYet.length > 0) {
    var index = Math.floor(Math.random() * notShownYet.length);
    var obj = notShownYet[index];
    notShownYet.splice(index, 1);
    console.log('splicing ' + obj.name);
    return obj;
  } else {
    return productObjectList[Math.floor(Math.random() * productObjectList.length)];
  }
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
  resultsEl.innerHTML = '<canvas id="bargraph" width="800px" height="250px"></canvas>';
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

function generateData() {
  for (var i = 0; i < numProducts; i++) {
    labels[i] = productObjectList[i].name;
    clickData[i] = productObjectList[i].clicks;
    ratioData[i] = productObjectList[i].clickedToShownRatio();
  }
}

function sortByRatio() {
  productObjectList.sort(function (a, b) {
    if (b.clickedToShownRatio() === a.clickedToShownRatio()) {
      return b.clicks - a.clicks;
    }
    return b.clickedToShownRatio() - a.clickedToShownRatio();
  });
}

var data =  {
  labels: labels,
  datasets: [{
    label: 'Votes per Item (Sorted by Times Clicked to Times Shown Ratio)',
    data: clickData,
    backgroundColor: ['rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)',
                      'rgba(299, 99, 99, 0.2)',
                      'rgba(299, 199, 99, 0.2)'],
    borderColor: 'rgba(99, 99, 199, 1)',
    borderWidth: 1
  }]
};

function drawBarGraph() {
  sortByRatio();
  generateData();
  var ctx = document.getElementById('bargraph').getContext('2d');
  barGraph = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        yAxes: [{
          ticks:{
            min: 0,
            stepSize: 1
          }
        }]
      },
      responsive: false
    }
  });
  customToolTips();
}

function customToolTips() {
  barGraph.tooltip._data.datasets[0].label = 'Times Clicked / Times Shown';
  barGraph.tooltip._data.datasets[0].data = ratioData;
}

function makeObjectList() {
  for (var i = 0; i < numProducts; i++) {
    productObjectList.push(new Product(productNameList[i]));
    notShownYet.push(productObjectList[i]);
  }
}

imagesEl.addEventListener('click', handleImgClick);
allsuckEl.addEventListener('click', handleAllSuckClick);

makeObjectList();
selectThree();
renderThree();
