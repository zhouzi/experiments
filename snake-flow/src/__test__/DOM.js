const jsdom = require('jsdom');
const test = require('ava');
const createView = require('../DOM');
const { createGame } = require('../index');

jsdom.env(
  '',
  (err, window) => {
    global.window = window;

    test('should return a basic view', (assert) => {
      const actual = createView(createGame()).innerHTML;
      const expected = '<div class="container" style="position: relative; width: 50px; height: 50px;"><div style="position: absolute; top: 0; left: 0; width: 10px; height: 10px; background: red;"></div></div>';

      assert.is(actual, expected);
    });
  }
);
