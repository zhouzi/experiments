const Game = require('../../src');
const createView = require('../../src/DOM');
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
