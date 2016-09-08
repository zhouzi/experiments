/**
 * @param {string} content
 * @returns {Element}
 */
const createButton = (content) => (
  createElement('button', content, {
    type: 'button',
    disabled: content !== '_'
  })
);

/**
 * @param {string} cell
 * @returns {Element}
 */
const createCell = (cell) => (
  createElement('td', createButton(cell))
);

/**
 * @param {Array} row
 * @returns {Element}
 */
const createRow = (row) => (
  createElement('tr', row.map((cell) => createCell(cell)))
);

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
    .forEach((attr) => element.setAttribute(attr, attrs[attr]));

  return element;
};

/**
 * @param {string} tagName
 * @param {Array|string} children
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
 * @returns {Element}
 */
const createView = (game) => (
  createElement('table', game.grid.map((row) => createRow(row)))
);

module.exports = createView;
