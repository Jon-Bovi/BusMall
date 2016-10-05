'use strict';
// global goodies
var productNameList = ['bag.jpg', 'bathroom.jpg',	'breakfast.jpg', 'chair.jpg',	'dog-duck.jpg', 'pen.jpg', 'scissors.jpg', 'sweep.png',	'unicorn.jpg', 'water-can.jpg', 'banana.jpg', 'boots.jpg', 'bubblegum.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pet-sweep.jpg', 'shark.jpg', 'tauntaun.jpg', 'usb.gif', 'wine-glass.jpg'];
var productObjectList = [];
var previousThree = [];
var currentThree = [];
var clickData = [];
var labels = [];
var percentData = [];
var numProducts = productNameList.length;
var imagesEl = document.getElementById('images');
var resultsEl = document.getElementById('results');
var chartEl = document.getElementById('chart');
var revealButtonEl = document.createElement('button');
var allsuckEl = document.getElementById('allsuck');
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
  this.clicksPerTimesShownPercentage = function() {
    return (100.0 * this.clicks / this.timesShown).toPrecision(3);
  };
};

// selects three non-repeated images
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

function handleAllSuckClick() {
  selectThree();
  renderThree();
  console.log(voteCount);
}

function handleImgClick(event) {
  var target = event.target;
  if (target.getAttribute('id') === 'images') {
    return console.log('clicked...but not on image');
  }
  var targetObject = whichObject(target);
  targetObject.clicks += 1;
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
  clicksGraphButton.textContent = 'Show Clicks';
  percentGraphButton.textContent = 'Show Clicks per Times Shown %';
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
  data.datasets[0].label = 'Clicks : Times-Shown';
  // could set stepSize same way data and label are set above
  stepSize = 20;
  drawBarGraph();
  barGraph.tooltip._data.datasets[0].label = 'Clicks';
  barGraph.tooltip._data.datasets[0].data = clickData;
}

function newCanvas() {
  chartEl.innerHTML = '';
  chartEl.innerHTML = '<canvas id="bargraph" width="800px" height="250px"></canvas>';
}

function generateData() {
  for (var i = 0; i < numProducts; i++) {
    labels[i] = productObjectList[i].name;
    clickData[i] = productObjectList[i].clicks;
    percentData[i] = productObjectList[i].clicksPerTimesShownPercentage();
  }
}

function sortProductsByClicks() {
  productObjectList.sort(function (a, b) {
    if (b.clicks === a.clicks) {
      return b.clicksPerTimesShownPercentage() - a.clicksPerTimesShownPercentage();
    } else {
      return b.clicks - a.clicks;
    }
  });
}

function sortProductsByPercent() {
  productObjectList.sort(function (a, b) {
    if (b.clicksPerTimesShownPercentage() === a.clicksPerTimesShownPercentage()) {
      return b.clicks - a.clicks;
    } else {
      return b.clicksPerTimesShownPercentage() - a.clicksPerTimesShownPercentage();
    }
  });
}

// I don't know where this should be...
var data =  {
  labels: labels,
  datasets: [{
    label: 'Clicks per Item',
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
  }
}

imagesEl.addEventListener('mouseup', handleImgClick);
allsuckEl.addEventListener('click', handleAllSuckClick);

makeObjectList();
selectThree();
renderThree();
