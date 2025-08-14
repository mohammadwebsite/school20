const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let girlX = 50;
let girlY = 200;
let speed = 3;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // رسم دختر (در اینجا فقط از بک‌گراند استفاده شده)
  girlX += speed;
  if (girlX > canvas.width - 50 || girlX < 0) speed *= -1;
  requestAnimationFrame(gameLoop);
}

gameLoop();
```javascript
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let player = { x: 50, y: 200, width: 40, height: 40, dy: 0, jumping: false };
let gravity = 0.6;
let obstacles = [];
let frame = 0;
let score = 0;
let hiscore = 0;
let gameSpeed = 6;

function drawPlayer() {
  ctx.fillStyle = '#ff3e7f';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = '#444';
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });
}

function updatePlayer() {
  player.y += player.dy;
  if (player.y + player.height < canvas.height) {
    player.dy += gravity;
  } else {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.jumping = false;
  }
}

function spawnObstacle() {
  const size = Math.random() * (40 - 20) + 20;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size,
    width: size,
    height: size
  });
}

function updateObstacles() {
  obstacles.forEach(o => o.x -= gameSpeed);
  obstacles = obstacles.filter(o => o.x + o.width > 0);
}

function detectCollision() {
  obstacles.forEach(o => {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      resetGame();
    }
  });
}

function resetGame() {
  hiscore = Math.max(hiscore, score);
  score = 0;
  obstacles = [];
  player.x = 50;
  player.y = 200;
  player.dy = 0;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frame++;
  if (frame % 90 === 0) {
    spawnObstacle();
  }

  updatePlayer();
  updateObstacles();
  detectCollision();

  drawPlayer();
  drawObstacles();

  score++;
  document.getElementById('score').textContent = score;
  document.getElementById('hiscore').textContent = hiscore;

  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && !player.jumping) {
    player.dy = -12;
    player.jumping = true;
  }
});

loop();
```

