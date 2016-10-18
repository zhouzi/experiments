/* global window */

const { createGame, tick, direction } = require('./');

const SCALE_RATIO = 10;

function createCanvas(game) {
  const canvas = window.document.createElement('canvas');
  const [width, height] = game.bounds;
  const canvasWidth = (width + 1) * SCALE_RATIO;
  const canvasHeight = (height + 1) * SCALE_RATIO;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  return canvas;
}

function clear(canvas) {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function drawRect(canvas, [x, y]) {
  const context = canvas.getContext('2d');
  context.beginPath();

  context.rect(
    x * SCALE_RATIO,
    y * SCALE_RATIO,
    SCALE_RATIO,
    SCALE_RATIO
  );

  context.fillStyle = '#000';
  context.fill();
  context.closePath();
}

function draw(canvas, game) {
  clear(canvas);
  game.snake.forEach(point => drawRect(clear(canvas), point));
  return canvas;
}

module.exports.startGame = function startGame() {
  let game = createGame();
  const canvas = createCanvas(game);

  window.document.body.appendChild(canvas);
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 38) {
      game = direction(game, 'top');
    }

    if (event.keyCode === 39) {
      game = direction(game, 'right');
    }

    if (event.keyCode === 40) {
      game = direction(game, 'bottom');
    }

    if (event.keyCode === 37) {
      game = direction(game, 'left');
    }
  });

  let last = 0;
  let diff = 0;

  (function loop() {
    const now = Date.now();
    diff += (now - last) / 1000;
    last = now;

    if (diff >= 1) {
      draw(canvas, game);
      game = tick(game);
      diff = 0;
    }

    window.requestAnimationFrame(loop);
  }());
};
