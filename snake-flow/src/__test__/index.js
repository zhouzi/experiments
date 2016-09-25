const test = require('ava');
const { createGame } = require('../index');

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
