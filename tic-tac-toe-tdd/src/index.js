/**
 * @typedef {object} Game
 * @property {Player} player
 * @property {Array} grid
 */

/**
 * @typedef {('x'|'o')} Player
 */

/**
 * @returns {Game}
 */
const createGame = () => ({
  player: 'x',
  grid: [
    ['_', '_', '_'],
    ['_', '_', '_'],
    ['_', '_', '_']
  ]
});

/**
 * @param {Game} game
 * @param {number} x
 * @param {number} y
 * @returns {Game}
 */
const check = (game, x, y) => (
  isCheckable(game.grid, x, y)
    ? updateGame(
      game,
      {
        player: getNextPlayer(game.player),
        grid: game.grid.map(getRowValue(x, y, game.player))
      }
    )
    : game
);

/**
 * @param {Player} player
 * @returns {Player}
 */
const getNextPlayer = (player) => (
  player === 'x'
    ? 'o'
    : 'x'
);

/**
 * @param {Game} game
 * @param {object} newProps
 * @returns {Game}
 */
const updateGame = (game, newProps) => (
  Object.assign(
    {},
    game,
    newProps
  )
);

/**
 * @param {number} x
 * @param {number} y
 * @param {string} cellValue
 * @returns {function}
 */
const getRowValue =
  (x, y, cellValue) =>
    (row, rowIndex) => (
      rowIndex === x
        ? row.map(getCellValue(y, cellValue))
        : row
    );

/**
 * @param {number} y
 * @param {string} cellValue
 * @returns {function}
 */
const getCellValue =
  (y, cellValue) =>
    (cell, cellIndex) => (
      cellIndex === y
        ? cellValue
        : cell
    );

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isCheckable = (grid, x, y) => (
  isInRange(grid, x, y) && isFree(grid, x, y)
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isInRange = (grid, x, y) => (
  Boolean(grid[x]) && typeof grid[x][y] === 'string'
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isFree = (grid, x, y) => (
  grid[x] == null || grid[x][y] === '_'
);

module.exports = createGame;
module.exports.check = check;
