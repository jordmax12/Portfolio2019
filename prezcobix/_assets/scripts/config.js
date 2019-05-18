const STATE_SELECTING = 'state_selecting';
const STATE_SELECTED = 'state_selected';
const STATE_VALIDATING = 'state_validating';
const STATE_VALIDATED = 'state_validated';
const STATE_VALID_TRUE = 'state_valid_true';
const STATE_VALID_FALSE = 'state_valid_false';

const config = {
  NUM_X_ROWS: 8,
  NUM_Y_ROWS: 8,
  colorWeight: 0.31,
  xWeight: 0.06,
}

var gameState = STATE_SELECTING,
    lastSelectedEl,
    boardMatrix = [],
    currentMatchedElements = [],
    previousBoardCache = [],
    currentBoardCache = [],
    undoState = false;


const colors = [
  {
    name: 'x',
    bit: 0,
    weight: config.xWeight
  },
  {
    name: 'red',
    bit: 1,
    weight: config.colorWeight
  },
  {
    name: 'blue',
    bit: 2,
    weight: config.colorWeight
  },
  {
    name: 'green',
    bit: 3,
    weight: config.colorWeight
  }
  // {
  //   name: 'orange',
  //   bit: 4,
  //   weight: colorWeight
  // }
];
