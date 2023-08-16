// Elements
const canvas = document.getElementById("game");
const game = canvas.getContext("2d");

const btnUp = document.getElementById("up");
const btnDown = document.getElementById("down");
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");
const UILives = document.getElementById("lives");
const UITime = document.getElementById("time");
const UIRecord = document.getElementById("record");

// Variables
const mapSize = 10;
const maxLives = 3;

let canvasSize, elementSize;
let acMap = 0;
let lives = maxLives;
let running = false;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const winPosition = {
  x: undefined,
  y: undefined,
};

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  canvasSize =
    window.innerHeight > window.innerWidth
      ? window.innerWidth * 0.8
      : window.innerHeight * 0.74;
  elementSize = canvasSize / 10;

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  startGame();
}

function startGame() {
  game.font = `${elementSize}px 'Poppins'`;
  game.textAlign = "right";
  game.textBaseLine = "top";

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(renderTime, 100);
  }

  render();
}

function renderMap() {
  const map = maps[acMap];

  if (!map) {
    gameWin();
    return;
  }
  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  game.clearRect(0, 0, canvas.width, canvas.height);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const x = colI + 1;
      const y = rowI + 1;

      if (col == "O" && playerPosition.x == undefined) {
        playerPosition.x = x;
        playerPosition.y = y;
      } else if (col == "I") {
        winPosition.x = x;
        winPosition.y = y;
      } else if (col == "X") {
        checkCollision(x, y);
      }

      game.fillText(emoji, x * elementSize, y * elementSize);
    });
  });

  renderPlayer();
}

function renderPlayer() {
  if (playerPosition.x > mapSize) {
    playerPosition.x = mapSize;
  } else if (playerPosition.x < 1) {
    playerPosition.x = 1;
  } else if (playerPosition.y > mapSize) {
    playerPosition.y = mapSize;
  } else if (playerPosition.y < 1) {
    playerPosition.y = 1;
  }

  game.fillText(
    emojis["PLAYER"],
    playerPosition.x * elementSize,
    playerPosition.y * elementSize
  );

  if (playerPosition.x == winPosition.x && playerPosition.y == winPosition.y) {
    acMap += 1;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    renderMap();
  }
}

function renderUI() {
  renderLives();
  renderTime();
}

function renderLives() {
  UILives.innerHTML = "Vidas: ";
  for (let live = 0; live < lives; live++) {
    UILives.innerHTML += `<span class="live">${emojis.HEART}</span>`;
  }
}

function renderTime() {
  UITime.innerHTML = `Tiempo: ${Date.now() - timeStart}`;
  UIRecord.innerHTML = `Record: ${localStorage.getItem("timeRecord")}`
}


function render() {
  renderMap();
  renderPlayer();
  renderUI();
}


function gameWin() {
  if (!localStorage.getItem("timeRecord")) {
    localStorage.setItem("timeRecord", Date.now() - timeStart);
  } else {
    localStorage.setItem(
      "timeRecord",
      Date.now() - timeStart < localStorage.getItem("timeRecord")
        ? Date.now() - timeStart
        : localStorage.getItem("timeRecord")
    );
  }

  clearInterval(timeInterval);
  renderUI();
}

function playerCollision() {
  lives--;

  if (lives <= 0) {
    acMap = 0;
    lives = maxLives;
    clearInterval(timeInterval);
    timeStart = undefined;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
  } else {
    playerPosition.x = undefined;
    playerPosition.y = undefined;
  }
  render();
}

function checkCollision(x, y) {
  if (playerPosition.x == x && playerPosition.y == y) {
    playerCollision();
  }
}

function moveUp() {
  playerPosition.y -= 1;
  running = true;
  render();
}

function moveDown() {
  playerPosition.y += 1;
  running = true;
  render();
}

function moveLeft() {
  playerPosition.x -= 1;
  running = true;
  render();
}

function moveRight() {
  playerPosition.x += 1;
  running = true;
  render();
}

function keyBoardMove(e) {
  if (e.key == "w" || e.key == "ArrowUp") {
    moveUp();
  } else if (e.key == "s" || e.key == "ArrowDown") {
    moveDown();
  } else if (e.key == "a" || e.key == "ArrowLeft") {
    moveLeft();
  } else if (e.key == "d" || e.key == "ArrowRight") {
    moveRight();
  }
}

btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
window.addEventListener("keydown", keyBoardMove);
