// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import TetrisBoard from "./GameBoard";
import "./TetrisGame.scss";
import { Constants } from "../../utils/Constants";
import GameEndView from "./GameEndView";
import {
    setGameProgress,
    updateTetrisGameBoard,
    updateTimerId,
    updateGameScore,
    updateXYCoordinateOfActiveBlock,
    updateRotation,
    updateShadowPiece,
    updateGameLevel,
    updateActiveBlockNumber
} from "../../actions/TetrisGameAction";
import getStore, { GameStatus } from "../../store/TetrisGameStore";
import cloneDeep from "lodash.clonedeep";
import { getShadowBlock } from "./GameUtils/TetrisUtils";
import { UxUtils } from "../../utils/UxUtils";

/**
 * <TetrisGame> component for tetris game logic
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */

@observer
class TetrisGame extends React.Component<any> {
    private initialXPosition = null;
    private initialYPosition = null;
    private diffX = null;
    private diffY = null;
    private timeDown = null;
    private store = getStore();
    constructor(props: any) {
        super(props);
        setGameProgress(GameStatus.InProgress);
    }

    // Key Press Handler
    handleKeyDown = (event) => {
        const key = { ...Constants.KEY_MAP };
        switch (event.keyCode) {
            case key.UP:
                this.updateTetrisGameBoard("rotate");
                break;
            case key.DOWN:
                this.updateTetrisGameBoard("down");
                break;
            case key.LEFT:
                this.updateTetrisGameBoard("left");
                break;
            case key.RIGHT:
                this.updateTetrisGameBoard("right");
                break;
            case key.SPACE:

                if (this.store.gameStatus == GameStatus.Paused) {
                    setGameProgress(GameStatus.InProgress);
                }
                else {
                    setGameProgress(GameStatus.Paused);
                }
        }
    }

    // Handle tap for Mobile Devices
    handleTap = () => {
       if(UxUtils.renderingForMobile()) { this.updateTetrisGameBoard("rotate");}
    }

    // Event handle for start touch
    handleTouchStart = (event) => {
        this.initialXPosition = event.changedTouches[0].screenX;
        this.initialYPosition = event.changedTouches[0].screenY;
        this.timeDown = Date.now();
    }

    // Event handler for touch events like swipes(left, right, top and down)
    handleTouchMove = (event) => {
        event.preventDefault();
        if (this.initialXPosition === null) {
            return;
        }
        if (this.initialYPosition === null) {
            return;
        }
        let currentX = event.changedTouches[0].screenX;
        let currentY = event.changedTouches[0].screenY;
        this.diffX = this.initialXPosition - currentX;
        this.diffY = this.initialYPosition - currentY;
        const timeDiff = Date.now() - this.timeDown;

        // setTime out is going to control the swip speed
        setTimeout(() => {
            if (Math.abs(this.diffX) > Math.abs(this.diffY)) {
                // sliding horizontally
                if (timeDiff < Constants.SWIP_DOWN_TIME_THRESHOLD) {
                    if (this.diffX > 0) {
                        // swiped left
                        this.updateTetrisGameBoard("left");
                    } else {
                        // swiped right
                        this.updateTetrisGameBoard("right");
                    }
                }

            } else if(Math.abs(this.diffX) < Math.abs(this.diffY)) {
                // sliding vertically
                if (timeDiff < Constants.SWIP_DOWN_TIME_THRESHOLD) {
                    if (this.diffY < 0) {
                        // swip down
                        this.updateTetrisGameBoard("down");
                    }
                }
            }
        }, Constants.SLIDING_VELOCITY);
    }

    // Event Handler for touch end
    handleTouchEnd = (event) => {
        this.initialYPosition = null;
        this.diffY = null;
        this.initialXPosition = null;
        this.diffX = null;
        this.timeDown = 0;
    }

    componentDidMount() {
        let timerId;
        // here set Interval is required to update the tetris board with dropping blocks
        timerId = setInterval(
            () => this.updateTetrisGameBoard("down"),
            Constants.GAME_LOWEST_SPEED - (this.store.gameLevel > Constants.MAX_LEVEL ?
                Constants.GAME_HIGHEST_SPEED : this.store.gameLevel * 10)
        );
        updateTimerId(timerId);
        window.addEventListener("keydown", this.handleKeyDown, false);
        window.addEventListener("touchstart", this.handleTouchStart, false);
        window.addEventListener("touchmove", this.handleTouchMove, false);
        window.addEventListener("touchend", this.handleTouchEnd, false);
    }

