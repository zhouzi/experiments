/* @flow */

type Direction = 'top' | 'right' | 'bottom' | 'left';
type Point = [number, number];
type Axis = 'x' | 'y';

type Game = {
  direction: Direction,
  snake: Array<Point>,
  width: number,
  height: number,
};

function createGame(props: Object = {}): Game {
  return Object.assign({}, {
    direction: 'right',
    snake: [
      [0, 0],
    ],
    width: 10,
    height: 10,
  }, props);
}

function last(arr: Array<any>): any {
  return arr[arr.length - 1];
}

function incrementBuilder(dir: Direction): Function {
  return (increment: Direction, decrement: Direction): number => {
    if (dir === increment) {
      return 1;
    }

    if (dir === decrement) {
      return -1;
    }

    return 0;
  };
}

function getIncrementer(dir: Direction): Function {
  const incrementer = incrementBuilder(dir);

  return (axis: Axis): number => (
    axis === 'x'
      ? incrementer('right', 'left')
      : incrementer('bottom', 'top')
  );
}

function tail(arr: Array<any>): any {
  return arr.slice(1);
}

function rangify(value: number, min: number, max: number): number {
  if (value > max) {
    return 0;
  }

  if (value < min) {
    return max;
  }

  return value;
}

function createPoint(dir: Direction): Point {
  const incrementer = getIncrementer(dir);
  return [
    incrementer('x'),
    incrementer('y'),
  ];
}

function createPointInRange(x: number, y: number, game: Game): Point {
  return [
    rangify(x, 0, game.width),
    rangify(y, 0, game.height),
  ];
}

function tick(game: Game): Game {
  const lastPoint = last(game.snake);
  const [x, y] = createPoint(game.direction);
  const newLastPoint = createPointInRange(
    lastPoint[0] + x,
    lastPoint[1] + y,
    game,
  );
  const rest = tail(game.snake);

  return Object.assign({}, game, {
    snake: rest.concat([
      newLastPoint,
    ]),
  });
}

function direction(game: Game, dir: Direction): Game {
  return Object.assign({}, game, {
    direction: dir,
  });
}

function head(arr: Array<any>): any {
  return arr[0];
}

function grow(game: Game): Game {
  const firstPoint = head(game.snake);
  const [x, y] = createPoint(game.direction);
  const newFirstPoint = createPointInRange(
    firstPoint[0] - x,
    firstPoint[1] - y,
    game,
  );

  return Object.assign({}, game, {
    snake: [
      newFirstPoint,
    ].concat(game.snake),
  });
}

module.exports = {
  createGame,
  tick,
  direction,
  grow,
};
