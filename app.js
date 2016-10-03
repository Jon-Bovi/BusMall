'use strict';

var productList = ['bag.jpg', 'bathroom.jpg',	'breakfast.jpg', 'chair.jpg',	'dog-duck.jpg', 'pen.jpg', 'scissors.jpg', 'sweep.png',	'unicorn.jpg', 'water-can.jpg', 'banana.jpg', 'boots.jpg', 'bubblegum.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pet-sweep.jpg', 'shark.jpg', 'tauntaun.jpg', 'usb.gif', 'wine-glass.jpg'];


function product(filename) {
  this.name = filename.substring(0, filename.length - 4);
  this.filePath = 'img/' + filename;
  this.clicks = 0;
  this.timesShown = 0;
  function this.percentageClicked() {
    return 100 * clicks / timesShown;
  }
}
