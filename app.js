'use strict';
// global goodies
var productNameList = ['bag.jpg',
                        'bathroom.jpg',
                        'breakfast.jpg',
                        'chair.jpg',
                        'dog-duck.jpg',
                        'pen.jpg',
                        'scissors.jpg',
                        'sweep.png',
                        'unicorn.jpg',
                        'water-can.jpg',
                        'banana.jpg',
                        'boots.jpg',
                        'bubblegum.jpg',
                        'cthulhu.jpg',
                        'dragon.jpg',
                        'pet-sweep.jpg',
                        'shark.jpg',
                        'tauntaun.jpg',
                        'usb.gif',
                        'wine-glass.jpg'];
var colorList = ['rgb(99, 99, 299)',
                  'rgb(165, 42, 42)',
                  'rgb(64, 224, 208)',
                  'rgb(299, 199, 199)',
                  'rgb(255, 255, 99)',
                  'blue',
                  'rgb(22, 22, 22)',
                  'cyan',
                  'lavender',
                  'lightseagreen',
                  'yellow',
                  'orange',
                  'peru',
                  'green',
                  'firebrick',
                  'maroon',
                  'gray',
                  'darkgray',
                  'limegreen',
                  'darkred'];

var productObjectList = [];
var previousThree = [];
var currentThree = [];
var clickData = [];
var labels = [];
var percentData = [];
var colorData = [];
var numProducts = productNameList.length;
var imagesEl = document.getElementById('images');
var resultsEl = document.getElementById('results');
var chartEl = document.getElementById('chart');
var revealButtonEl = document.createElement('button');
var allSuckButtonEl = document.getElementById('allsuck');
var resetButtonEl = document.getElementById('reset');
var fancyButtons = document.getElementById('fancybuttons');
var imgContainers = document.getElementsByClassName('imgcontainer');
var voteCount = 0;
var notShownYet = [];
var barGraph;
var stepSize = 1;

// Product Object Constructor
function Product(filename) {
  this.name = filename.substring(0, filename.length - 4);
  this.filePath = './img/' + filename;
  this.clicks = 0;
  this.timesShown = 0;
  this.color = 'pink';
};
function calcPercentage(product) {
  return (100.0 * product.clicks / product.timesShown).toPrecision(3);
}
// selects three non-repeated images
function selectThree() {
  currentThree = [];
  var numSelected = 0;

  do {
    var randomObj = chooseRandomProduct();
    console.log('Try ' + randomObj.name);
    if ((currentThree.indexOf(randomObj) === -1) && (previousThree.indexOf(randomObj) === -1)) {
      currentThree.push(randomObj);
      randomObj.timesShown += 1;
      ++numSelected;
      console.log('Add ' + randomObj.name);
    } else {
      console.log('Repeat. Try again.');
    }
  } while (numSelected < 3);

  previousThree = [];
  previousThree = currentThree.slice();
}

// helper
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
  for (var i = 0; i < 3; i++) {
    var imgEl = document.getElementById(i + 'img');
    imgEl.src = currentThree[i].filePath;
  }
}

function handleFancyButtonClick(event) {
  if (event.target === allSuckButtonEl) {
    console.log('Boooooooo');
    selectThree();
    renderThree();
    console.log(voteCount);
  } else if (event.target === resetButtonEl) {
    localStorage.clear();
  }
}

function handleImgClick(event) {
  var target = event.target;
  if (target.getAttribute('id') === 'images') {
    return console.log('clicked...but not on image');
  }
  var targetObject = whichObject(target);
  console.log('Clicked on ' + targetObject.name);
  targetObject.clicks += 1;
  localStorage.setItem('productObjectList', JSON.stringify(productObjectList));
  voteCount++;
  if (voteCount === 25) {
    imagesEl.removeEventListener('mouseup', handleImgClick);
    // makes the image containers' borders red
    for (var i = 2; i >= 0; i--) {
      imgContainers[i].setAttribute('class', 'end');
    }
    // maybe should move the sort into the results handler; just has to be done before generateData
    sortProductsByClicks();
    revealResultsButton();
  } else {
    selectThree();
    renderThree();
  }
  console.log(voteCount);
}

