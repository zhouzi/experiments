/* @flow */

type Direction = 'top' | 'right' | 'bottom' | 'left';
type Point = [number, number];
type Coords = Point[];
type Game = {
  direction: Direction,
  bounds: Point,
  snake: Coords,
  food: Coords
};

function createGame(): Game {
  return {
    direction: 'right',
    bounds: [10, 10],
    snake: [
      [0, 0],
    ],
    food: [],
  };
}

module.exports = {
  createGame,
};
