# Four-In-A-Row.js

Four-In-A Row (aka "Connect Four" or "Four-In-A-Line") game logic library for JavaScript. No need to write the logic for the game yourself.

This was adapted from my [Making Four-In-A-Row Using JavaScript blog series](https://colinkiama.com/blog/making-four-in-a-row-part-1/).

---

## Table of Contents

- [Installing](#installing)
- [Examples](#example)
- [API](#api)

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
import { Game } from 'four-in-a-row';

const game = new Game ();
const startingMoveResult = game.playMove(0); // Yellow Token placed at row: 0, column: 0
const nextMoveResult = game.playMove(1); // Red Token placed at row: 0, column 1;
```

### Full Example

For a full example of how to use the library, check out out the [manual test in ths repository](tests/manual) which is a four-in-a-row [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) game.


