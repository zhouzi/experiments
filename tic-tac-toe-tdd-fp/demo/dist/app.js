/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const createView = __webpack_require__(2);
	const app = document.getElementById('app');

	const generate = (game = Game()) => {
	  app.innerHTML = '';
	  app.appendChild(
	    createView(game, (x, y) => {
	      game = Game.check(game, x, y);
	      const winner = Game.winner(game);

	      if (winner == '_') {
	        generate(game);
	        return;
	      }

	      alert(`Winner is ${winner}!`);
	      generate();
	    })
	  );
	};

	generate();


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	    ? checkAtCoord(game, x, y)
	    : game
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
	  grid[y] == null || grid[y][x] === '_'
	);

	/**
	 * @param {Game} game
	 * @param {number} x
	 * @param {number} y
	 * @returns {Game}
	 */
	const checkAtCoord = (game, x, y) => (
	  updateGame(
	    game,
	    {
	      player: getNextPlayer(game.player),
	      grid: updateCell(game.grid, x, y, game.player)
	    }
	  )
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
	 * @param {Player} player
	 * @returns {Player}
	 */
	const getNextPlayer = (player) => (
	  player === 'x'
	    ? 'o'
	    : 'x'
	);

	/**
	 * @param {Array} grid
	 * @param {number} x
	 * @param {number} y
	 * @param value
	 * @returns {Array}
	 */
	const updateCell = (grid, x, y, value) => (
	  updateAtIndex(
	    grid,
	    y,
	    (row) => updateAtIndex(
	      row,
	      x,
	      () => value
	    )
	  )
	);

	/**
	 * @param {Array} items
	 * @param {number} index
	 * @param {function} valueGetter
	 * @returns {Array}
	 */
	const updateAtIndex = (items, index, valueGetter) => (
	  items
	    .slice(0, index)
	    .concat([valueGetter(items[index])])
	    .concat(items.slice(index + 1))
	);

	/**
	 * @param {Game} game
	 * @returns {string}
	 */
	const winner = (game) => (
	  getWinnerFromCollectionsOfCoords(
	    game.grid,
	    [
	      getHorizontalIndexes(3),
	      getVerticalIndexes(3),
	      getDiagonalIndexes(3)
	    ]
	  )
	);

	/**
	 * @param {number} size
	 * @returns {Array}
	 */
	const getHorizontalIndexes = (size) => (
	  times(size, (rowIndex) => (
	    times(size, (cellIndex) => [cellIndex, rowIndex])
	  ))
	);

	/**
	 * @param {number} size
	 * @returns {Array}
	 */
	const getVerticalIndexes = (size) => (
	  times(size, (rowIndex) => (
	    times(size, (cellIndex) => [rowIndex, cellIndex])
	  ))
	);

	/**
	 * @param {number} size
	 * @returns {Array}
	 */
	const getDiagonalIndexes = (size) => (
	  [
	    times(size, (index) => [index, index]),
	    times(size, (index) => [size - 1 - index, index])
	  ]
	);

	/**
	 * @param {Array} grid
	 * @param {Array} collectionsOfCoords
	 */
	const getWinnerFromCollectionsOfCoords = (grid, collectionsOfCoords) => (
	  lookupWinner(collectionsOfCoords, (collectionOfCoords) => (
	    lookupWinner(collectionOfCoords, (coords) => (
	      getWinnerInCoords(grid, coords, getFirstCell(grid, coords))
	    ))
	  ))
	);

	/**
	 * @param {Array} ar
	 * @param {function} iteratee
	 * @returns {string}
	 */
	const lookupWinner = (ar, iteratee) => (
	  ar.length === 0
	    ? '_'
	    : (() => {
	      const head = ar[0];
	      const result = iteratee(head);

	      return (
	        result === '_'
	          ? lookupWinner(ar.slice(1), iteratee)
	          : result
	      );
	    })()
	);

	/**
	 * @param {Array} grid
	 * @param {Array} coords
	 * @param {string} firstCell
	 */
	const getWinnerInCoords = (grid, coords, firstCell) => (
	  isWinningCoords(grid, coords, firstCell)
	    ? firstCell
	    : '_'
	);

	/**
	 * @param {Array} grid
	 * @param {Array} coords
	 * @param {string} firstCell
	 */
	const isWinningCoords = (grid, coords, firstCell) => (
	  coords.every(([x, y]) => getCellAt(grid, x, y) === firstCell)
	);

	/**
	 * @param {Array} grid
	 * @param {Array} coords
	 * @returns {string}
	 */
	const getFirstCell = (grid, coords) => (
	  getCellAt(grid, coords[0][0], coords[0][1])
	);

	/**
	 * @param {Array} grid
	 * @param {number} x
	 * @param {number} y
	 * @returns {string}
	 */
	const getCellAt = (grid, x, y) => (
	  grid[y][x]
	);

	/**
	 * @param {number} size
	 * @param {function} iteratee
	 * @returns {Array}
	 */
	const times = (size, iteratee) => (
	  timesRecursive(size, iteratee)
	);

	/**
	 * @param {number} size
	 * @param {function} iteratee
	 * @param {number} index
	 * @param {Array} acc
	 * @returns {Array}
	 */
	const timesRecursive = (size, iteratee, index = 0, acc = []) => (
	  size === 0
	    ? acc
	    : timesRecursive(
	      size - 1,
	      iteratee,
	      index + 1,
	      acc.concat([iteratee(index)])
	    )
	);

	module.exports = createGame;
	module.exports.check = check;
	module.exports.winner = winner;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @param {Element} element
	 * @param {Array} children
	 * @returns {Element}
	 */
	const addChildren = (element, children) => {
	  [].concat(children).forEach((child) => element.appendChild(child));
	  return element;
	};

	/**
	 * @param {Element} element
	 * @param {string} text
	 * @returns {Element}
	 */
	const addText = (element, text) => {
	  element.textContent = text;
	  return element;
	};

	/**
	 * @param {Element} element
	 * @param {object} attrs
	 * @returns {Element}
	 */
	const addAttrs = (element, attrs) => {
	  Object
	    .keys(attrs)
	    .filter((attr) => attrs[attr])
	    .forEach((attr) => (
	      attr.substr(0, 2) == 'on'
	        ? element.addEventListener(attr.substr(2).toLowerCase(), attrs[attr])
	        : element.setAttribute(attr, attrs[attr])
	    ));

	  return element;
	};

	/**
	 * @param {string} tagName
	 * @param {Array|Element|string} children
	 * @param {object} attrs
	 * @returns {Element}
	 */
	const createElement = (tagName, children, attrs = {}) => {
	  const element = window.document.createElement(tagName);
	  return (
	    addAttrs(
	      typeof children == 'string'
	        ? addText(element, children)
	        : addChildren(element, children),
	      attrs
	    )
	  );
	};

	/**
	 * @param {Game} game
	 * @param {function} callback
	 * @returns {Element}
	 */
	const createView = (game, callback) => {
	  /**
	   * @param {string} content
	   * @param {function} onClick
	   * @returns {Element}
	   */
	  const createButton = (content, onClick) => (
	    createElement('button', content, {
	      type: 'button',
	      disabled: content !== '_',
	      onClick
	    })
	  );

	  /**
	   * @param {string} cell
	   * @param {number} x
	   * @param {number} y
	   * @returns {Element}
	   */
	  const createCell = (cell, x, y) => (
	    createElement('td', createButton(cell, () => callback(x, y)))
	  );

	  /**
	   * @param {Array} row
	   * @param {number} y
	   * @returns {Element}
	   */
	  const createRow = (row, y) => (
	    createElement('tr', row.map((cell, x) => createCell(cell, x, y)))
	  );

	  return createElement('table', game.grid.map((row, y) => createRow(row, y)));
	};

	module.exports = createView;


/***/ }
/******/ ]);