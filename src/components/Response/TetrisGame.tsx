import * as React from "react";
import TetrisBoard from "./GameBoard";
import { UxUtils } from "../../utils/UxUtils";
import "./TetrisGame.scss";
import { Constants } from "../../utils/Constants";
import GameEndView from "./GameEndView";

// props for Tetris component
type TetrisProps = {
    boardWidth: any,
    boardHeight: any,
    tabIndex?: number
};

// props for Tetris component state
type TetrisState = {
    activeTileX: number,
    activeTileY: number,
    activeTile: number,
    tileRotate: number,
    score: number,
    level: number,
    tileCount: number,
    gameOver: boolean,
    isPaused: boolean,
    field: any[],
    timerId: any,
    tiles: number[][][][],
    ghostPiece: any[];
};

// Create component for Tetris Game
class TetrisGame extends React.Component<TetrisProps, TetrisState> {

    private initialXPosition = null;
    private initialYPosition = null;
    constructor(props: any) {
        super(props);

        // Generate board based on number of boardHeight & boardWidth props
        let field = [];
        for (let row = 0; row < props.boardHeight; row++) {
            let rowData = [];
            for (let column = 0; column < props.boardWidth; column++) {
                rowData.push(0);
            }
            field.push(rowData);
        }

        // Set starting column to center
        let xStart = Math.floor(parseInt(props.boardWidth) / 2);

        // Initialize state with starting conditions
        this.state = {
            activeTileX: xStart, // new tile will fall from middle of the tetris board
            activeTileY: 1, // initial y coordinate of the tile 
            activeTile: Math.floor(Math.random() * 7 + 1), // block will be picked on random from 1 to 7
            tileRotate: 0,
            score: 0,
            level: 1,
            tileCount: 0,
            gameOver: false,
            isPaused: false,
            field: field,
            timerId: null,
            ghostPiece: null,
            tiles: Constants.TILES
        };
    }

    // Key Press Handler
    handleKeyDown = (event) => {
        const key = { ...Constants.KEY_MAP };
        switch (event.keyCode) {
            case key.UP:
                this.handleBoardUpdate("rotate");
                break;
            case key.DOWN:
                this.handleBoardUpdate("down");
                break;
            case key.LEFT:
                this.handleBoardUpdate("left");
                break;
            case key.RIGHT:
                this.handleBoardUpdate("right");
                break;
            case key.SPACE:
                this.handlePauseClick();
        }
    }

    // Event handle for start touch
    handleTouchStart = (event) => {
        event.preventDefault();
        this.initialXPosition = event.touches[0].clientX;
        this.initialYPosition = event.touches[0].clientY;
    }

