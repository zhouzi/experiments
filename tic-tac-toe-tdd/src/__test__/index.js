const test = require('tape');
const Game = require('../');

test('Game()', (assert) => {
  assert.same(
    typeof Game(),
    'object',
    'should create a new game object'
  );

  assert.same(
    Game().grid,
    [
      ['_', '_', '_'],
      ['_', '_', '_'],
      ['_', '_', '_']
    ],
    'should create a grid'
  );

  assert.end();
});

test('Game.check()', (assert) => {
  assert.same(
    Game.check(Game(), 0, 1).grid,
    [
      ['_', 'x', '_'],
      ['_', '_', '_'],
      ['_', '_', '_']
    ],
    'should check target cell'
  );

  assert.same(
    Game.check(Game.check(Game(), 0, 1), 0, 0).grid,
    [
      ['o', 'x', '_'],
      ['_', '_', '_'],
      ['_', '_', '_']
    ],
    'should check target cell for the other player'
  );

  assert.same(
    Game.check(Game.check(Game(), 0, 1), 0, 1),
    Game.check(Game(), 0, 1),
    'should not check twice the same cell'
  );

  assert.same(
    Game.check(Game(), 6, 6),
    Game(),
    'should not check invalid coordinates'
  );

  assert.end();
});
