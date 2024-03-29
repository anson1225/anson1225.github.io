
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var difficulty = 3;
var randomComparator = function (a, b) {
  return 0.5 - Math.random();
};
var sudoku = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var answer = [[], [], [], [], [], [], [], [], []];
var table = [[], [], [], [], [], [], [], [], []];

function checkColumn(col, x) {
  for (var i = 0; i < 9; i++) {
    if (sudoku[i][col] === x) {
      return false;
    }
  }
  return true;
}

function checkRow(row, x) {
  for (var j = 0; j < 9; j++) {
    if (sudoku[row][j] === x) {
      return false;
    }
  }
  return true;
}

function checkBlock(row, col, x) {
  var startRow = Math.floor(row / 3) * 3;
  var startCol = Math.floor(col / 3) * 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (sudoku[startRow + i][startCol + j] === x) {
        return false;
      }
    }
  }
  return true;
}

function check(i, j, x) {
  return checkRow(i, x) && checkColumn(j, x) && checkBlock(i, j, x);
}

function columnOK(col) {
  var sum = 0;
  for (var i = 0; i < 9; i++) {
    sum += sudoku[i][col];
  }
  return sum === 45;
}

function columnsOK() {
  for (var j = 0; j < 9; j++) {
    if (!columnOK(j)) {
      return false;
    }
  }
  return true;
}

function rowOK(row) {
  var sum = 0;
  for (var j = 0; j < 9; j++) {
    sum += sudoku[row][j];
  }
  return sum === 45;
}

function rowsOK() {
  for (var i = 0; i < 9; i++) {
    if (!rowOK(i)) {
      return false;
    }
  }
  return true;
}

function blockOK(n) {
  var startRow = Math.floor((n - 1) / 3) * 3;
  var startCol = (n - 1) % 3 * 3;
  var sum = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      sum += sudoku[startRow + i][startCol + j];
    }
  }
  return sum === 45;
}

function blocksOK() {
  for (var i = 1; i <= 9; i++) {
    if (!blockOK(i)) {
      return false;
    }
  }
  return true;
}

function sudokuOK() {
  return columnsOK() && rowsOK() && blocksOK();
}

function tryit(i, j) {
  if (i >= 9) {
    return true;
  }
  var s = i;
  var t = j + 1;
  if (t >= 9) {
    t -= 9;
    s++;
  }
  if (sudoku[i][j] !== 0) {
    var success = tryit(s, t);
    if (success) {
      return true;
    }
  }
  for (var k = 0; k < 9; k++) {
    if (check(i, j, a[k])) {
      sudoku[i][j] = a[k];
      var success = tryit(s, t);
      if (success) {
        return true;
      }
      sudoku[i][j] = 0;
    }
  }
  return false;
}
function setBlockRandomly(n) {
  var startRow = Math.floor((n - 1) / 3) * 3;
  var startCol = (n - 1) % 3 * 3;
  a.sort(randomComparator);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      sudoku[startRow + i][startCol + j] = a[i * 3 + j];
    }
  }
}
function bindTable() {
  var e = document.getElementById("sudoku").firstElementChild;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      table[i].push(e);
      e = e.nextElementSibling;
    }
  }
}
function setTable(a) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (a[i][j] !== 0) {
        table[i][j].innerHTML = a[i][j];
      } else {
        table[i][j].innerHTML = '<input type="text" maxlength="1" onchange="onInput(' + i + ',' + j + ');"/>';
      }
    }
  }
}

function createSudoku() {
  clear(sudoku);
  setBlockRandomly(3);
  setBlockRandomly(5);
  setBlockRandomly(7);
  a.sort(randomComparator);
  var success = tryit(0, 0);
  return success;
}

function clear(arr) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      arr[i][j] = 0;
    }
  }
}
function copy(arr) {
  var a = [[], [], [], [], [], [], [], [], []];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      a[i].push(arr[i][j]);
    }
  }
  return a;
}

function createGame() {
  while (!createSudoku());
  answer = copy(sudoku);
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < difficulty + Math.floor(Math.random() * 2); j++) {
      sudoku[i][Math.floor(Math.random() * 9)] = 0;
    }
  }
}
function easy() {
  difficulty = 3;
}
function hard() {
  difficulty = 5;
}
function disgust() {
  difficulty = 7;
}
function change() {
  createGame();
  setTable(sudoku);
}
function showAnswer() {
  setTable(answer);
  endTimer();
}
function onInput(i, j) {
  var inputElement = table[i][j].firstElementChild;
  var value = parseInt(inputElement.value);
  if (check(i, j, value)) {
    sudoku[i][j] = value;
  } else {
    alert('答案錯誤');
    inputElement.value = "";
  }
  if (sudokuOK()) {
    gameOver();
  }
}


var timeStart;
var countTime = false;
var timeArea;
var count = 0;
var timerId = -1;
function startTimer() {
  timeStart = new Date();
  countTime = true;
  count = 0;
  timeArea.innerHTML =  "00 : 00 : 00";
  timerId = setTimeout(timer, 1000);
  console.log(timerId);
}
function timer() {
  count++;
  var h = pad(parseInt(count / 3600));
  var m = pad(parseInt(count / 60));
  var s = pad(parseInt(count % 60));
  timeArea.innerHTML = h + " : " + m + " : " + s;
  if (countTime) {
    timerId = setTimeout(timer, 1000);
  }
}
function pad(i) {
  if (i < 10) {
    return "0" + i;
  }
  return i;
}
function endTimer() {
  countTime = false;
  clearTimeout(timerId);
  console.log(timerId);
}
function gameStart() {
  endTimer();
  change();
  startTimer();
}
function gameOver() {
  endTimer();
  var restart = confirm('恭喜完成，點擊繼續下一關');
  if(restart) {
    gameStart();
  }
}
(function loading() {
  bindTable();
  timeArea = document.getElementById("timer");
  gameStart();
})();
