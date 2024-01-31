# Four-In-A-Row.js

Four-In-A Row (aka "Connect Four" or "Four-In-A-Line") game logic library for JavaScript. No need to write the logic for the game yourself.

This was adapted from my [Making Four-In-A-Row Using JavaScript blog series](https://colinkiama.com/blog/making-four-in-a-row-part-1/).

---

## Table of Contents

- [Installing](#installing)
- [Examples](#example)
- [Public API](#public-api)

## Installing

### Package Manager

You can use your favourite package manager to install the library.

For example:

```bash
npm install four-in-a-row
```

### No build step

No build step required. Add [four-in-a-row.js](dist/four-in-a-row.js) or [four-in-a-row.min.js](dist/four-in-a-row.min.js) directly to your projects.

## Examples

### Usage

```js
import { Game } from "four-in-a-row";

const game = new Game();
const startingMoveResult = game.playMove(0); // Yellow Token placed at row: 0, column: 0.
const nextMoveResult = game.playMove(1); // Red Token placed at row: 0, column 1.
```

### Full Example

For a full example of how to use the library, check out out the [manual test in ths repository](tests/manual) which is a four-in-a-row [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) game.

## Public API

### Create a new game

```js
import { Game } from "four-in-a-row";

// Create a new game
const game = new Game();

// Check current status of game
const initialStatus = game.status;

// Get starting color
const startingColor = game.startingColor;

// Get current turn
const turn = game.currentTurn;

// Make a move
const moveResult = game.playMove(0);

// Retrieve game board
const board = game.currentBoard;

// Restart game
game.reset();
```

### Contstants

#### `GameStatus`

```js
import { Game, GameStatus } from 'four-in-a-row';

console.log(GameStatus.IN_PROGRESS); // "in-progress"
console.log(GameStatus.START); // "start"
console.log(GameStatus.WIN); // "win"
console.log(GameStatus.DRAW); // "draw"

const game = new Game();
console.log(game.status === GameStatus.START); // true
```

#### `MoveStatus`

```js
import { Game, MoveStatus } from 'four-in-a-row';

console.log(MoveStatus.INVALID); // "invalid"
console.log(MoveStatus.WIN); // "win"
console.log(MoveStatus.SUCCESS); // "success"
console.log(MoveStatus.DRAW); // "draw"

const game = new Game();
const moveResult = game.playMove(0);
console.log(moveResult.status === MoveStatus.Success); // true
```

#### `PlayerColor`

```js
import { Game, PlayerColor} from 'four-in-a-row';

console.log(PlayerColor.NONE); // "none"
console.log(PlayerColor.YELLOW); // "yellow"
console.log(PlayerColor.RED); // "red"

const game = new Game();
console.log(game.startingColor === PlayerColor.YELLOW); // true;
console.log(game.currentTurn === PlayerColor.YELLOW); // true;

game.playMove(0);
console.log(game.currentTurn === PlayerColor.RED); // true;

console.log(game.currentBoard);
// game.currentBoard
// { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
// { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
// { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
// { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
// { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
// { 0: 1, 1: 0, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0 },
```

#### `BoardDimensions`

```js
import { BoardDimensions } from 'four-in-a-row';

console.log(BoardDimensions.ROWS); // 6
console.log(BoardDimensions.COLUMNS); // 7
console.log(BoardDimensions.WIN_LINE_LENGTH); // 4
```

#### `BoardToken`

```js
import { Game, BoardToken } from 'four-in-a-row';

console.log(BoardToken.NONE); // 0
console.log(BoardToken.YELLOW); // 1
console.log(BoardToken.RED); // 2

const game = new Game();
game.playMove(0);
console.log(game.currentBoard);
// Output (`Uint8Array[]`- each Uint8Array element contains a `BoardToken`):
// [
//   { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
//   { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
//   { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
//   { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
//   { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
//   { 0: 1, 1: 0, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0 },
// ]
```

### Instance methods

#### `playMove(columnIndex: number)`

Returns a `MoveResult` object

```js
{
  // Uint8Array[] - Each Uint8Array element contains a `BoardToken`
  nextBoard: [
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 2, 5: 2, 6: 2 },
    { 0: 0, 1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 1 },
  ],
  // PlayerColor
  winner: 'yellow',
  // MoveStatus
  status: 'WIN',
  // BoardPosition[]
  winLine:
  [
    { row: 5, column: 3 },
    { row: 5, column: 4 },
    { row: 5, column: 5 },
    { row: 5, column: 6 },
  ]
}
```

#### `reset()`

Restarts the game.

### Game Over State Behaviour

You can find out if the game is over by checking for the for a win or draw in the `status` field of a `MoveResult` or the `status` field of a `Game`.

if the game is over, calls to `playMove()` will return the last `MoveResult` (Details of the move that put the game into a game over state).

You'll have to call the `reset()` to get out of the game over state.
