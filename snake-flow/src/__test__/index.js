const test = require('ava');
const { createGame, tick, direction } = require('../');

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

test('it should have a default direction of "right"', (assert) => {
  const actual = createGame().direction;
  const expected = 'right';
  assert.is(actual, expected);
});

test('it should set direction to bottom', (assert) => {
  const actual = direction(createGame(), 'bottom').direction;
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

test('it should have some bounds', (assert) => {
  const actual = createGame().bounds;
  const expected = [9, 9];
  assert.deepEqual(actual, expected);
});

test('it should not move the snake out of the bounds on the y axis', (assert) => {
  const actual = tick(direction(createGame(), 'top')).snake;
  const expected = [
    [0, 9],
  ];
  assert.deepEqual(actual, expected);
});

test('it should not move the snake out of the bounds on the x axis', (assert) => {
  const actual = tick(direction(createGame(), 'left')).snake;
  const expected = [
    [9, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should place food', (assert) => {
  const [x, y] = createGame().food;

  assert.is(typeof x, 'number');
  assert.is(x >= 0, true);
  assert.is(x <= 9, true);

  assert.is(typeof y, 'number');
  assert.is(y >= 0, true);
  assert.is(y <= 9, true);
});

test('it should randomly place food', (assert) => {
  const [x1, y1] = createGame().food;
  for (let i = 0; i < 10; i += 1) {
    const [x2, y2] = createGame().food;
    if (x2 !== x1 || y2 !== y1) {
      assert.pass('10 calls did not produce the same results');
      return;
    }
  }
  assert.fail('10 calls produced the same result');
});

test('it should grow the snake when eating food', (assert) => {
  const game = createGame();
  game.food = [1, 0];
  const actual = tick(game).snake;
  const expected = [
    [0, 0],
    [1, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should spawn some food elsewhere when eating one', (assert) => {
  const game = createGame();
  const food = [1, 0];
  game.food = food;
  const actual = tick(game).food;
  assert.notDeepEqual(actual, food);
});

test('it should move a bigger snake', (assert) => {
  const game = createGame();
  game.snake = [
    [0, 0],
    [1, 0],
  ];
  const actual = tick(game).snake;
  const expected = [
    [1, 0],
    [2, 0],
  ];
  assert.deepEqual(actual, expected);
});

test('it should move some even bigger snake', (assert) => {
  const game = createGame();
  game.snake = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ];
  game.direction = 'bottom';
  game.food = [9, 9];// prevent accidentaly eating food
  const actual = tick(game).snake;
  const expected = [
    [1, 0],
    [2, 0],
    [3, 0],
    [3, 1],
  ];
  assert.deepEqual(actual, expected);
});

test('it should grow a big snake when eating food', (assert) => {
  const game = createGame();
  game.snake = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ];
  game.direction = 'bottom';
  game.food = [3, 1];
  const actual = tick(game).snake;
  const expected = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [3, 1],
  ];
  assert.deepEqual(actual, expected);
});

test('it should not place food over the snake', (assert) => {
  for (let i = 0; i < 100; i += 1) {
    const game = createGame();
    game.snake = [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [9, 1],
      [8, 1],
      [7, 1],
      [6, 1],
      [5, 1],
      [4, 1],
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
    ];
    game.food = [0, 2];
    game.direction = 'bottom';
    const actual = tick(game).food;
    const y = actual[1];
    assert.not(y, 0);
    assert.not(y, 1);
    assert.notDeepEqual(actual.food, [0, 2]);
  }
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
  ];
  game.direction = 'top';
  const actual = tick(game).status;
  const expected = 'gameover';
  assert.is(actual, expected);
});
