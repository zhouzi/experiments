const jsdom = require('jsdom');
const test = require('tape');
const createView = require('../DOM');

jsdom.env(
  '',
  function (err, window) {
    global.window = window;

    test('createView() should create a table container', (assert) => {
      assert.same(
        createView({
          grid: [
            ['_', '_', '_'],
            ['_', '_', '_'],
            ['_', '_', '_']
          ]
        }).tagName,
        'TABLE'
      );

      assert.end();
    });

    test('createView() should generate an empty grid', (assert) => {
      assert.same(
        createView({
          grid: [
            ['_', '_', '_'],
            ['_', '_', '_'],
            ['_', '_', '_']
          ]
        }).innerHTML,
        '<tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr><tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr><tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr>'
      );

      assert.end();
    });

    test('createView() should generate the checked cells', (assert) => {
      assert.same(
        createView({
          grid: [
            ['x', '_', '_'],
            ['_', '_', 'o'],
            ['_', '_', '_']
          ]
        }).innerHTML,
        '<tr><td><button type="button" disabled="true">x</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr><tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button" disabled="true">o</button></td></tr><tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr>'
      );

      assert.end();
    });
  }
);