    componentWillUnmount() {
        window.clearInterval(this.store.timerId);
        window.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("touchstart", this.handleTouchStart);
        document.removeEventListener("touchmove", this.handleTouchMove);
        document.removeEventListener("touchend", this.handleTouchEnd);
    }

    /**
     * @description Handles board updates
     * @param {string} command
     * @memberof TetrisGame
     */
    updateTetrisGameBoard(direction: string) {
        // Do nothing if game ends, or is paused or document has no focus or Game Expired
        if (this.store.gameStatus === GameStatus.End ||
            this.store.gameStatus === GameStatus.Paused ||
            this.store.gameStatus === GameStatus.Expired ||
            !document.hasFocus()) {
            return;
        }

        // Prepare variables for additions to x/y coordinates, current active block and new rotation
        // Logic Credit: https://blog.alexdevero.com/tetris-game-react-typescript/
        let xAdd = 0;
        let yAdd = 0;
        let rotateAdd = 0;
        let activeBlockNumber = this.store.activeBlockNumber;
        const noOfBlock = 4;

        // If block should move to the left, set xAdd to -1
        if (direction === "left") {
            xAdd = -1;
        }
        // If block should move to the right, set xAdd to 1
        if (direction === "right") {
            xAdd = 1;
        }
        // If block should be rotated, set rotateAdd to 1
        if (direction === "rotate") {
            rotateAdd = 1;
        }
        // If block should fall faster, set yAdd to 1
        if (direction === "down") {
            yAdd = 1;
        }

        // Get current x/y coordinates, active block, rotate and all blocks
        let tetrisGameGrid = cloneDeep(this.store.tetrisGameBoard);
        let xCoordinateOfActiveBlock = this.store.xCoordinateOfActiveBlock;
        let yCoordinateOfActiveTile = this.store.yCoordinateOfActiveBlock;
        let rotate = this.store.blockRotationNumber;
        const blocks = this.store.blocks;

        // Remove actual block from field to test for new insert position
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] = 0;
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] = 0;
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] = 0;
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] = 0;

        // Test if the move can be executed on actual field
        let xAddIsValid = true;
        const shadowMap = getShadowBlock(tetrisGameGrid);
        // check if block should move horizontally
        if (xAdd !== 0) {
            for (let block = 0; block < noOfBlock; block++) {
                // Test if block can be moved without getting outside the board
                if (
                    xCoordinateOfActiveBlock + xAdd + blocks[activeBlockNumber][rotate][block][0] >= 0
                    && xCoordinateOfActiveBlock + xAdd + blocks[activeBlockNumber][rotate][block][0] < Constants.BOARD_WIDTH
                ) {
                    if (tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][block][1]][xCoordinateOfActiveBlock
                        + xAdd + blocks[activeBlockNumber][rotate][block][0]] !== 0) {
                        // Prevent the move
                        xAddIsValid = false;
                    }
                } else {
                    // Prevent the move
                    xAddIsValid = false;
                }
            }
        }

        // If horizontal move is valid update x variable (move the block)
        if (xAddIsValid) {
            xCoordinateOfActiveBlock += xAdd;
        }

        // Try to rotate the block
        const maximumRotation = 3;
        let newRotate = rotate + rotateAdd > maximumRotation ? 0 : rotate + rotateAdd;
        let rotateIsValid = true;

        // Test if block should rotate
        if (rotateAdd !== 0) {
            for (let block = 0; block < noOfBlock; block++) {
                // Test if block can be rotated without getting outside the board
                if (
                    xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0] >= 0 &&
                    xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0] <= Constants.BOARD_HEIGHT &&
                    xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][1] >= 0 &&
                    xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][1] <= Constants.BOARD_HEIGHT
                ) {
                    // Test of block rotation is not blocked by other blocks
                    if (
                        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][newRotate][block][1]]
                        [xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0]
                        ] !== 0
                    ) {
                        // Prevent rotation
                        rotateIsValid = false;
                    }
                } else {
                    // Prevent rotation
                    rotateIsValid = false;
                }
            }
        }

        // If rotation is valid update rotate variable (rotate the block)
        if (rotateIsValid) {
            rotate = newRotate;
        }

        // Try to speed up the fall of the block
        let yAddIsValid = true;

        // Test if block should fall faster
        if (yAdd !== 0) {
            for (let i = 0; i < noOfBlock; i++) {
                // Test if block can fall faster without getting outside the board
                if (
                    yCoordinateOfActiveTile + yAdd + blocks[activeBlockNumber][rotate][i][1] >= 0 &&
                    yCoordinateOfActiveTile + yAdd + blocks[activeBlockNumber][rotate][i][1] < Constants.BOARD_HEIGHT
                ) {
                    // Test if faster fall is not blocked by other blocks
                    if (
                        tetrisGameGrid[yCoordinateOfActiveTile + yAdd + blocks[activeBlockNumber][rotate][i][1]][
                            xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][i][0]
                        ] !== 0
                    ) {
                        // Prevent faster fall
                        yAddIsValid = false;
                    }
                } else {
                    // Prevent faster fall
                    yAddIsValid = false;
                }
            }
        }

        // If speeding up the fall is valid (move the block down faster)
        if (yAddIsValid) {
            yCoordinateOfActiveTile += yAdd;
        }

        // Render the block at new position
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] = activeBlockNumber;
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] = activeBlockNumber;
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] = activeBlockNumber;
        tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] = activeBlockNumber;

        // If moving down is not possible, remove completed rows add score
        // and find next block and check if game is over
        if (!yAddIsValid) {
            for (let row = Constants.BOARD_HEIGHT - 1; row >= 0; row--) {
                let isLineCompleted = true;

                // Check if row is completed
                for (let column = 0; column < Constants.BOARD_WIDTH; column++) {
                    if (tetrisGameGrid[row][column] === 0) {
                        isLineCompleted = false;
                    }
                }

                // Remove completed rows
                if (isLineCompleted) {
                    for (; row > 0; row--) {
                        for (let column = 0; column < Constants.BOARD_WIDTH; column++) {
                            tetrisGameGrid[row][column] = tetrisGameGrid[row - 1][column];
                        }
                    }

                    // Check if the row is the last
                    row = Constants.BOARD_HEIGHT;
                    // update score,  change level
                    updateGameScore(this.store.gameScore + Constants.SCORE_INCREMENT_FACTOR * this.store.gameLevel);
                    updateGameLevel(this.store.gameLevel + 1);
                }
            }
            // Prepare new timer
            let timerId;
            // Reset the timer
            clearInterval(this.store.timerId);
            // Update new timer
            timerId = setInterval(
                () => this.updateTetrisGameBoard("down"),
                Constants.GAME_LOWEST_SPEED - (this.store.gameLevel > Constants.MAX_LEVEL ?
                    Constants.GAME_HIGHEST_SPEED : this.store.gameLevel * 10)
            );
            // Update timer
            updateTimerId(timerId);
            // Create new Block
            activeBlockNumber = Math.floor(Math.random() * Constants.NUMBER_OF_BLOCK + 1);
            xCoordinateOfActiveBlock = Constants.BOARD_WIDTH / 2;
            yCoordinateOfActiveTile = 1;
            rotate = 0;

            // Test if game is over - test if new block can't be placed in field
            if (
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] !== 0 ||
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] !== 0 ||
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] !== 0 ||
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] !== 0
            ) {
                setGameProgress(GameStatus.End);
            } else {
                // Otherwise, render new block and continue
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] = activeBlockNumber;
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] = activeBlockNumber;
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] = activeBlockNumber;
                tetrisGameGrid[yCoordinateOfActiveTile + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] = activeBlockNumber;
            }
        }
        // Update GameBoard, Active X and Y coordinates, rotation and active Block 
        updateTetrisGameBoard(tetrisGameGrid);
        updateXYCoordinateOfActiveBlock(xCoordinateOfActiveBlock, yCoordinateOfActiveTile);
        updateRotation(rotate);
        updateActiveBlockNumber(activeBlockNumber);
        updateShadowPiece(shadowMap);
    }

    render() {
        return (
            <div className="tetris body-container" id="focus">
                { this.store.gameStatus === GameStatus.End ?
                    <GameEndView score={this.store.gameScore} onlyOneAttempt={false} /> :
                    <TetrisBoard />
                }
            </div>
        );
    }
}

export default TetrisGame;