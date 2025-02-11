let squares = [],
  queenClassNames = [1, 2, 3, 4, 5, 6, 7, 8].map(i => "queen-" + i),
  timer = null,
  startTime = null;

let squaresDom = document.getElementsByClassName("square");
for (let i = 0; i < 8; i++) {
  squares[i] = [];
  for (let j = 0; j < 8; j++) {
    squares[i][j] = squaresDom[i * 8 + j];
    squares[i][j].onclick = onSquareClick.bind(null, i, j);
  }
}

function startTimer() {
  startTime = new Date().getTime();
  timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function updateTimer() {
  let currentTime = new Date().getTime();
  let elapsedTime = Math.floor((currentTime - startTime) / 1000);
  document.getElementById("timer").textContent = `Time: ${elapsedTime} seconds`;
}

function resetTimer() {
  clearInterval(timer);
  document.getElementById("timer").textContent = `Time: 0 seconds`;
}

// Contains indices of queens on the board
let queenIndices = new Set();

function getNextQueenIndex() {
  for (let i = 1; i <= 8; i++) {
    if (!queenIndices.has(i)) {
      queenIndices.add(i);
      return i;
    }
  }
  return -1;
}

function removeQueenIndex(index) {
  queenIndices.delete(index);
}

function getSquare(x, y) {
  return squares && squares[x][y];
}

function getLinkedSquares(x, y) {
  let linked = [];

  // Rank
  for (let j = 0; j < 8; j++) {
    linked.push(getSquare(x, j));
  }

  // File
  for (let i = 0; i < 8; i++) {
    if (i != x) linked.push(getSquare(i, y));
  }

  // Diagonals
  for (let dist = 1; dist < 8; dist++) {
    if (isWithinBounds(x - dist, y - dist)) linked.push(getSquare(x - dist, y - dist));
    if (isWithinBounds(x - dist, y + dist)) linked.push(getSquare(x - dist, y + dist));
    if (isWithinBounds(x + dist, y - dist)) linked.push(getSquare(x + dist, y - dist));
    if (isWithinBounds(x + dist, y + dist)) linked.push(getSquare(x + dist, y + dist));
  }

  return linked.filter(sq => sq !== undefined);
}

function isWithinBounds(x, y) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

function hasQueen(x, y) {
  return getSquare(x, y).classList.contains("queen");
}

function hasQueenPressure(x, y) {
  let sqs = getLinkedSquares(x, y);
  for (let sq of sqs) {
    if (sq.classList.contains("queen")) return true;
  }
  return false;
}

function addQueenPressureSquare(square) {
  square.classList.add("pressure");
}

function addQueenSquare(x, y, number) {
  let sq = getSquare(x, y);

  sq.classList.add("queen");
  sq.classList.add("queen-" + number);
  addQueenPressureSquare(sq);
}

function addQueen(x, y) {
  let qind = getNextQueenIndex();
  addQueenSquare(x, y, qind);

  if (queenIndices.size === 1) {
    startTimer(); // Start timer when the first queen is placed
  }

  let affectedSquares = getLinkedSquares(x, y);
  for (let sq of affectedSquares) {
    addQueenPressureSquare(sq);
  }

  if (queenIndices.size === 8) {
    stopTimer(); // Stop timer when all queens are placed
    setTimeout(() => {
      alert("Congratulations! You've solved the puzzle!");
      resetGame();
    }, 500); // Show alert after a short delay
  }
}

function tryRemoveQueenPressure(x, y) {
  if (hasQueenPressure(x, y)) return;
  getSquare(x, y).classList.remove("pressure");
}

function removeQueenSquare(x, y) {
  let queenSquare = getSquare(x, y);
  queenSquare.classList.remove("queen");

  let affectedSquares = getLinkedSquares(x, y);
  for (let sq of affectedSquares) {
    let sx = parseInt(sq.getAttribute("x")),
      sy = parseInt(sq.getAttribute("y"));
    tryRemoveQueenPressure(sx, sy);
  }

  for (let cn of queenClassNames) {
    if (queenSquare.classList.contains(cn)) {
      queenSquare.classList.remove(cn);
      return cn.split("-")[1];
    }
  }
}

function removeQueen(x, y) {
  let qind = parseInt(removeQueenSquare(x, y));
  removeQueenIndex(qind);
  let affectedSquares = getLinkedSquares(x, y);
  for (let sq of affectedSquares) {
    removeQueenSquare(x, y);
  }
}

function onSquareClick(x, y) {
  if (hasQueen(x, y)) {
    removeQueen(x, y);
    return;
  }

  if (hasQueenPressure(x, y)) return;
  addQueen(x, y);
}
