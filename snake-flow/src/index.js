// @flow

type Point = [number, number];
type Coords = Point[];
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Game = {
  status: string,
  food: Point,
  bounds: Point,
  direction: Direction,
  pendingDirection: Direction | null,
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

function createGame(): Game {
  return spawnFood({
    status: 'playing',
    food: [0, 0],
    bounds: [9, 9],
    direction: 'right',
    pendingDirection: null,
    snake: [
      [0, 0],
    ],
  });
}

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

function applyDirection(game: Game): Game {
  if (game.pendingDirection) {
    return updateGame(game, {
      direction: game.pendingDirection,
      pendingDirection: null,
    });
  }

  return game;
}

function applyMove(game: Game): Game {
  const updatedGame = applyDirection(game);
  const snakeHead = updatedGame.snake[updatedGame.snake.length - 1];
  const [x, y] = snakeHead;
  const orientedMove = applyOrientedMove(updatedGame.direction);
  const [minX, maxX] = [0, updatedGame.bounds[0]];
  const [minY, maxY] = [0, updatedGame.bounds[1]];
  const newSnakeHead = [
    withinBounds(orientedMove(x, { right: 1, left: -1 }), minX, maxX),
    withinBounds(orientedMove(y, { top: -1, bottom: 1 }), minY, maxY),
  ];

  return updateGame(updatedGame, {
    snake: game.snake.slice(1).concat([
      newSnakeHead,
    ]),
  });
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

function tick(game: Game): Game {
  const updatedGame = applyMove(game);
  const snake = updatedGame.snake;
  const snakeHead = snake[snake.length - 1];

  if (arePointsEqual(snakeHead, updatedGame.food)) {
    return spawnFood(updateGame(updatedGame, {
      snake: [
        [0, 0],
      ].concat(snake),
    }));
  }

  if (hasDuplicates(snake)) {
    return updateGame(updatedGame, {
      status: 'gameover',
      snake,
    });
  }

  return updateGame(updatedGame, {
    snake,
  });
}

function willHalfTurn(game: Game, dir: Direction): boolean {
  if ((game.direction === 'right' || game.direction === 'left') && (dir === 'right' || dir === 'left')) {
    return true;
  }

  if ((game.direction === 'top' || game.direction === 'bottom') && (dir === 'top' || dir === 'bottom')) {
    return true;
  }

  return false;
}

function direction(game: Game, dir: Direction): Game {
  if (willHalfTurn(game, dir)) {
    return game;
  }

  return updateGame(game, {
    pendingDirection: dir,
  });
}

module.exports = {
  createGame,
  tick,
  direction,
};
