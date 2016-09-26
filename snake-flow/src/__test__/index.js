const test = require('ava');
const { createGame, tick, direction, grow } = require('../index');

test('it should create a game', (assert) => {
  const actual = createGame();
  const expected = {
    direction: 'right',
    bounds: [10, 10],
    snake: [
      [0, 0],
    ],
    food: [],
  };
  assert.deepEqual(actual, expected);
});

test('should move the snake to the right', (assert) => {
  const actual = tick(createGame()).snake;
  const expected = [
    [1, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('should move the snake further to the right', (assert) => {
  const actual = tick(tick(createGame())).snake;
  const expected = [
    [2, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('should update the direction to bottom', (assert) => {
  const actual = direction(createGame(), 'bottom').direction;
  const expected = 'bottom';
  assert.is(actual, expected);
});

test('should update the direction to top', (assert) => {
  const actual = direction(createGame(), 'top').direction;
  const expected = 'top';
  assert.is(actual, expected);
});

test('should move the snake to the bottom', (assert) => {
  const actual = tick(direction(createGame(), 'bottom')).snake;
  const expected = [
    [0, 1],
  ];
  assert.deepEqual(actual, expected);
});

test('should grow the snake', (assert) => {
  const actual = grow(createGame()).snake;
  const expected = [
    [0, 0],
    [10, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('should not move snake out of bounds', (assert) => {
  const game = createGame();
  game.snake = [
    [10, 0],
  ];
  const actual = tick(game).snake;
  const expected = [
    [0, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('should move a big snake', (assert) => {
  const compose = (...fns) => value => fns.reduce((acc, fn) => fn(acc), value);
  const actions = compose(
    grow,
    grow,
    tick,
    tick,
    game => direction(game, 'bottom'),
    tick,
  );
  const actual = actions(createGame()).snake;
  const expected = [
    [2, 1],
    [2, 0],
    [1, 0],
  ];
  assert.deepEqual(actual, expected);
});
