function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrayFromArrayObject(arr, identifier) {
  var _arr = [];
  for(var i = 0; i < arr.length; i++) {
    _arr.push(arr[i][identifier]);
  }

  return _arr;
}

function keyExists(key, search) {
    if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
    }
    for (var i = 0; i < search.length; i++) {
        if (search[i] === key) {
            return true;
        }
    }
    return key in search;
}

function sortNumber(a,b) {
  return a - b;
}

function getNumbersInBetween(min, max) {
  let results = [];
  for(var i = min; i <= max; i++) {
    results.push(i);
  }

  return results;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isMatchedTile(next)
{
  return next.hasClass('matchedTiles');
}

function getRowIndex(node)
{
    return Math.ceil(node / config.NUM_X_ROWS);
}

function manuallySetBoard(board)
{
  for(var i = 0; i < board.length; i++)
  {
    var correctedIdx = i + 1;
    var el = $('[data-number=' + correctedIdx + ']');
    el.attr('data-bit', board[i]);
    updateInnerText(el.attr('id'), el.attr('data-tilex'), el.attr('data-tiley'), board[i], el.attr('data-number')  )
  }
  boardMatrix = board;
}

function undoLastMove(undo)
{
  var arr = [],
      comparisonArr = [];
  if(undo) {
    arr = previousBoardCache;
    comparisonArr = boardMatrix;
    undoState = true;
    $('#undo').text('Revert');
  } else {
    arr = currentBoardCache;
    comparisonArr = previousBoardCache;
    undoState = false;
    $('#undo').text('Undo');
  }
  for(var i = 0; i < arr.length; i++)
  {
    var correctedIdx = i + 1;
    if(arr[i] != comparisonArr[i]) {
      // console.log(`should be changing ${arr[i]} to ${comparisonArr[i]} at number ${correctedIdx}`);
      $('[data-number=' + correctedIdx + ']').attr('data-bit', arr[i]);
    }
  }
}

function copy (text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
