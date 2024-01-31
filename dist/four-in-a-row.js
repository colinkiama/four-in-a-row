/**
 * Constants and Variables used in Four-In-A-Row Game
 * @module constants
 */

/**
 * Represents the overall state of the game
 * @readonly
 * @enum {string}
 */
const GameStatus = {
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
const MoveStatus = {
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
const PlayerColor = {
    NONE: "none",
    YELLOW: "yellow",
    RED: "red",
};

/**
 * Contains dimensions of the game board
 * @type {{ROWS: number, COLUMNS: number, WIN_LINE_LENGTH: number}} BoardDimensions
 * @readonly
 */
const BoardDimensions = {
    ROWS: 6,
    COLUMNS: 7,
    WIN_LINE_LENGTH: 4,
};

/**
 * Represents Board token on board
 * @readonly
 * @enum {number}
 */
const BoardToken = {
    NONE: 0,
    YELLOW: 1,
    RED: 2,
};

/**
 * Position on game board
 * @typedef {{row: number, column: number}} BoardPosition
 */

/**
 * Result from checking for a win in the game board
 * @typedef {Object} WinCheckResult
 * @property {BoardPosition[]} winLine
 * @property {PlayerColor} [winner]
*/

/**
 * Defines settings which control how to look for win lines in the game board.
 * @typedef {Object} LineSearchOptions
 * @property {number} [startRowIndex=0]
 * @property {number} [startColumnIndex=0]
 * @property {number} [rowCountStep=0]
 * @property {number} [columnCountStep=0]
 */

/**
 * Result from attempting to perform a move
 * @typedef {Object} MoveResult
 * @property {Uint8Array} nextBoard
 * @property {PlayerColor} winner
 * @property {MoveStatus} status
 * @property {Uint8Array} winLine
 */

/**
 * Result from checking if move can be performed on a board
 * @typedef {Object} MoveAttemptResult
 * @property {MoveStatus} status
 * @property {Uint8Array} [board]
 */

class Game {
    /**
     * The player who starts first
     * @type {PlayerColor}
     */
    startingColor;

    /**
     * The current player's turn
     * @type {PlayerColor}
     */
    currentTurn;

    /** The current status of the game.
     * @type {GameStatus}
     */
    status;
    
    /** The value of the game board
     * @type {Uint8Array[]}
     */
    currentBoard;

    constructor() {
        this.reset();
    }

    /**
     * Creates new game empty game board
     * @private
     * @return {Uint8Array[]} board
     */
    static createBoard() {
        let board = new Array(BoardDimensions.ROWS);

        for (let i = 0; i < BoardDimensions.ROWS; i++) {
            board[i] = new Uint8Array(BoardDimensions.COLUMNS);
            board[i].fill(BoardToken.NONE);
        }

        return board;
    }

    /**
     * Creates a deep copy of a game board from another game board
     * @private
     * @param {Uint8Array} oldBoard
     * @return {Uint8Array} newBoard
     */
    static deepBoardCopy(oldBoard) {
        let newBoard = new Array(BoardDimensions.ROWS);

        for (let rowIndex = 0; rowIndex < BoardDimensions.ROWS; rowIndex++) {
            newBoard[rowIndex] = new Uint8Array(BoardDimensions.COLUMNS);
            for (let columnIndex = 0; columnIndex < BoardDimensions.COLUMNS; columnIndex++) {
                newBoard[rowIndex][columnIndex] = oldBoard[rowIndex][columnIndex];
            }
        }

        return newBoard;
    }

    /**
     * Get corresponding board token from a player color.
     * @private
     * @param {PlayerColor} playerColor
     * @return {BoardToken} boardToken
     */
    static playerColorToBoardToken(playerColor) {
        switch (playerColor) {
            case PlayerColor.YELLOW:
                return BoardToken.YELLOW;
            case PlayerColor.RED:
                return BoardToken.RED;
            default:
                return BoardToken.NONE;
        }
    }

    /**
     * Attempt to find a win line from board
     * @private
     * @param {Uint8Array[]} board
     * @param {LineSearchOptions} options
     * @return {WinCheckResult} result
     */
    static tryFindWinLine(board, options) {
        // If `options` is null/undefined, set it's value to an empty object.
        options = options || {};

        let config = {
            startRowIndex: options.startRowIndex || 0,
            startColumnIndex: options.startColumnIndex || 0,
            rowCountStep: options.rowCountStep || 0,
            columnCountStep: options.columnCountStep || 0
        };

        let count = 0;
        let tokenToCheck = BoardToken.NONE;
        let winLine = [];

        for (let i = 0; i < BoardDimensions.WIN_LINE_LENGTH; i++) {
            let row = config.startRowIndex + config.rowCountStep * i;
            let column = config.startColumnIndex + config.columnCountStep * i;

            if (Game.checkIfOutOfBounds(row, column)) {
                break;
            }

            let currentToken = board[row][column];
            if (currentToken === BoardToken.NONE) {
                break;
            }

            if (tokenToCheck === BoardToken.NONE) {
                tokenToCheck = currentToken;
            }

            if (currentToken === tokenToCheck) {
                count++;
            }

            winLine.push({ row: row, column: column });
        }

        if (count === BoardDimensions.WIN_LINE_LENGTH) {
            return {
                winLine: winLine,
                winner: Game.boardTokenToPlayerColor(tokenToCheck),
            };
        }

        return {
            winLine: []
        };
    }

    /**
     * Check if given board position is out of the bounds of a game board
     * @private
     * @param {number} row
     * @param {number} column
     * @return {boolean} result
     */
    static checkIfOutOfBounds(row, column) {
        return row < 0
            || row > BoardDimensions.ROWS
            || column < 0
            || column > BoardDimensions.COLUMNS;
    }

    /**
     * Get corresponding a player color from a board token
     * @private
     * @param {BoardToken} boardToken
     * return {PlayerColor} playerColor
     */
    static boardTokenToPlayerColor(boardToken) {
        switch (boardToken) {
            case BoardToken.YELLOW:
                return PlayerColor.YELLOW;
            case BoardToken.RED:
                return PlayerColor.RED;
            default:
                return PlayerColor.NONE;
        }
    }

    /**
     * Checks if there is a win in a game board
     * @private
     * @param {Uint8Array[]} board
     * @return {WinCheckResult} result
     */
    static checkForWin(board) {
        // Starts from bottom left of the board and ends on top right of board
        for (let columnIndex = 0; columnIndex < BoardDimensions.COLUMNS; columnIndex++) {
            for (let rowIndex = BoardDimensions.ROWS - 1; rowIndex > -1; rowIndex--) {
                // Check for vertical win
                let verticalWinCheckResult = Game.tryFindWinLine(board, {
                    startRowIndex: rowIndex,
                    startColumnIndex: columnIndex,
                    rowCountStep: -1,
                });

                if (verticalWinCheckResult.winner) {
                    return verticalWinCheckResult;
                }

                let horizontalWinCheckResult = Game.tryFindWinLine(board, {
                    startRowIndex: rowIndex,
                    startColumnIndex: columnIndex,
                    columnCountStep: -1,
                });

                if (horizontalWinCheckResult.winner) {
                    return horizontalWinCheckResult;
                }

                let leftDiagonalWinCheck = Game.tryFindWinLine(board, {
                    startRowIndex: rowIndex,
                    startColumnIndex: columnIndex,
                    rowCountStep: -1,
                    columnCountStep: -1
                });

                if (leftDiagonalWinCheck.winner) {
                    return leftDiagonalWinCheck;
                }

                let rightDiagonalWinCheck = Game.tryFindWinLine(board, {
                    startRowIndex: rowIndex,
                    startColumnIndex: columnIndex,
                    rowCountStep: -1,
                    columnCountStep: 1
                });

                if (rightDiagonalWinCheck.winner) {
                    return rightDiagonalWinCheck;
                }
            }
        }

        return {
            winLine: [],
            winner: PlayerColor.NONE
        };
    }

    /**
     * Check if a game board is full
     * @private
     * @param {Uint8Array} board
     * @return {boolean} result
     */
    static checkForFilledBoard(board) {
        for (let j = 0; j < board.length; j++) {
            let boardColumn = board[j];
            for (let i = 0; i < boardColumn.length; i++) {
                let boardPosition = boardColumn[i];
                if (boardPosition === BoardToken.NONE) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Reset the game state - Restarts the game
     */
    reset() {
        this.startingColor = PlayerColor.YELLOW;
        this.currentTurn = this.startingColor;
        this.status = GameStatus.START;
        this.currentBoard = Game.createBoard();
    }

    /**
     * Attemps to place token of current player in column of the given index
     * @param {number} columnIndex
     * @return {MoveResult} result
     */
    playMove(columnIndex) {
        switch (this.status) {
            case GameStatus.START:
                this.status = GameStatus.IN_PROGRESS;
                break;
            case GameStatus.DRAW:
            case GameStatus.WIN:
                // The game is over at this point so
                // re-evaluate the latest board, returning the same game status
                // and board details.
                return this.evaluateGame(this.currentBoard);
        }

        let moveResult = this.performMove(columnIndex);

        // Only change current turn while the game is still in progress.
        if (moveResult.status === MoveStatus.SUCCESS) {
            this.currentTurn = this.currentTurn === PlayerColor.YELLOW
                ? PlayerColor.RED
                : PlayerColor.YELLOW;
        }

        return moveResult;
    }

    /** Place token of current player in column of the given index
     * @private
     * @param {number} columnIndex
     * @return {MoveResult} result
     */
    performMove(columnIndex) {
        let nextBoard = Game.deepBoardCopy(this.currentBoard);

        let moveAttemptResult = this.tryPerformMove(columnIndex, nextBoard);

        if (moveAttemptResult.status === MoveStatus.INVALID) {
            return {
                board: nextBoard,
                winner: PlayerColor.NONE,
                status: MoveStatus.INVALID,
                winLine: []
            }
        }

        // From this point, the board move was successful.
        this.currentBoard = moveAttemptResult.board;
        return this.evaluateGame(moveAttemptResult.board);
    }

    /**
     * Try to perform move on a game board
     * @private
     * @param {number} columnIndex
     * @param  {Uint8Array} nextBoard
     * @return {MoveAttemptResult} result
     */
    tryPerformMove(columnIndex, nextBoard) {
        let isMoveValid = false;

        for (let i = nextBoard.length - 1; i > -1; i--) {
            let boardRow = nextBoard[i];
            let boardPosition = boardRow[columnIndex];

            if (boardPosition !== BoardToken.NONE) {
                continue;
            }

            boardRow[columnIndex] = Game.playerColorToBoardToken(this.currentTurn);
            isMoveValid = true;
            break;
        }

        if (!isMoveValid) {
            return {
                status: MoveStatus.INVALID,
            };
        }

        return {
            status: MoveStatus.SUCCESS,
            board: nextBoard
        };
    }

    /** Evaluate next state of the game from last move performed on a game board
     * @private
     * @param {Uint8Array} board
     * @return {MoveResult} result
     */
    evaluateGame(board) {
        let winCheckResult = Game.checkForWin(board);

        if (winCheckResult.winner !== PlayerColor.NONE) {
            this.status = GameStatus.WIN;
            return {
                board: board,
                winner: winCheckResult.winner,
                status: MoveStatus.WIN,
                winLine: winCheckResult.winLine,
            };
        }

        // If board is full right now, we can assume the game to be a draw
        // since there weren't any winning lines detected.
        if (Game.checkForFilledBoard(board)) {
            this.status = GameStatus.DRAW;

            return {
                board: board,
                winner: PlayerColor.NONE,
                status: MoveStatus.DRAW,
                winLine: [],
            };
        }

        // From this point, we can assume that a successful move was made and the game will
        // continue on.
        return {
            board: board,
            winner: PlayerColor.NONE,
            status: MoveStatus.SUCCESS,
            winLine: [],
        };
    }
}

export { BoardDimensions, BoardToken, Game, GameStatus, MoveStatus, PlayerColor };
