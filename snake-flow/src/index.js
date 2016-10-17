// @flow

type Point = [number, number];
type Coords = Point[];
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Game = {
  status: string,
  food: Point,
  bounds: Point,
  direction: Direction,
  snake: Coords,
};

function updateGame(game: Game, props: Object): Game {
  return Object.assign({}, game, props);
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function arePointsEqual(p1: Point, p2: Point): boolean {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return x1 === x2 && y1 === y2;
}

function notSnake(snake: Coords, point: Point): boolean {
  return !snake.some(snakePoint => arePointsEqual(point, snakePoint));
}

function getFreePoints(game: Game): Coords {
  const result = [];
  for (let x = 0; x <= game.bounds[0]; x += 1) {
    for (let y = 0; y <= game.bounds[1]; y += 1) {
      const point = [x, y];
      if (notSnake(game.snake, point)) {
        result.push([x, y]);
      }
    }
  }

  return result;
}

function spawnFood(game: Game): Game {
  const freePoints = getFreePoints(game);
  const randomIndex = random(0, freePoints.length - 1);
  const randomFreePoint = freePoints[randomIndex];
  return updateGame(game, {
    food: randomFreePoint,
  });
}

module.exports.createGame = function createGame(): Game {
  return spawnFood({
    status: 'playing',
    food: [0, 0],
    bounds: [9, 9],
    direction: 'right',
    snake: [
      [0, 0],
    ],
  });
};

function applyOrientedMove(dir: Direction): Function {
  return (pos: number, map: Object): number => (
    map[dir]
      ? pos + map[dir]
      : pos
  );
}

function withinBounds(pos: number, min: number, max: number): number {
  if (pos < min) {
    return max;
  }

  if (pos > max) {
    return min;
  }

  return pos;
}

function applyMove(game: Game): Coords {
  const snakeHead = game.snake[game.snake.length - 1];
  const [x, y] = snakeHead;
  const orientedMove = applyOrientedMove(game.direction);
  const [minX, maxX] = [0, game.bounds[0]];
  const [minY, maxY] = [0, game.bounds[1]];
  const newSnakeHead = [
    withinBounds(orientedMove(x, { right: 1, left: -1 }), minX, maxX),
    withinBounds(orientedMove(y, { top: -1, bottom: 1 }), minY, maxY),
  ];

  return game.snake.slice(1).concat([
    newSnakeHead,
  ]);
}

function findPoint(coords: Coords, point: Point): number {
  for (let i = 0; i < coords.length; i += 1) {
    if (arePointsEqual(point, coords[i])) {
      return i;
    }
  }

  return -1;
}

function hasDuplicates(snake: Coords): boolean {
  return snake.some((point, index) => findPoint(snake, point) !== index);
}

module.exports.tick = function tick(game: Game): Game {
  const snake = applyMove(game);
  const snakeHead = snake[snake.length - 1];

  if (arePointsEqual(snakeHead, game.food)) {
    return spawnFood(updateGame(game, {
      snake: [
        [0, 0],
      ].concat(snake),
    }));
  }

  if (hasDuplicates(snake)) {
    return updateGame(game, {
      status: 'gameover',
      snake,
    });
  }

  return updateGame(game, {
    snake,
  });
};

module.exports.direction = function direction(game: Game, dir: Direction): Game {
  return updateGame(game, {
    direction: dir,
  });
};
