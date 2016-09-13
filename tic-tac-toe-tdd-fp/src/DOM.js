const Game = require('./');

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
 * @param {string} type
 * @param {*} payload
 * @returns {object}
 */
const createAction = (type, payload) => {
  const action = {
    type
  };

  if (payload != null) {
    action.payload = payload;
  }

  return action;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {object}
 */
const checkAction = (x, y) => (
  createAction('check', [x, y])
);

/**
 * @returns {object}
 */
const gameoverAction = () => (
  createAction('gameover')
);

/**
 * @param {string} winner
 * @returns {object}
 */
const winnerAction = (winner) => ({
  type: 'winner',
  payload: winner
});

/**
 * @param {Game} game
 * @param {function} dispatch
 * @returns {Element}
 */
const createView = (game, dispatch) => {
  const winner = Game.winner(game);
  if (winner !== '_') {
    dispatch(winnerAction(winner));
  }

  if (Game.gameover(game)) {
    dispatch(gameoverAction());
  }

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
    createElement('td', createButton(cell, () => dispatch(checkAction(x, y))))
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
