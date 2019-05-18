var currentUndoState = 'default';
$(document).ready(function() {
  xArr = new Array(config.NUM_X_ROWS);
  yArr = new Array(config.NUM_Y_ROWS);
  drawTable(xArr, yArr);

  $('#undo').on('click', function() {
    if(currentUndoState == 'default')
    {
      undoLastMove(true);
      currentUndoState = 'undo';
    }
    else
    {
      undoLastMove(false);
      currentUndoState = 'default';
    }
  });

  $('#copy').on('click', function() {
    let arr = [];
    arr.push('A');
    arr.push(currentBoardCache);
    arr.push('B');
    arr.push(previousBoardCache);
    copy(arr);
  });
});
