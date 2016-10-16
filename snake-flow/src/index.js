// @flow

type Point = [number, number];
type Coords = Point[];
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Game = {
  food: Point,
  bounds: Point,
  direction: Direction,
  snake: Coords,
};

function random(min: number, max: number): number {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

module.exports.createGame = function createGame(): Game {
  const maxX = 9;
  const maxY = 9;

  return {
    food: [random(0, maxX), random(0, maxY)],
    bounds: [maxX, maxY],
    direction: 'right',
    snake: [
      [0, 0],
    ],
  };
};

function updateGame(game: Game, props: Object): Game {
  return Object.assign({}, game, props);
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

function applyMove(game: Game): Coords {
  const [x, y] = game.snake[0];
  const orientedMove = applyOrientedMove(game.direction);
  const [minX, maxX] = [0, game.bounds[0]];
  const [minY, maxY] = [0, game.bounds[1]];

  return [
    [
      withinBounds(orientedMove(x, { right: 1, left: -1 }), minX, maxX),
      withinBounds(orientedMove(y, { top: -1, bottom: 1 }), minY, maxY),
    ],
  ];
}

module.exports.tick = function tick(game: Game): Game {
  return updateGame(game, {
    snake: applyMove(game),
  });
};

module.exports.direction = function direction(game: Game, dir: Direction): Game {
  return updateGame(game, {
    direction: dir,
  });
};