function whichObject(targetEl) {
  var i = parseInt(targetEl.getAttribute('id'));
  // console.log(i);
  return currentThree[i];
}

function revealResultsButton() {
  // not sure this first step is necessary
  revealButtonEl.setAttribute('type', 'button');
  revealButtonEl.textContent = 'Show Results';
  resultsEl.appendChild(revealButtonEl);
  revealButtonEl.addEventListener('click', handleResultsButtonClick);
}

function handleResultsButtonClick() {
  resultsEl.innerHTML = '';
  var clicksGraphButton = document.createElement('button');
  var percentGraphButton = document.createElement('button');
  clicksGraphButton.textContent = 'Chart Clicks';
  percentGraphButton.textContent = 'Chart Clicks/Times-Shown %';
  resultsEl.appendChild(clicksGraphButton);
  resultsEl.appendChild(percentGraphButton);
  clicksGraphButton.addEventListener('click', makeClicksGraph);
  percentGraphButton.addEventListener('click', makePercentGraph);
  generateData();
  drawBarGraph();
  barGraph.tooltip._data.datasets[0].label = 'Times Clicked / Times Shown';
  barGraph.tooltip._data.datasets[0].data = percentData;
}

function makeClicksGraph() {
  sortProductsByClicks();
  generateData();
  data.datasets[0].data = clickData;
  data.datasets[0].label = 'Clicks per Item';
  stepSize = 1;
  drawBarGraph();
  barGraph.tooltip._data.datasets[0].label = 'Times Clicked / Times Shown';
  barGraph.tooltip._data.datasets[0].data = percentData;
}

function makePercentGraph() {
  sortProductsByPercent();
  generateData();
  data.datasets[0].data = percentData;
  data.datasets[0].label = 'Clicks / Times-Shown %';
  // could set stepSize same way data and label are set above
  stepSize = 20;
  drawBarGraph();
  barGraph.tooltip._data.datasets[0].label = 'Clicks';
  barGraph.tooltip._data.datasets[0].data = clickData;
}

function newCanvas() {
  chartEl.innerHTML = '';
  chartEl.innerHTML = '<canvas id="bargraph" width="800px" height="300px"></canvas>';
}

function generateData() {
  for (var i = 0; i < numProducts; i++) {
    labels[i] = productObjectList[i].name;
    clickData[i] = productObjectList[i].clicks;
    percentData[i] = calcPercentage(productObjectList[i]);
    colorData[i] = productObjectList[i].color;
  }
}

function sortProductsByClicks() {
  productObjectList.sort(function (a, b) {
    if (b.clicks === a.clicks) {
      return calcPercentage(b) - calcPercentage(a);
    } else {
      return b.clicks - a.clicks;
    }
  });
}

function sortProductsByPercent() {
  productObjectList.sort(function (a, b) {
    if (calcPercentage(b) === calcPercentage(a)) {
      return b.clicks - a.clicks;
    } else {
      return calcPercentage(b) - calcPercentage(a);
    }
  });
}

// I don't know where this should be...
var data =  {
  labels: labels,
  datasets: [{
    label: 'Clicks per Item',
    data: clickData,
    backgroundColor: colorData,
    borderColor: 'rgba(99, 99, 199, 1)',
    borderWidth: 1
  }]
};

function drawBarGraph() {
  newCanvas();
  var ctx = document.getElementById('bargraph').getContext('2d');
  barGraph = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        yAxes: [{
          ticks:{
            min: 0,
            stepSize: stepSize
          }
        }]
      },
      responsive: false
    }
  });
}

function makeObjectList() {
  for (var i = 0; i < numProducts; i++) {
    productObjectList.push(new Product(productNameList[i]));
    notShownYet.push(productObjectList[i]);
    productObjectList[i].color = colorList[i];
  }
}

function handleLoad() {
  if (localStorage.productObjectList) {
    productObjectList = JSON.parse(localStorage.getItem('productObjectList'));
  }
  else {
    makeObjectList();
  }

  selectThree();
  renderThree();
}

imagesEl.addEventListener('mouseup', handleImgClick);
fancyButtons.addEventListener('click', handleFancyButtonClick);

window.addEventListener('load', handleLoad);
