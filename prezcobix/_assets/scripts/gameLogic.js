function selectController(tileEl) {
  // console.log(gameState);
  switch(gameState) {
    case STATE_SELECTING:
      selectTile(tileEl);
      break;
    case STATE_SELECTED:
      initMoveTile(tileEl);
      break;
  }
}

function swapElements(sourceObj, targetObj) {

  var cloneSource = sourceObj.clone();
  var cloneTarget = targetObj.clone();

  if(sourceObj.data('color') == 'x' || targetObj.data('color') == 'x') return;

  var valid = validateMove(sourceObj, targetObj);
  if(valid) {
    $('#undo').show();
    $('#copy').show();
    gameState = STATE_VALID_TRUE;
  } else {
    gameState = STATE_VALID_FALSE;
  }

  if(!targetObj.is(':empty') && valid) {
    if(sourceObj.hasClass('matchedTiles')) {
      cloneTarget.addClass('matchedTiles')
    }
    if(targetObj.hasClass('matchedTiles')) {
      cloneSource.addClass('matchedTiles')
    }
    //get data ready
    var sourceDataNumber = cloneSource.attr('data-number'),
        targetDataNumber = cloneTarget.attr('data-number'),
        sourceBit = cloneSource.attr('data-bit'),
        targetBit = cloneTarget.attr('data-bit');
    //change data attr's
    // updateInnerText(cloneTarget.attr('id'), cloneSource.attr('data-tilex'), cloneSource.attr('data-tiley'), cloneSource.attr('data-bit'), cloneSource.attr('data-number'));
    // updateInnerText(cloneSource.attr('id'), cloneTarget.attr('data-tilex'), cloneTarget.attr('data-tiley'), cloneTarget.attr('data-bit'), cloneTarget.attr('data-number'));
    var correctedSourceHtml = `<p style="margin-top: 40px;">y:${cloneTarget.attr('data-tiley')} x:${cloneTarget.attr('data-tilex')} bit: ${cloneTarget.attr('data-bit')} num: ${cloneTarget.attr('data-number')}</p>`
    var correctedTargetHtml = `<p style="margin-top: 40px;">y:${cloneSource.attr('data-tiley')} x:${cloneSource.attr('data-tilex')} bit: ${cloneSource.attr('data-bit')} num: ${cloneSource.attr('data-number')}</p>`
    cloneSource.html(correctedSourceHtml);
    cloneTarget.html(correctedTargetHtml);
    cloneTarget.attr('data-number', sourceDataNumber);
    cloneSource.attr('data-number', targetDataNumber);
    cloneSource.attr('data-tiley', cloneTarget.attr('data-tiley'));
    cloneTarget.attr('data-tiley', cloneSource.attr('data-tiley'));
    cloneSource.attr('data-tilex', cloneTarget.attr('data-tilex'));
    cloneTarget.attr('data-tilex', cloneSource.attr('data-tilex'));

    cloneTarget.css('top', cloneSource.css('top'));
    cloneSource.css('top', cloneTarget.css('top'));

    //change board matrix
    boardMatrix[sourceDataNumber - 1] = parseInt(targetBit);
    boardMatrix[targetDataNumber - 1] = parseInt(sourceBit);
    //swap elements
    //TODO: don't swap elements, but move them? see what this is doing, and what we can do to make it better
    sourceObj.replaceWith(cloneTarget);
    targetObj.replaceWith(cloneSource);

    let matches = [];

    //get random bit value to assign new values to the tiles that we be eliminated.
    $('.matchedTiles').each(function(idx, el) {
      //
      var _self = this,
          seen = {};
      getAllAboveRowElements($(el), function(_matches) {
        matches.push.apply(matches, _matches);
        matches = matches.filter(function(item) {
          if($('[data-number=' + item + ']').hasClass('removeTiles')) return false;
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
      });

      $(this).addClass('removeTiles').removeClass('matchedTiles');
    });

    for(var i = 0; i < matches.length; i++) {
      var curr = matches[i];
      $("[data-number=" + curr + "]").addClass('moveDownTiles');
    }

    //we now have a collection of tiles to move, and the tiles that are matched.
    //next steps would be to "delete" the matched tiles, and move down the movedown tiles.
    $('.removeTiles').each(function(i, el) {
      $(this).remove();
    });

    //figure out how many new tiles each row needs
    for(var i = 1; i <= config.NUM_Y_ROWS; i++)
    {
      var count = parseInt(config.NUM_Y_ROWS - $(`#box-${i} .tile`).length);
      //generate the amount of tiles
      // console.log(`we need ${count} tiles in row ${i}`);
      $(`#box-${i} .moveDownTiles`).each(function(i, el) {
        var _el = $(el);

        //ok so now we have each element that we are moving down.
        //what we need to do here is, change the data attributes, html (optional), and board matrix
        var dataTiley = parseInt(_el.attr('data-tiley')),
            dataNumber = parseInt(_el.attr('data-number')),
            newY = dataTiley + count,
            newIndex = dataNumber + count;

        _el.attr('data-tiley', newY);
        _el.attr('data-number', newIndex);
        boardMatrix[newIndex - 1] = parseInt(_el.attr('data-bit'));
        updateInnerText(_el.attr('id'), _el.attr('data-tilex'), newY, _el.attr('data-bit'), newIndex);
        _el.removeClass('moveDownTiles');
      });
      //now that we've moved them down, we're going to generate the new tiles we need
      for(var j = count; j > 0; j--)
      {
        var _x = i,
            _y = j,
            _count = (i * config.NUM_Y_ROWS) - getIndexInverse(j);

        var _color = getRandomInt(1, 3);
        var _colorBit = colors.filter(item => item.bit == _color);
        // console.log(`inserting tile at y: ${_y} x: ${_x} at index: ${_count} color: ${color} colorBit: ${colorBit}`);
        var tile = generateTile(_x, _y, _colorBit, _color, _count, true);
        boardMatrix[_count - 1] = _color;
        $(`#box-${i}`).prepend(tile);
      }
    }
    currentBoardCache = boardMatrix;
    //IDEA: here we would want to initiate to check the rest of the board
    $('.box').each(function(i, el) {
      $('#' + $(el).attr('id') + ' .tile').each(function(x, ele) {
        var elY = $(ele).attr('data-tiley');
        if(Math.floor($(ele).offset().top) !== (elY * 100)) {
          var offset = elY * 100;
          $(ele).animate({'top': offset});
        }
      });
    });
    // setTimeout(function() {
    //   checkEntireBoardForMatches();
    // }, 3000);
  } else {
    gameState = STATE_SELECTING;
  }
}

function checkEntireBoardForMatches()
{
  //so this is fuzzy logic here. We need to find any and all consecutive matches on the board
  //how to do this? no idea lol.

  var collection = [],
      start = new Date(),
      matchCount = 1;

  function _checkHorizontal()
  {
    for(var i = 0; i < $('.tile').length; i++)
    {
      //check to see if node can go up, down, left, or right. Count the number of matches and put those
      //indexes into an array, and lets just see what happens
      //I do plan on changing this to something more efficient, but just to get the job done, lets do it
      //this way first and then improve it as we see fit.
      let currentIndex = i,
          // nextYIndex = currentIndex + 1,
          previousYIndex = currentIndex - 1,
          // nextXIndex = currentIndex + 8,
          previousXIndex = currentIndex - config.NUM_X_ROWS;

          if(typeof boardMatrix[previousYIndex] !== "undefined")
          {
            let source = $(`[data-number=${currentIndex + 1}]`),
                target = $(`[data-number=${previousYIndex + 1}]`);

            if(boardMatrix[previousYIndex] == boardMatrix[currentIndex] && source.attr('data-tilex') == target.attr('data-tilex')) {
              matchCount++;
              // console.log(`matched match count: ${matchCount}`);
            } else {
              // if(matchCount > 0)
              //   matchCount--;
              if(matchCount >= 3) {
                // console.log('source', source[0], 'target', target[0]);
                // console.log(`match count: ${matchCount}`, source[0]);
                let arr = [];
                for(var x = matchCount; x > 0; x--)
                {
                  // arr.push($(`[data-number=${matchedTileIndex}]`));
                  let matchedTileIndex = source.attr('data-number') - x;
                  arr.push(matchedTileIndex);
                }
                collection.push(arr);
              }

              matchCount = 1;
            }
            // var valid = false;
          }
    }
  }

  function _checkVertical()
  {
    for(var i = 0; i < $('.tile').length; i++)
    {
      var currentIndex = i,
          // nextYIndex = currentIndex + 1,
          previousYIndex = currentIndex - 1,
          // nextXIndex = currentIndex + 8,
          previousXIndex = currentIndex - config.NUM_X_ROWS;

      if(typeof boardMatrix[previousXIndex] !== "undefined")
      {
        let source = $(`[data-number=${currentIndex + 1}]`),
            target = $(`[data-number=${previousXIndex + 1}]`);


        //TODO: in theory, if we already checked an index, we dont need to check it again.
        function _checkNext(prevIndex, currIndex, sourceTileY, targetTileY, cb)
        {
          // console.log(prevIndex, currIndex, boardMatrix[prevIndex], boardMatrix[currIndex], sourceTileY, targetTileY);
          if(boardMatrix[prevIndex] == boardMatrix[currIndex] && sourceTileY == targetTileY) {
            matchCount++;
            if(typeof boardMatrix[currIndex + config.NUM_X_ROWS] !== 'undefined') {
              _checkNext(prevIndex, currIndex + config.NUM_X_ROWS, $(`[data-number=${currIndex + config.NUM_X_ROWS + 1}]`).attr('data-tiley'), targetTileY, cb)
            } else {
              cb(matchCount);
              matchCount = 1;
            }
          } else {
            cb(matchCount);
            matchCount = 1;
          }
        }
        var matchedCollection = [];
        var check = _checkNext(previousXIndex, currentIndex, source.attr('data-tiley'), target.attr('data-tiley'), function(data) {
          if(data >= 3) {
            var arr = [];
            // arr.push(previousXIndex);
            for(var x = 0; x < data; x++) {
              var elIdx = previousXIndex + (config.NUM_X_ROWS * x);
              arr.push(elIdx + 1);
            }
            //make sure no dupes, although probably not needed.
            arr = arr.filter(function(item, pos) {
              return arr.indexOf(item) == pos;
            });
            collection.push(arr);
          }
        });
      }
    }
  }

  _checkVertical();
  _checkHorizontal();
  for(var y = 0; y < collection.length; y++) {
    var curr = collection[y];
    for(var u = 0; u < curr.length; u++) {
      $(`[data-number=${curr[u]}]`).addClass('matchedTiles');
    }
  }
  var end = new Date();
  console.log(`Process took ${(end.getTime() - start.getTime()) / 1000} seconds to complete`);
}

function getAllAboveRowElements(start, cb)
{
  //get row index
  let index = start.attr('data-number');
  let rowNumber = getRowIndex(index);
  let next = $('[data-number=' + (index - 1) + ']');
  let startingIndex = (rowNumber * config.NUM_X_ROWS) - 7;

  //if true, then just return the rest of the indexes in the row (going up)
  function checkMatch(node) {
    if(!isMatchedTile(node)) {
      //log the index
      let collection = getNumbersInBetween(startingIndex, node.attr('data-number'));
      cb(collection);
      // matches.push(node.attr('data-number'));
    } else {
      let _next = $('[data-number=' + (node.attr('data-number') - 1) + ']');
      checkMatch(_next);
    }
  }

  checkMatch(next);
}

function validateMove(sourceObj, targetObj)
{
  checkAxis('vertical', sourceObj, targetObj);
  checkAxis('horizontal', sourceObj, targetObj);
  checkAxis('vertical', targetObj, sourceObj);
  checkAxis('horizontal', targetObj, sourceObj);

  var preMatchedTiles = $('.preMatchedTiles');
  if(preMatchedTiles.length == 0) {
    return false
  }
  for(var i = 0; i < preMatchedTiles.length; i++)
  {
    $(preMatchedTiles[i]).removeClass('preMatchedTiles').addClass('matchedTiles');
  }

  return true;
}

function checkAxisCallback(_data, sourceObj, targetObj, type)
{
  if(_data && _data.length >= 2) {
    let results = [];
    if(type == 'vertical') {
      results = validateMatch(sourceObj, targetObj, _data, 'tiley');
    } else {
      results = validateMatch(sourceObj, targetObj, _data, 'tilex')
    }

    for(var j = 0; j < results.length; j++) {
      if(results[j].length >= 3) {
        for(var x = 0; x < results[j].length; x++) {
          let curr = $('[data-number=' + results[j][x] + ']');
          curr.addClass('preMatchedTiles');
          $(targetObj).addClass('preMatchedTiles');
        }
      }
    }
  }
}

function checkAxis(type, sourceObj, targetObj, cb)
{
  if(type == 'vertical') {
    //get next and previous nodes given data from source and target object
    var sourceIndex = parseInt(sourceObj.attr('data-number')),
        targetIndex = parseInt(targetObj.attr('data-number')),
        nextSourceIdx = sourceIndex + 1,
        nextTargetIdx = targetIndex + 1,
        prevSourceIdx = sourceIndex - 1,
        prevTargetIdx = targetIndex - 1;
    //validate new indexes, make sure we're comparing the same row.
    checkVerticalNodes('increment', nextTargetIdx, sourceObj, targetObj, boardMatrix[sourceIndex - 1], boardMatrix[nextTargetIdx - 1], [], function(data) {
      checkVerticalNodes('decrement', prevTargetIdx, sourceObj, targetObj, boardMatrix[sourceIndex - 1], boardMatrix[prevTargetIdx - 1], data, function(_data) {
        checkAxisCallback(_data, sourceObj, targetObj, type);
      })
    });
  } else {
    //get next and previous nodes given data from source and target object
    var sourceIndex = parseInt(sourceObj.attr('data-number')),
        targetIndex = parseInt(targetObj.attr('data-number')),
        nextSourceIdx = sourceIndex + 8,
        nextTargetIdx = targetIndex + 8,
        prevSourceIdx = sourceIndex - 8,
        prevTargetIdx = targetIndex - 8;
    //validate new indexes, make sure we're comparing the same row.
    checkHorizontalNodes('increment', nextTargetIdx, sourceObj, targetObj, boardMatrix[sourceIndex - 1], boardMatrix[nextTargetIdx - 1], [], function(data) {
      checkHorizontalNodes('decrement', prevTargetIdx, sourceObj, targetObj, boardMatrix[sourceIndex - 1], boardMatrix[prevTargetIdx - 1], data, function(_data) {
        checkAxisCallback(_data, sourceObj, targetObj, type);
      })
    });
  }
}

function validateMatch(sourceObj, targetObj, data, selector) {
  //so we have a 'match' between soucrObj and the data that follows.
  //horizontal tiles increment or decrement (depending on direction) by NUM_X_ROWS
  //let's validate this match to make sure that it's not a false positive.
  //However, this is complicated because we need to validate by shifting the source number
  //with the target number, BUT still using the source bit to validate with data
  var sourceIdx = targetObj.attr('data-number'),
      sourceBit = sourceObj.attr('data-bit'),
      matchCount = 0,
      matchNumArr = [sourceIdx],
      test = [];

  for(var i = 0; i < data.length; i++)
  {
    //grab each bit from data array, compare with source, if 3, it's a match
    var curr = data[i];
    if(curr.attr('data-bit') == sourceBit && curr.attr('data-number')) {
      matchCount++;
      matchNumArr.push(curr.attr('data-number'));
    }
  }

  matchNumArr.sort(sortNumber);

  var parentCollection = [],
      childCollection = [];

  for(var j = 0; j < matchNumArr.length; j++) {
    var curr = matchNumArr[j],
        nextIdx = j + 1;
    //does next exist?
    if(matchNumArr[nextIdx]) {
      //is the current index -1 or -8 from the next?
      var next = matchNumArr[nextIdx];
      childCollection.push(curr);
      // console.log(`curr ${curr} next ${next}`)
      if(next - curr != 1 && next - curr != 8) {
        // console.log('printing child collection 1');
        // console.log(childCollection);
        if(childCollection.indexOf(sourceIdx) > -1) {
          parentCollection.push(childCollection);
        }
        childCollection = [];
      }
    } else {
      //when it's finished, grab the remainder
      childCollection.push(curr);
      // console.log('printing child collection 2');
      // console.log(childCollection);
      if(childCollection.indexOf(sourceIdx) > -1) {
        parentCollection.push(childCollection);
      }
    }

  }
  // console.log('printing parent collection')
  // console.log(parentCollection);
  return parentCollection;
}

function isStartingOrEndingVerticalNode(node)
{
  //if node is starting or ending return object with startingOrEnding enum value
  var group = Math.ceil(node / config.NUM_Y_ROWS);

  if(node == group * config.NUM_Y_ROWS) {
    //ending?
    return StartingOrEndingTypes.STATE_ENDING;
  } else if(node == (group * config.NUM_Y_ROWS - (config.NUM_Y_ROWS - 1))) {
    //starting?
    return StartingOrEndingTypes.STATE_STARTING;
  } else {
    return StartingOrEndingTypes.STATE_NO_MATCH;
  }
}

function isStartingOrEndingHorizontalNode(node)
{
  //matrix bound count - 8 (all numbers would be the horizontal sides)
  //1 to NUM X would be the other horizontal side
  var length = boardMatrix.length;
  if(node >= 1 && node <= config.NUM_X_ROWS) {
    return StartingOrEndingTypes.STATE_STARTING;
  } else if (node >= (length - config.NUM_X_ROWS) && node <= length) {
    return StartingOrEndingTypes.STATE_ENDING;
  } else {
    return StartingOrEndingTypes.STATE_NO_MATCH;
  }
}

function checkVerticalNodes(type, index, sourceObj, targetObj, source, next, ret, cb)
{
  let startingOrEnding = isStartingOrEndingVerticalNode(index);

  if (source == next) {
    let elToPush = $('[data-number=' + index + ']');
    if(elToPush[0] != sourceObj[0] && elToPush[0] != targetObj[0])
      ret.push($('[data-number=' + index + ']'));
    var _index = type == 'increment' ? index + 1 : index - 1;
    var newNext = $('[data-number=' + _index + ']').attr('data-bit');
    if(startingOrEnding == StartingOrEndingTypes.STATE_NO_MATCH) {
      checkVerticalNodes(type, _index, sourceObj, targetObj, source, newNext, ret, cb);
    } else {
      cb(ret);
    }

  } else {
    cb(ret);
  }
}

function checkHorizontalNodes(type, index, sourceObj, targetObj, source, next, ret, cb)
{
  let startingOrEnding = isStartingOrEndingHorizontalNode(index);
  if (source == next) {
    let elToPush = $('[data-number=' + index + ']');
    if(elToPush[0] != sourceObj[0] && elToPush[0] != targetObj[0])
    {
      ret.push($('[data-number=' + index + ']'));
    }
    // else {
    //   cb(ret);
    // }
    var _index = type == 'increment' ? index + 8 : index - 8;
    var newNext = $('[data-number=' + _index + ']').attr('data-bit');
    if(startingOrEnding == StartingOrEndingTypes.STATE_NO_MATCH) {
      checkHorizontalNodes(type, _index, sourceObj, targetObj, source, newNext, ret, cb);
    } else {
      cb(ret);
    }

  } else {
    cb(ret);
  }
}

function checkForOriginalElement(arr, selectedObj, targetObj)
 {
   var ret = false;
   if(arr.length > 0) {
     for(var i = 0; i < arr[0].matchedElements.length; i++) {
       var curr = arr[0].matchedElements[i];
       if(curr == selectedObj[0] || curr == targetObj[0]) {
         ret = true;
       }
     }
   }
   return ret;
 }
function checkController(yAxis, xAxis, selectedObj, targetObj)
{
  //run a check through each row, row is each array of elements.
  //if both x's are the same, or y's (one of them will be), only run once.
    var checkYSelected = checkRow(yAxis.data.selected, yAxis.elements.selected),
        checkYTarget = checkRow(yAxis.data.target, yAxis.elements.target);

    if(checkYSelected.length > 0) {
      var matchedWithOriginalElements = checkForOriginalElement(checkYSelected, selectedObj, targetObj);

      if(!matchedWithOriginalElements) {
        console.log('did not find either original elements in collection: checkYSelected')
      } else {
        console.log('found match in : checkYSelected')
      }
    } else {
      console.log('no matching for checkYSelected')
    }

    if(!matchedWithOriginalElements && checkYTarget.length > 0) {
      matchedWithOriginalElements = checkForOriginalElement(checkYTarget, selectedObj, targetObj);

      if(!matchedWithOriginalElements) {
        console.log('did not find either original elements in collection: checkYTarget')
      } else {
        console.log('found match in : checkYTarget')
      }
    } else {
      console.log('no matching for checkYTarget')
    }
    var checkXSelected = checkRow(xAxis.data.selected, xAxis.elements.selected);
    var checkXTarget = checkRow(xAxis.data.target, xAxis.elements.target);
    if(checkXSelected.length > 0) {
      var matchedWithOriginalElements = checkForOriginalElement(checkXSelected, selectedObj, targetObj);
      if(!matchedWithOriginalElements) {
        console.log('did not find either original elements in collection: checkXSelected')
      } else {
        console.log('found match in : checkXSelected')
      }
    } else {
      console.log('no matching for : checkXSelected')
    }

    if(!matchedWithOriginalElements && checkXTarget.length > 0) {
        matchedWithOriginalElements = checkForOriginalElement(checkXTarget, selectedObj, targetObj);
        if(!matchedWithOriginalElements) {
          console.log('did not find either original elements in collection: checkXTarget')
        } else {
          console.log('found match in : checkXTarget')
        }
    }
  // }

}

function checkRow(rowData, rowElements) {
  var tracker = [];
      previousValue = 0;

  for(var i = 0; i < rowData.length; i++) {
    var prev = (i == 0 ? undefined : rowData[i - 1]),
        next = (i == rowData.length - 1 ? undefined : rowData[i + 1]),
        curr = rowData[i];

    if(prev && prev.bit == curr.bit) {
      //get count first
      if(keyExists(curr.bit, tracker)) {
        //increment count
        tracker[curr.bit].count++;
        tracker[curr.bit].matchedElements.push(rowElements[i])
      } else {
        var bit = curr.bit
        var obj = {count: 2, matchedElements: [rowElements[i - 1], rowElements[i] ]};
        tracker[curr.bit] = obj;
      }
    }
  }
  //make sure any matches in tracker is limited to at least 3 count
  return tracker.filter(track => track.count >= 3);
}

function nextCheck(curr, data, idx) {
  if(curr.tilex != data.length) {
    var next = data[idx];
    if(next && next.bit == curr.bit) {
      //match found, return
      return next;
    }
  }
  return null;
}

function prevCheck(curr, data, idx) {
  if(curr.tilex != data.length) {
    var prev = data[idx];
    if(prev && prev.bit == curr.bit) {
      //match found, return
      return prev;
    }
  }
  return null;
}
