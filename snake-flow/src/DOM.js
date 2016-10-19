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

function drawRect(canvas, [x, y], color) {
  const context = canvas.getContext('2d');
  context.beginPath();

  context.rect(
    x * SCALE_RATIO,
    y * SCALE_RATIO,
    SCALE_RATIO,
    SCALE_RATIO
  );

  context.fillStyle = color;
  context.fill();
  context.closePath();
}

function draw(canvas, game) {
  clear(canvas);

  game.snake.forEach(point => drawRect(canvas, point, 'black'));
  drawRect(canvas, game.food, 'red');

  return canvas;
}

function loop(callback, interval) {
  let lastCallTime = 0;
  let lastPaintInterval = 0;

  (function fn() {
    const now = Date.now();
    lastPaintInterval += now - lastCallTime;
    lastCallTime = now;

    if (lastPaintInterval >= interval) {
      const shouldContinue = callback();
      lastPaintInterval = 0;

      if (shouldContinue === false) {
        return;
      }
    }

    window.requestAnimationFrame(fn);
  }());
}

module.exports.startGame = function startGame() {
  let game = createGame();
  const canvas = createCanvas(game);

  window.document.body.appendChild(canvas);

  const [TOP, RIGHT, BOTTOM, LEFT] = [38, 39, 40, 37];
  const directions = {
    [TOP]: 'top',
    [RIGHT]: 'right',
    [BOTTOM]: 'bottom',
    [LEFT]: 'left',
  };
  window.addEventListener('keydown', (event) => {
    const dir = directions[event.keyCode];
    if (dir) {
      event.preventDefault();
      game = direction(game, dir);
    }
  });

  loop(() => {
    game = tick(game);
    if (game.status === 'gameover') {
      return false;
    }

    draw(canvas, game);
    return true;
  }, 200);
};
