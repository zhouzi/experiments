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

test.todo('it should not place food over the snake');
test.todo('it should grow the snake when eating food');
test.todo('it should place food somewhere else when eaten');
test.todo('it should move a big snake');
