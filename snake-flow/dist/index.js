function createGame(props = {}) {
  return Object.assign({}, {
    direction: 'right',
    snake: [[0, 0]],
    width: 10,
    height: 10
  }, props);
}

function last(arr) {
  return arr[arr.length - 1];
}

function incrementBuilder(dir) {
  return (increment, decrement) => {
    if (dir === increment) {
      return 1;
    }

    if (dir === decrement) {
      return -1;
    }

    return 0;
  };
}

function getIncrementer(dir) {
  const incrementer = incrementBuilder(dir);

  return axis => axis === 'x' ? incrementer('right', 'left') : incrementer('bottom', 'top');
}

function tail(arr) {
  return arr.slice(1);
}

function rangify(value, min, max) {
  if (value > max) {
    return 0;
  }

  if (value < min) {
    return max;
  }

  return value;
}

function createPoint(dir) {
  const incrementer = getIncrementer(dir);
  return [incrementer('x'), incrementer('y')];
}

function createPointInRange(x, y, game) {
  return [rangify(x, 0, game.width), rangify(y, 0, game.height)];
}

function tick(game) {
  const lastPoint = last(game.snake);
  const [x, y] = createPoint(game.direction);
  const newLastPoint = createPointInRange(lastPoint[0] + x, lastPoint[1] + y, game);
  const rest = tail(game.snake);

  return Object.assign({}, game, {
    snake: rest.concat([newLastPoint])
  });
}

function direction(game, dir) {
  return Object.assign({}, game, {
    direction: dir
  });
}

function head(arr) {
  return arr[0];
}

function grow(game) {
  const firstPoint = head(game.snake);
  const [x, y] = createPoint(game.direction);
  const newFirstPoint = createPointInRange(firstPoint[0] - x, firstPoint[1] - y, game);

  return Object.assign({}, game, {
    snake: [newFirstPoint].concat(game.snake)
  });
}

module.exports = {
  createGame,
  tick,
  direction,
  grow
};
