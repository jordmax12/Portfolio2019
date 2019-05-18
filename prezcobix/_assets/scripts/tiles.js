function drawTable(numBoxesX, numBoxesY, color) {
  //generate weighted list of colors based on percentages
  var list = createArrayFromArrayObject(colors, 'name');
  var _weight = [config.xWeight, config.colorWeight, config.colorWeight, config.colorWeight];
  var weighed_list = generateWeighedList(list, _weight);
  var count = 1;

  for(var x = 1; x < numBoxesY.length + 1; x++) {
    //generate new y block
    // document.body.innerHTML += '<div class="box" id="box-' + x + '" style="width: 100px; padding: 25px 5px; float: left; display: block;">';
    document.body.innerHTML += '<div class="box" id="box-' + x + '" style="height: 100px; width: 100px; display: block;">';

    for(var y = 1; y < numBoxesX.length + 1; y++) {
      //get random color based on weight (color has more weight than the x)
      var random_num = rand(0, weighed_list.length-1);
      var color = weighed_list[random_num];
      var colorBit = colors.filter(item => item.name == color);
      //generate new x block
      //generate random color (4 different colors)
      //
      boardMatrix.push(colorBit[0].bit);
      // var box = '<div class="tile" id="innerBox-' + y + '-' + x + '" onclick="selectController(this)" data-tileX="' + x + '" data-tileY="' + y + '" data-color="' + color + '" data-bit="' + colorBit[0].bit + '" data-number="' + count + '"><p style="margin-top: 40px;">y:' + y + ' x:' + x + '  bit: ' + colorBit[0].bit + ' num: '+ count +'</p></div>';
      var box = generateTile(x, y, colorBit, color, count);
      count++;
      document.getElementById('box-' + x).innerHTML += box;
      $(`#innerBox-${y}-${x}`).css('top', 100 * y + 'px');
    }
    document.body.innerHTML += '</div>';
  }
}

function updateInnerText(divId, x, y, bit, number)
{
  $('#' + divId + ' p').text('y:' + y + ' x:' + x + '  bit: ' + bit + ' num: '+ number)
}

function selectTile(tileEl) {
  if(undoState) {
    alert('you are in undo mode, cannot make a move. Please revert to make any moves.');
    return;
  }
  $('.selectedTile').removeClass('selectedTile');
  $(tileEl).addClass('selectedTile');
  gameState = STATE_SELECTED;
  lastSelectedEl = tileEl;
}

function initMoveTile(tileEl) {
  moveTile(lastSelectedEl, tileEl);
  lastSelectedEl = tileEl;
}

function moveTile(origEl, destEl) {
  //here we need to switch the two elements
  previousBoardCache = boardMatrix.slice(0);
  swapElements($(origEl), $(destEl));
  $('.selectedTile').removeClass('selectedTile');
  gameState = STATE_SELECTING;
}

function generateTile(x, y, colorBit, color, count, newTile = false)
{
  var classes = 'tile ';
  if(newTile) classes += 'newTiles';
  return '<div class="' + classes + '" id="innerBox-' + y + '-' + x + '" onclick="selectController(this)" data-tileX="' + x + '" data-tileY="' + y + '" data-color="' + color + '" data-bit="' + colorBit[0].bit + '" data-number="' + count + '"><p style="margin-top: 40px;">y:' + y + ' x:' + x + '  bit: ' + colorBit[0].bit + ' num: '+ count +'</p></div>';
}

function getIndexInverse(index)
{
  switch(index) {
    case 1:
      return 7;
      break;
    case 2:
      return 6;
      break;
    case 3:
      return 5;
      break;
    case 4:
      return 4;
      break;
    case 5:
      return 3;
      break;
    case 6:
      return 2;
      break;
    case 7:
      return 1;
      break;
    case 8:
      return 0;
      break;
  }
}

function generateWeighedList (list, weight) {
  var weighed_list = [];
  // Loop over weights
  for (var i = 0; i < weight.length; i++) {
    var multiples = weight[i] * 100;

    // Loop over the list of items
    for (var j = 0; j < multiples; j++) {
      weighed_list.push(list[i]);
    }
  }

  return weighed_list;
};