    // Event handler for touch events like swipes(left, right, top and down)
    handleTouchMove = (event) => {

        if (this.initialXPosition === null) {
            return;
        }
        if (this.initialYPosition === null) {
            return;
        }
        let currentX = event.touches[0].clientX;
        let currentY = event.touches[0].clientY;
        let diffX = this.initialXPosition - currentX;
        let diffY = this.initialYPosition - currentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // sliding horizontally
            if (diffX > 0) {
                // swiped left
                this.handleBoardUpdate("left");

            } else {
                // swiped right
                this.handleBoardUpdate("right");
            }
        } else {
            // sliding vertically
            if (diffY < 0) {
                // swip down
                this.handleBoardUpdate("down");
            }
        }
        this.initialXPosition = null;
        this.initialYPosition = null;
        event.preventDefault();
    }

    /**
     * @description Sets timer after component mounts
     * and executes handleBoardUpdate() set to 'down' method during each interval
     * @memberof TetrisGame
     */
    componentDidMount() {

        let timerId;
        timerId = window.setInterval(
            () => this.handleBoardUpdate("down"),
            Constants.GAME_SPEED
        );

        this.setState({
            timerId: timerId
        });

        window.addEventListener("keydown", this.handleKeyDown, false);
        window.addEventListener("touchstart", this.handleTouchStart, false);
        window.addEventListener("touchmove", this.handleTouchStart, false);
    }

    /**
     * @description Resets the timer when component unmounts
     * @memberof Tetris
     */
    componentWillUnmount() {
        window.clearInterval(this.state.timerId);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("touchstart", this.handleTouchStart);
        document.removeEventListener("touchmove", this.handleTouchStart);
    }

    /**
     * @description Handles board updates
     * @param {string} command
     * @memberof TetrisGame
     */
    handleBoardUpdate(command: string) {
        // Do nothing if game ends, or is paused or document has no focus
        if (this.state.gameOver || this.state.isPaused || !document.hasFocus()) {
            return;
        }

        // Prepare variables for additions to x/y coordinates, current active tile and new rotation
        let xAdd = 0;
        let yAdd = 0;
        let rotateAdd = 0;
        let tile = this.state.activeTile;

        // If tile should move to the left
        // set xAdd to -1
        if (command === "left") {
            xAdd = -1;
        }

        // If tile should move to the right
        // set xAdd to 1
        if (command === "right") {
            xAdd = 1;
        }

        // If tile should be rotated
        // set rotateAdd to 1
        if (command === "rotate") {
            rotateAdd = 1;
        }

        // If tile should fall faster
        // set yAdd to 1
        if (command === "down") {
            yAdd = 1;
        }

        // Get current x/y coordinates, active tile, rotate and all tiles
        let field = this.state.field;
        let xCoordinateOfActiveTile = this.state.activeTileX;
        let yCoordinateOfActiveTile = this.state.activeTileY;
        let rotate = this.state.tileRotate;

        const tiles = this.state.tiles;

        // Remove actual tile from field to test for new insert position
        field[yCoordinateOfActiveTile + tiles[tile][rotate][0][1]][xCoordinateOfActiveTile + tiles[tile][rotate][0][0]] = 0;
        field[yCoordinateOfActiveTile + tiles[tile][rotate][1][1]][xCoordinateOfActiveTile + tiles[tile][rotate][1][0]] = 0;
        field[yCoordinateOfActiveTile + tiles[tile][rotate][2][1]][xCoordinateOfActiveTile + tiles[tile][rotate][2][0]] = 0;
        field[yCoordinateOfActiveTile + tiles[tile][rotate][3][1]][xCoordinateOfActiveTile + tiles[tile][rotate][3][0]] = 0;

        // Test if the move can be executed on actual field
        let xAddIsValid = true;

        // Find Projection or ghost tile
        let currentBlock = [
            { xCord: xCoordinateOfActiveTile + tiles[tile][rotate][0][0], yCord: yCoordinateOfActiveTile + tiles[tile][rotate][0][1] },
            { xCord: xCoordinateOfActiveTile + tiles[tile][rotate][1][0], yCord: yCoordinateOfActiveTile + tiles[tile][rotate][1][1] },
            { xCord: xCoordinateOfActiveTile + tiles[tile][rotate][2][0], yCord: yCoordinateOfActiveTile + tiles[tile][rotate][2][1] },
            { xCord: xCoordinateOfActiveTile + tiles[tile][rotate][3][0], yCord: yCoordinateOfActiveTile + tiles[tile][rotate][3][1] },
        ];
        // sort the block with y coordinate
        const movingBlock = currentBlock.sort((first, second) => {
            return Number(second.yCord) - Number(first.yCord);
        });

        let cordinateMap = new Map<number, number[]>();
        for (let level of movingBlock) {
            if (!cordinateMap.has(level.yCord)) {
                cordinateMap.set(level.yCord, [level.xCord]);
            } else {
                let xCoordinates: number[] = cordinateMap.get(level.yCord) || [];
                xCoordinates.push(level.xCord);
                cordinateMap.set(level.yCord, xCoordinates);
            }
        }
        let shadowMap: any[] = [];
        // find it from lower level
        for (let row = this.props.boardHeight - 1; row >= 0; row--) {
            let isXValid = true;
            let level = 0;
            let tileHeight = cordinateMap.size;
            for (let key of cordinateMap.keys()) {

                // avoid collision
                if ((row - level - key) <= tileHeight) { break; }

                const xCoordinates = cordinateMap.get(key);
                // validate the Game Level
                let isLevelValid = true;
                for (let xCoordinate of xCoordinates) {
                    for (let test = row - level; test >= 0; test--) {
                        if (field[test][xCoordinate] != 0) {
                            isLevelValid = false;
                            break;
                        }
                    }
                }
                // If the levels are not cleared, start from new level
                if (!isLevelValid) { break; }
                for (let xCoordinate of xCoordinates) {
                    if (field[row - level][xCoordinate] != 0) {
                        isXValid = false;
                        shadowMap = [];
                        break;
                    } else {
                        shadowMap.push({ x: xCoordinate, y: (row - level) });
                    }
                }
                level++;
                if (!isXValid) { break; }
            }
            if (level == cordinateMap.size && isXValid) {
                break;
            } else {
                shadowMap = [];
            }
        }

        // Test if tile should move horizontally
        if (xAdd !== 0) {
            for (let i = 0; i <= 3; i++) {
                // Test if tile can be moved without getting outside the board
                if (
                    xCoordinateOfActiveTile + xAdd + tiles[tile][rotate][i][0] >= 0
                    && xCoordinateOfActiveTile + xAdd + tiles[tile][rotate][i][0] < this.props.boardWidth
                ) {
                    if (field[yCoordinateOfActiveTile + tiles[tile][rotate][i][1]][xCoordinateOfActiveTile
                        + xAdd + tiles[tile][rotate][i][0]] !== 0) {
                        // Prevent the move
                        xAddIsValid = false;
                    }
                } else {
                    // Prevent the move
                    xAddIsValid = false;
                }
            }
        }

        // If horizontal move is valid update x variable (move the tile)
        if (xAddIsValid) {
            xCoordinateOfActiveTile += xAdd;
        }

        // Try to rotate the tile
        let newRotate = rotate + rotateAdd > 3 ? 0 : rotate + rotateAdd;
        let rotateIsValid = true;

        // Test if tile should rotate
        if (rotateAdd !== 0) {
            for (let i = 0; i <= 3; i++) {
                // Test if tile can be rotated without getting outside the board
                if (
                    xCoordinateOfActiveTile + tiles[tile][newRotate][i][0] >= 0 &&
                    xCoordinateOfActiveTile + tiles[tile][newRotate][i][0] <= this.props.boardWidth &&
                    yCoordinateOfActiveTile + tiles[tile][newRotate][i][1] >= 0 &&
                    yCoordinateOfActiveTile + tiles[tile][newRotate][i][1] < this.props.boardHeight
                ) {
                    // Test of tile rotation is not blocked by other tiles
                    if (
                        field[yCoordinateOfActiveTile + tiles[tile][newRotate][i][1]][
                        xCoordinateOfActiveTile + tiles[tile][newRotate][i][0]
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

        // If rotation is valid update rotate variable (rotate the tile)
        if (rotateIsValid) {
            rotate = newRotate;
        }

        // Try to speed up the fall of the tile
        let yAddIsValid = true;

        // Test if tile should fall faster
        if (yAdd !== 0) {
            for (let i = 0; i <= 3; i++) {
                // Test if tile can fall faster without getting outside the board
                if (
                    yCoordinateOfActiveTile + yAdd + tiles[tile][rotate][i][1] >= 0 &&
                    yCoordinateOfActiveTile + yAdd + tiles[tile][rotate][i][1] < this.props.boardHeight
                ) {
                    // Test if faster fall is not blocked by other tiles
                    if (
                        field[yCoordinateOfActiveTile + yAdd + tiles[tile][rotate][i][1]][
                        xCoordinateOfActiveTile + tiles[tile][rotate][i][0]
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

        // If speeding up the fall is valid (move the tile down faster)
        if (yAddIsValid) {
            yCoordinateOfActiveTile += yAdd;
        }

        // Render the tile at new position
        field[yCoordinateOfActiveTile + tiles[tile][rotate][0][1]][xCoordinateOfActiveTile + tiles[tile][rotate][0][0]] = tile;
        field[yCoordinateOfActiveTile + tiles[tile][rotate][1][1]][xCoordinateOfActiveTile + tiles[tile][rotate][1][0]] = tile;
        field[yCoordinateOfActiveTile + tiles[tile][rotate][2][1]][xCoordinateOfActiveTile + tiles[tile][rotate][2][0]] = tile;
        field[yCoordinateOfActiveTile + tiles[tile][rotate][3][1]][xCoordinateOfActiveTile + tiles[tile][rotate][3][0]] = tile;

        // If moving down is not possible, remove completed rows add score
        // and find next tile and check if game is over
        if (!yAddIsValid) {
            for (let row = this.props.boardHeight - 1; row >= 0; row--) {
                let isLineComplete = true;

                // Check if row is completed
                for (let column = 0; column < this.props.boardWidth; column++) {
                    if (field[row][column] === 0) {
                        isLineComplete = false;
                    }
                }

                // Remove completed rows
                if (isLineComplete) {
                    for (let yRowSrc = row; row > 0; row--) {
                        for (let column = 0; column < this.props.boardWidth; column++) {
                            field[row][column] = field[row - 1][column];
                        }
                    }
                    // Check if the row is the last
                    row = this.props.boardHeight;
                    this.setState(prev => ({
                        score: prev.score + Constants.SCORE_INCREMENT_FACTOR
                    }));
                }
            }

            // Update state - update number of tiles, change level
            this.setState(prev => ({
                tileCount: prev.tileCount + 1,
                level: 1 + Math.floor(prev.tileCount / 10)
            }));

            // Prepare new timer
            let timerId;

            // Reset the timer
            clearInterval(this.state.timerId);

            // Update new timer
            timerId = setInterval(
                () => this.handleBoardUpdate("down"),
                Constants.GAME_SPEED
            );

            // Use new timer
            this.setState({
                timerId: timerId
            });

            // Create new tile
            tile = Math.floor(Math.random() * 7 + 1);
            xCoordinateOfActiveTile = parseInt(this.props.boardWidth) / 2;
            yCoordinateOfActiveTile = 1;
            rotate = 0;

            // Test if game is over - test if new tile can't be placed in field
            if (
                field[yCoordinateOfActiveTile + tiles[tile][rotate][0][1]][xCoordinateOfActiveTile + tiles[tile][rotate][0][0]] !== 0 ||
                field[yCoordinateOfActiveTile + tiles[tile][rotate][1][1]][xCoordinateOfActiveTile + tiles[tile][rotate][1][0]] !== 0 ||
                field[yCoordinateOfActiveTile + tiles[tile][rotate][2][1]][xCoordinateOfActiveTile + tiles[tile][rotate][2][0]] !== 0 ||
                field[yCoordinateOfActiveTile + tiles[tile][rotate][3][1]][xCoordinateOfActiveTile + tiles[tile][rotate][3][0]] !== 0
            ) {
                // Stop the game
                this.setState({
                    gameOver: true
                });
            } else {
                // Otherwise, render new tile and continue
                field[yCoordinateOfActiveTile + tiles[tile][rotate][0][1]][xCoordinateOfActiveTile + tiles[tile][rotate][0][0]] = tile;
                field[yCoordinateOfActiveTile + tiles[tile][rotate][1][1]][xCoordinateOfActiveTile + tiles[tile][rotate][1][0]] = tile;
                field[yCoordinateOfActiveTile + tiles[tile][rotate][2][1]][xCoordinateOfActiveTile + tiles[tile][rotate][2][0]] = tile;
                field[yCoordinateOfActiveTile + tiles[tile][rotate][3][1]][xCoordinateOfActiveTile + tiles[tile][rotate][3][0]] = tile;
            }
        }
        // Update state - use new field, active x/y coordinates, rotation and activeTile
        this.setState({
            field: field,
            activeTileX: xCoordinateOfActiveTile,
            activeTileY: yCoordinateOfActiveTile,
            tileRotate: rotate,
            activeTile: tile,
            ghostPiece: shadowMap
        });
    }

    /**
     * @description Stops and resumes the game
     * @memberof TetrisGame
     */
    handlePauseClick = () => {
        this.setState(prev => ({
            isPaused: !prev.isPaused
        }));
    }

    /**
     * @description Resets the game
     * @memberof TetrisGame
     */
    handleNewGameClick = () => {
        // Create an empty board
        let field: any[] = [];
        for (let row = 0; row < this.props.boardHeight; row++) {
            let rowData = [];
            for (let column = 0; column < this.props.boardWidth; column++) {
                rowData.push(0);
            }
            field.push(rowData);
        }

        // Set starting column to center
        let xStart = Math.floor(parseInt(this.props.boardWidth) / 2);

        // Initialize state with starting conditions
        this.setState({
            activeTileX: xStart,
            activeTileY: 0,
            activeTile: Math.floor(Math.random() * 7 + 1),
            tileRotate: 0,
            score: 0,
            level: 1,
            tileCount: 0,
            gameOver: false,
            field: field,
        });
    }

    render() {
        return (
            <div className="tetris body-container" id="focus" onClick={
                () => {
                    if (UxUtils.renderingForMobile()) {
                        this.handleBoardUpdate("rotate");
                    }
                }
            } >
                {this.state.gameOver ? <GameEndView gameScore={this.state.score} shouldShowAlert="false" /> :
                    <TetrisBoard
                        field={this.state.field}
                        gameOver={this.state.gameOver}
                        score={this.state.score}
                        rotate={this.state.tileRotate}
                        onClickHandler={this.handlePauseClick}
                        isPaused={this.state.isPaused}
                        ghost={this.state.ghostPiece}
                    />
                }
            </div>
        );
    }
}

export default TetrisGame;