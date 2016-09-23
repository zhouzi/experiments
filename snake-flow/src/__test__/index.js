const test = require('ava');
const { createGame, tick, direction, grow } = require('../index');

test('it should move the snake to the right', (assert) => {
  const actual = tick(createGame()).snake;
  const expected = [
    [1, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should move the snake further to the right', (assert) => {
  const actual = tick(tick(createGame())).snake;
  const expected = [
    [2, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should update direction to bottom', (assert) => {
  const actual = direction(createGame(), 'bottom').direction;
  const expected = 'bottom';
  assert.is(actual, expected);
});

test('it should update direction to the top', (assert) => {
  const actual = direction(createGame(), 'top').direction;
  const expected = 'top';
  assert.is(actual, expected);
});

test('it should move the snake to the bottom', (assert) => {
  const actual = tick(direction(createGame(), 'bottom')).snake;
  const expected = [
    [0, 1],
  ];
  assert.deepEqual(actual, expected);
});

test('it should move the snake further to the bottom', (assert) => {
  const actual = tick(tick(direction(createGame(), 'bottom'))).snake;
  const expected = [
    [0, 2],
  ];
  assert.deepEqual(actual, expected);
});

test('it should restrict moves to the area', (assert) => {
  const game = createGame({
    snake: [
      [10, 0],
    ],
  });
  const actual = tick(game).snake;
  const expected = [
    [0, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should grow the snake', (assert) => {
  const actual = grow(createGame()).snake;
  const expected = [
    [10, 0],
    [0, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should grow a bigger snake', (assert) => {
  const game = createGame({
    snake: [
      [1, 0],
      [2, 0],
      [2, 1],
    ],
  });
  const actual = grow(game).snake;
  const expected = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
  ];
  assert.deepEqual(actual, expected);
});
