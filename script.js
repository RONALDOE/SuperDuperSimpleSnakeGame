let blockSize = 25;
let totalRow = 17; // Número de filas en el tablero
let totalCol = 17; // Número de columnas en el tablero
let board;
let context;

let snake = { x: blockSize * 5, y: blockSize * 5 };
let speed = { x: 0, y: 0 };
let snakeBody = [];
let food = { x: 0, y: 0 };
let gameOver = false;
let score = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = totalRow * blockSize;
  board.width = totalCol * blockSize;
  context = board.getContext("2d");

  placeFood();
  document.addEventListener("keyup", changeDirection);
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);
  document.addEventListener("touchend", handleTouchEnd, false);
  
  // Cambiar passive a false para los eventos touch
  document.addEventListener("touchstart", handleTouchStart, { passive: false });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd, { passive: false });
  setInterval(gameLoop, 1000 / 10);
};

function gameLoop() {
  if (gameOver) {
    document.getElementById("game-over-container").classList.remove("hidden");
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  context.fillStyle = "green";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "yellow";
  context.fillRect(food.x, food.y, blockSize, blockSize);

  if (snake.x === food.x && snake.y === food.y) {
    snakeBody.push({ x: snake.x, y: snake.y });
    placeFood();
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = { ...snakeBody[i - 1] };
  }

  if (snakeBody.length) {
    snakeBody[0] = { x: snake.x, y: snake.y };
  }

  snake.x += speed.x * blockSize;
  snake.y += speed.y * blockSize;
  context.fillStyle = "white";
  context.fillRect(snake.x, snake.y, blockSize, blockSize);

  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i].x, snakeBody[i].y, blockSize, blockSize);
  }

  if (
    snake.x < 0 ||
    snake.x >= totalCol * blockSize ||
    snake.y < 0 ||
    snake.y >= totalRow * blockSize ||
    checkCollision()
  ) {
    gameOver = true;
  }
}

function changeDirection(e) {
  if (e.code === "ArrowUp" && speed.y !== 1) {
    speed.x = 0;
    speed.y = -1;
  } else if (e.code === "ArrowDown" && speed.y !== -1) {
    speed.x = 0;
    speed.y = 1;
  } else if (e.code === "ArrowLeft" && speed.x !== 1) {
    speed.x = -1;
    speed.y = 0;
  } else if (e.code === "ArrowRight" && speed.x !== -1) {
    speed.x = 1;
    speed.y = 0;
  }
}

// Manejo de gestos de swipe
function handleTouchStart(e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchMove(e) {
  // Evitar que la página se desplace
  e.preventDefault();
}

function handleTouchEnd(e) {
  const touch = e.changedTouches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;

  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Movimiento horizontal
    if (diffX > 0 && speed.x !== -1) {
      speed.x = 1;
      speed.y = 0;
    } else if (diffX < 0 && speed.x !== 1) {
      speed.x = -1;
      speed.y = 0;
    }
  } else {
    // Movimiento vertical
    if (diffY > 0 && speed.y !== -1) {
      speed.x = 0;
      speed.y = 1;
    } else if (diffY < 0 && speed.y !== 1) {
      speed.x = 0;
      speed.y = -1;
    }
  }
}

function placeFood() {
  food.x = Math.floor(Math.random() * totalCol) * blockSize;
  food.y = Math.floor(Math.random() * totalRow) * blockSize;
}

function checkCollision() {
  for (let i = 0; i < snakeBody.length; i++) {
    if (snake.x === snakeBody[i].x && snake.y === snakeBody[i].y) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  gameOver = false;
  score = 0;
  snake = { x: blockSize * 5, y: blockSize * 5 };
  snakeBody = [];
  speed = { x: 0, y: 0 };
  placeFood();
  document.getElementById("game-over-container").classList.add("hidden");
  document.getElementById("score").innerText = `Score: 0`;
}
