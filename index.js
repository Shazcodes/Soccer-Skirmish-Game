const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "./assets/player.jpg";

const ballImg = new Image();
ballImg.src = "./assets/ball.png";

const explosionImg = new Image();
explosionImg.src = "./assets/explosion.jpg";

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 13,
  isExploding: false,
};

const balls = [];
let startTime = Date.now();
let isGameOver = false;
let ballSpeed = 1;

// Difficulty buttons
const easyButton = document.getElementById("easyButton");
const mediumButton = document.getElementById("mediumButton");
const hardButton = document.getElementById("hardButton");
const startButton = document.getElementById("startButton");

easyButton.addEventListener("click", () => {
  ballSpeed = 1; // Adjust speed for easy difficulty
  startButton.style.display = "block"; // Show "Start Game" button
});

mediumButton.addEventListener("click", () => {
  ballSpeed = 2; // Adjust speed for medium difficulty
  startButton.style.display = "block"; // Show "Start Game" button
});

hardButton.addEventListener("click", () => {
  ballSpeed = 3; // Adjust speed for hard difficulty
  startButton.style.display = "block"; // Show "Start Game" button
});

startButton.addEventListener("click", () => {
  startGame(); // Start the game when "Start Game" button is clicked
  hideDifficultyButtons(); // Hide difficulty buttons
});

function hideTitle() {
  const title = document.getElementById("title");
  title.style.display = "none";
}

function hideDifficultyButtons() {
  easyButton.style.display = "none";
  mediumButton.style.display = "none";
  hardButton.style.display = "none";
}

function startGame() {
  startTime = Date.now(); // Reset start time
  isGameOver = false; // Reset game over flag
  player.isExploding = false; // Reset player explosion flag
  balls.length = 0; // Clear balls array
  startButton.style.display = "none"; // Hide "Start Game" button
  setInterval(createBall, 150); // Continuously create balls
  update(); // Start the game loop
}

function drawScore() {
  const currentTime = Date.now();
  const timeElapsed = Math.floor((currentTime - startTime) / 1000);

  ctx.font = "20px Times new roman";
  ctx.fillStyle = "black";
  ctx.fillText("Time: " + timeElapsed + "sec", 10, canvas.height - 10);

  if (isGameOver) {
    ctx.font = "30px Roberto";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2);
  }
}

function createBall() {
  const x = Math.random() * canvas.width;
  const y = 0;
  const angle = Math.atan2(player.y - y, player.x - x);

  const ball = {
    x,
    y,
    radius: 5,
    color: "red",
    velocityX: Math.cos(angle) * ballSpeed, // Adjust ball speed based on difficulty
    velocityY: Math.sin(angle) * ballSpeed,
  };
  balls.push(ball);
}

function moveBall() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.x < 0 || ball.x > canvas.width || ball.y < 0 || ball.y > canvas.height) {
      balls.splice(i, 1);
      i--;
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    const distance = Math.sqrt((player.x - ball.x) ** 2 + (player.y - ball.y) ** 2);
    if (distance < player.radius + ball.radius && !player.isExploding) {
      player.isExploding = true;
      balls.length = 0; // Clear balls array
      setTimeout(() => {
        isGameOver = true;
      }, 1000);
      break;
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  if (!isGameOver) {
    clearCanvas();
    if (!player.isExploding) {
      drawPlayer();
    } else {
      drawExplosion();
      isGameOver = true;
    }
    drawBalls();
    drawScore();
    moveBall();
    checkCollisions();
    requestAnimationFrame(update);
  }
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x - player.radius, player.y - player.radius, player.radius * 4, player.radius * 4);
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
  }
}

function drawExplosion() {
  ctx.drawImage(explosionImg, player.x - player.radius * 4, player.y - player.radius * 4, player.radius * 8, player.radius * 8);
}

document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  player.x = Math.min(Math.max(mouseX, player.radius), canvas.width - player.radius);
  player.y = Math.min(Math.max(mouseY, player.radius), canvas.height - player.radius);
});