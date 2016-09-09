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
      ['_', '_', '_'],
      ['x', '_', '_'],
      ['_', '_', '_']
    ],
    'should check target cell'
  );

  assert.same(
    Game.check(Game(), 1, 2).grid,
    [
      ['_', '_', '_'],
      ['_', '_', '_'],
      ['_', 'x', '_']
    ],
    'should check target cell'
  );

  assert.same(
    Game.check(Game.check(Game(), 0, 1), 0, 0).grid,
    [
      ['o', '_', '_'],
      ['x', '_', '_'],
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

test('Game.winner()', (assert) => {
  assert.same(
    Game.winner(Game()),
    '_',
    'should not return a winner'
  );

  assert.same(
    Game.winner({
      grid: [
        ['x', 'x', 'x'],
        ['o', '_', '_'],
        ['o', '_', '_']
      ]
    }),
    'x',
    'should return x as horizontal winner'
  );

  assert.same(
    Game.winner({
      grid: [
        ['x', '_', '_'],
        ['o', 'o', 'o'],
        ['x', '_', '_']
      ]
    }),
    'o',
    'should return o as horizontal winner'
  );

  assert.same(
    Game.winner({
      grid: [
        ['x', '_', 'o'],
        ['x', '_', 'o'],
        ['x', '_', '_']
      ]
    }),
    'x',
    'should return x as vertical winner'
  );

  assert.same(
    Game.winner({
      grid: [
        ['o', '_', '_'],
        ['x', 'o', '_'],
        ['x', '_', 'o']
      ]
    }),
    'o',
    'should return o as diagonal winner'
  );

  assert.same(
    Game.winner({
      grid: [
        ['o', '_', 'x'],
        ['_', 'x', '_'],
        ['x', '_', 'o']
      ]
    }),
    'x',
    'should return x as diagonal winner'
  );

  assert.end();
});
