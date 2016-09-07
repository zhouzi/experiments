const jsdom = require('jsdom');
const test = require('tape');
const createView = require('../DOM');

jsdom.env(
  '',
  function (err, window) {
    global.window = window;

    test('createView()', (assert) => {
      assert.same(
        createView().tagName,
        'TABLE',
        'should create a container'
      );

      assert.end();
    });
  }
);
