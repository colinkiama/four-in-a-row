import {
    GameStatus,
    MoveStatus,
    PlayerColor,
} from "../../../src/index.js";

import { Board, StatusArea, PlayAgainButton } from "./components/index.js";
import { BoardConfig, FrontEndConfig, PlayAgainButtonConfig, StatusAreaConfig, StatusMessages } from "./constants/index.js";

export default class FrontEnd {
    canvas;
    context;
    game;
    width;
    height;
    statusArea;
    board;
    playAgainButton;
    gameOver;

    constructor(game) {
        this.canvas = document.getElementById("canvas");
        this.canvas.style.background = FrontEndConfig.GAME_BACKGROUND_COLOR;
        this.context = this.canvas.getContext("2d");
        this.game = game;
        this.width = canvas.width;
        this.height = canvas.height;
        this.gameOver = false;

        enableHiDPISupport(this.canvas, this.context);
    }

    start() {
        this.statusArea = this.createStatusArea();
        this.board = this.createBoard();
        this.playAgainButton = this.createPlayAgainButton();

        document.body.addEventListener('click', (clickEvent) => {
            this.board.handleClick(clickEvent);
            this.playAgainButton.handleClick(clickEvent);
        });
    }

    createPlayAgainButton() {
        let buttonX = this.width / 2 - PlayAgainButtonConfig.WIDTH / 2;
        let buttonY = this.height - PlayAgainButtonConfig.MARGIN_BOTTOM;
        let button = new PlayAgainButton(this.context, buttonX, buttonY, PlayAgainButtonConfig.WIDTH, PlayAgainButtonConfig.HEIGHT);
        button.setClickHandler(() => this.reset());
        return button;
    }

    createBoard() {
        let board = new Board(this.context, BoardConfig.MARGIN_LEFT, this.statusArea.height + BoardConfig.MARGIN_TOP, BoardConfig.WIDTH, BoardConfig.HEIGHT);
        board.setColumnSelectionHandler((columnIndex) => this.playMove(columnIndex));
        board.render(this.game.currentBoard);
        return board;
    }

    createStatusArea() {
        let statusArea = new StatusArea(this.context, 0, 0, this.width, StatusAreaConfig.HEIGHT);
        statusArea.render(this.game.currentTurn, this.pickStatusMessage(this.game.status));
        return statusArea;
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    reset() {
        this.game.reset();
        this.gameOver = false;

        this.playAgainButton.hide();
        this.statusArea.render(this.game.currentTurn, this.pickStatusMessage(this.game.status));
        this.board.render(this.game.currentBoard);
    }

    playMove(columnIndex) {
        let moveResult = this.game.playMove(columnIndex);
        this.processMoveResult(moveResult);
    }

    processMoveResult(moveResult) {
        if (this.gameOver || moveResult.status === MoveStatus.INVALID) {
            return;
        }

        const indicatorColor = moveResult.status === MoveStatus.DRAW ? PlayerColor.NONE : this.game.currentTurn;

        this.statusArea.render(indicatorColor, this.pickStatusMessage(moveResult.status))
        this.board.render(this.game.currentBoard);

        if (moveResult.status === MoveStatus.WIN || moveResult.status === MoveStatus.DRAW) {
            this.gameOver = true;
        }

        if (this.gameOver) {
            this.playAgainButton.render();
        }
    }

    pickStatusMessage(status) {
        switch (status) {
            case GameStatus.WIN:
                return this.game.currentTurn === PlayerColor.YELLOW ? StatusMessages.YELLOW_WIN : StatusMessages.RED_WIN;
            case GameStatus.DRAW:
                return StatusMessages.DRAW;
        }

        // At this point, we can assume that the game is either has just started
        // or is still in progress.
        return this.game.currentTurn === PlayerColor.YELLOW ? StatusMessages.YELLOW_TURN : StatusMessages.RED_TURN;
    }
}

// Source: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
function enableHiDPISupport(canvas, context) {
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    context.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
}
