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
        }, () => {}).innerHTML,
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
        }, () => {}).innerHTML,
        '<tr><td><button type="button" disabled="true">x</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr><tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button" disabled="true">o</button></td></tr><tr><td><button type="button">_</button></td><td><button type="button">_</button></td><td><button type="button">_</button></td></tr>'
      );

      assert.end();
    });

    test('should call callback with coords', (assert) => {
      let args;
      const callback = (...rest) => args = rest;
      const view = createView({
        grid: [
          ['_', '_', '_'],
          ['_', '_', '_'],
          ['_', '_', '_']
        ]
      }, callback);

      view.querySelector('tr:nth-child(2)>td:nth-child(3) button').click();

      assert.same(
        args,
        [
          {
            type: 'check',
            payload: [
              2,
              1
            ]
          }
        ]
      );

      assert.end();
    });

    test('should call a callback when game is over', (assert) => {
      let args;
      const callback = (...rest) => args = rest;
      const view = createView({
        grid: [
          ['x', 'o', 'x'],
          ['o', 'x', 'o'],
          ['x', 'o', 'x']
        ]
      }, callback);

      view.querySelector('tr:nth-child(3)>td:nth-child(2) button').click();

      assert.same(
        args,
        [
          {
            type: 'gameover'
          }
        ]
      );

      assert.end();
    });
  }
);
