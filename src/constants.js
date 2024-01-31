/**
 * Constants and Variables used in Four-In-A-Row Game
 * @module constants
 */

/**
 * Represents the overall state of the game
 * @readonly
 * @enum {string}
 */
export const GameStatus = {
    IN_PROGRESS: "in-progress",
    START: "start",
    WIN: "win",
    DRAW: "draw",
};

/**
 * Represents the result of a move
 * @readonly
 * @enum {string}
 */
export const MoveStatus = {
    INVALID: "invalid",
    WIN: "win",
    SUCCESS: "success",
    DRAW: "draw",
};

/**
 * Represents the color of a player
 * @readonly
 * @enum {string}
 */
export const PlayerColor = {
    NONE: "none",
    YELLOW: "yellow",
    RED: "red",
};

/**
 * Contains dimensions of the game board
 * @type {{ROWS: number, COLUMNS: number, WIN_LINE_LENGTH: number}} BoardDimensions
 * @readonly
 */
export const BoardDimensions = {
    ROWS: 6,
    COLUMNS: 7,
    WIN_LINE_LENGTH: 4,
};

/**
 * Represents Board token on board
 * @readonly
 * @enum {number}
 */
export const BoardToken = {
    NONE: 0,
    YELLOW: 1,
    RED: 2,
};
