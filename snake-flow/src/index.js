/* @flow */

type Direction = 'top' | 'right' | 'bottom' | 'left';
type Point = [number, number];
type Coords = Point[];
type Game = {
  direction: Direction,
  bounds: Point,
  snake: Coords,
  food: Coords
};

function random(min: number, max: number): number {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function placeFood(game: Game): Game {
  const [maxX, maxY] = game.bounds;

  return Object.assign({}, game, {
    food: game.food.concat([
      [random(0, maxX), random(0, maxY)],
    ]),
  });
}

function createGame(): Game {
  return placeFood({
    direction: 'right',
    bounds: [10, 10],
    snake: [
      [0, 0],
    ],
    food: [],
  });
}

function withinBounds(n: number, min: number, max: number): number {
  if (n > max) {
    return min;
  }

  if (n < min) {
    return max;
  }

  return n;
}

function createPointWithinBounds(point: Point, bounds: Point): Point {
  const [x, y] = point;
  const [maxX, maxY] = bounds;

  return [
    withinBounds(x, 0, maxX),
    withinBounds(y, 0, maxY),
  ];
}

function movePoint(previousPoint: Point, dir: Direction, bounds: Point, factor: number): Point {
  const [x, y] = previousPoint;
  const point = (() => {
    const forward = factor * 1;
    const backward = factor * -1;

    if (dir === 'top') {
      return [x, y + backward];
    }

    if (dir === 'right') {
      return [x + forward, y];
    }

    if (dir === 'bottom') {
      return [x, y + forward];
    }

    if (dir === 'left') {
      return [x - backward, y];
    }

    throw new Error(`unknown direction "${dir}"`);
  })();
  return createPointWithinBounds(point, bounds);
}

function grow(game: Game): Game {
  const lastPoint = game.snake[game.snake.length - 1];
  const point = movePoint(lastPoint, game.direction, game.bounds, -1);

  return Object.assign({}, game, {
    snake: game.snake.concat([point]),
  });
}

function tick(game: Game): Game {
  const head = game.snake[0];
  const tail = game.snake.slice(0, -1);
  const point = movePoint(head, game.direction, game.bounds, 1);
  const snake = [point].concat(tail);
  const resultingGame = Object.assign({}, game, {
    snake,
  });

  // Not really elegant and won't work
  // if there's more than one food item
  if (resultingGame.food[0][0] === point[0] && resultingGame.food[0][1] === point[1]) {
    return placeFood(grow(Object.assign({}, resultingGame, {
      food: [],
    })));
  }

  return resultingGame;
}

function direction(game: Game, dir: Direction): Game {
  return Object.assign({}, game, {
    direction: dir,
  });
}

module.exports = {
  createGame,
  tick,
  direction,
  grow,
};
