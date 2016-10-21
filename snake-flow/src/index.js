// @flow

type Point = [number, number];
type Snake = Point[];
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Game = {
  snake: Snake,
  direction: Direction,
  nextDirection: Direction | null,
  bounds: Point,
  food: Point | null,
  shouldGrow: boolean,
  status: 'playing' | 'gameover',
};

function updateGame(game: Game, props: Object): Game {
  if (game.status === 'gameover') {
    return game;
  }

  return Object.assign({}, game, props);
}

function isSamePoint([x1, y1]: Point, p2: Point | null): boolean {
  if (p2 == null) {
    return false;
  }

  const [x2, y2] = p2;
  return x1 === x2 && y1 === y2;
}

function isFree(game: Game, point: Point): boolean {
  if (game.snake.some(snakePoint => isSamePoint(snakePoint, point))) {
    return false;
  }

  if (isSamePoint(point, game.food)) {
    return false;
  }

  return true;
}

function getFreePointsIn(game: Game): Point[] {
  const [width, height] = game.bounds;
  const freePoints = [];

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const point = [x, y];
      if (isFree(game, point)) {
        freePoints.push(point);
      }
    }
  }

  return freePoints;
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFreePointIn(game: Game): Point {
  const freePoints = getFreePointsIn(game);
  const randomIndex = random(0, freePoints.length);
  return freePoints[randomIndex];
}

function spawnFood(game: Game): Game {
  if (game.food) {
    return game;
  }

  return updateGame(game, {
    food: getRandomFreePointIn(game),
  });
}

function createGame(bounds: Point = [10, 10]): Game {
  return spawnFood({
    snake: [
      [0, 0],
    ],
    direction: 'right',
    nextDirection: null,
    bounds,
    food: null,
    shouldGrow: false,
    status: 'playing',
  });
}

function getSnakeHead(snake: Snake): Point {
  return snake[snake.length - 1];
}

function inRange(n: number, min: number, max: number): number {
  if (n > max) {
    return 0;
  }

  if (n < min) {
    return max;
  }

  return n;
}

function withinBounds([x, y]: Point, [width, height]: Point): Point {
  return [
    inRange(x, 0, width - 1),
    inRange(y, 0, height - 1),
  ];
}

function indexOfPoint(snake: Snake, point: Point): number {
  for (let i = 0; i < snake.length; i += 1) {
    if (isSamePoint(snake[i], point)) {
      return i;
    }
  }

  return -1;
}

function hasDuplicates(snake: Snake): boolean {
  return snake.some((point, index) => indexOfPoint(snake, point) !== index);
}

function moveSnake(game: Game): Game {
  const directionIncrements = {
    top: {
      x: 0,
      y: -1,
    },
    right: {
      x: 1,
      y: 0,
    },
    bottom: {
      x: 0,
      y: 1,
    },
    left: {
      x: -1,
      y: 0,
    },
  };
  const increments = directionIncrements[game.direction];
  const [x, y] = getSnakeHead(game.snake);
  const snake = game.snake.concat([
    withinBounds([
      x + increments.x,
      y + increments.y,
    ], game.bounds),
  ]).slice(game.shouldGrow ? 0 : 1);

  if (hasDuplicates(snake)) {
    return updateGame(game, {
      status: 'gameover',
    });
  }

  return updateGame(game, {
    snake,
  });
}

function grow(game: Game): Game {
  const snakeHead = getSnakeHead(game.snake);
  const shouldGrow = isSamePoint(snakeHead, game.food);

  return updateGame(game, {
    shouldGrow,
    food: shouldGrow ? null : game.food,
  });
}

function updateDirection(game: Game): Game {
  return updateGame(game, {
    direction: game.nextDirection || game.direction,
    nextDirection: null,
  });
}

function tick(game: Game): Game {
  return spawnFood(grow(moveSnake(updateDirection(game))));
}

function isHalfTurn(currentDir: Direction, nextDir: Direction): boolean {
  if (currentDir === 'right' && nextDir === 'left') {
    return true;
  }

  if (currentDir === 'left' && nextDir === 'right') {
    return true;
  }

  if (currentDir === 'top' && nextDir === 'bottom') {
    return true;
  }

  if (currentDir === 'bottom' && nextDir === 'top') {
    return true;
  }

  return false;
}

function direction(game: Game, dir: Direction): Game {
  if (isHalfTurn(game.direction, dir)) {
    return game;
  }

  return updateGame(game, {
    nextDirection: dir,
  });
}

module.exports = {
  createGame,
  tick,
  direction,
};
