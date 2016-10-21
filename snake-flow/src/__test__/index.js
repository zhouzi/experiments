const test = require('ava');
const { createGame, tick, direction } = require('../');

test('it should spawn a snake', (assert) => {
  const actual = createGame().snake;
  const expected = [
    [0, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should have a default direction of "right"', (assert) => {
  const actual = createGame().direction;
  const expected = 'right';
  assert.is(actual, expected);
});

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

test('it should change the snake direction', (assert) => {
  const actual = tick(direction(createGame(), 'bottom')).direction;
  const expected = 'bottom';
  assert.is(actual, expected);
});

test('it should not be able to make a half turn', (assert) => {
  const actual = tick(direction(createGame(), 'left')).direction;
  const expected = 'right';
  assert.is(actual, expected);
});

test('it should not be able to make a half turn after successive moves', (assert) => {
  const actual = tick(direction(direction(createGame(), 'bottom'), 'left')).direction;
  const expected = 'bottom';
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

test('it should not move the snake out of bounds', (assert) => {
  const game = createGame();
  game.snake = [
    [game.bounds[0] - 1, 0],
  ];
  const actual = tick(game).snake;
  const expected = [
    [0, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should randomly spawn food within bounds', (assert) => {
  const results = [];
  for (let i = 0; i < 1000; i += 1) {
    const game = createGame();
    const [x, y] = game.food;
    const [width, height] = game.bounds;

    if (x >= width || x < 0 || y >= height || y < 0) {
      assert.fail('food is out of bounds');
      return;
    }

    const name = `${x},${y}`;
    if (results.indexOf(name) < 0) {
      results.push(name);
    }
  }

  if (results.length < 2) {
    assert.fail('food is not randomly spawned');
    return;
  }

  assert.pass('food is within bounds');
});

test('it should not spawn food over the snake', (assert) => {
  for (let i = 0; i < 1000; i += 1) {
    const game = createGame();
    const [foodX, foodY] = game.food;

    if (game.snake.some(([x, y]) => x === foodX && y === foodY)) {
      assert.fail('food spawned over snake');
      return;
    }
  }

  assert.pass('food not spawned over snake');
});

test('the snake should grow when eating food', (assert) => {
  const game = createGame();
  game.food = [1, 0];
  const actual = tick(tick(game)).snake;
  const expected = [
    [1, 0],
    [2, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should have a default status of "playing"', (assert) => {
  const actual = createGame().status;
  const expected = 'playing';
  assert.is(actual, expected);
});

test('it should update the status to gameover when the snake eats itself', (assert) => {
  const game = createGame();
  game.snake = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
  ];
  game.direction = 'top';
  const actual = tick(game).status;
  const expected = 'gameover';
  assert.is(actual, expected);
});

test('it should not update game when status is gameover', (assert) => {
  const game = createGame();
  game.status = 'gameover';
  const actual = tick(game);
  const expected = game;
  assert.is(actual, expected);
});

test('it should set custom bounds', (assert) => {
  const bounds = [10, 10];
  const actual = createGame(bounds).bounds;
  const expected = bounds;
  assert.deepEqual(actual, expected);
});
