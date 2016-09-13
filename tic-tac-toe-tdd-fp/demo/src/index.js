const Game = require('../../src');
const createView = require('../../src/DOM');
const app = document.getElementById('app');

const generate = (game = Game()) => {
  app.innerHTML = '';
  app.appendChild(
    createView(game, (action) => {
      switch (action.type) {
        case 'winner':
          alert(`Winner is ${action.payload}!`);
          setTimeout(() => generate(), 0);
          return;

        case 'gameover':
          alert(`Game Over!`);
          setTimeout(() => generate(), 0);
          return;

        case 'check':
          const [x, y] = action.payload;
          generate(Game.check(game, x, y));
          return;
      }
    })
  );
};

generate();
