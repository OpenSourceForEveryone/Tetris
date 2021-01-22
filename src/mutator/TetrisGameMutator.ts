import { mutator } from "satcheljs";
import getStore from "../store/TetrisGameStore";
import {setGameProgress,
    updateTimerId,
    updateTetrisGameBoard,
    updateShadowPiece,
    updateGameScore,
    updateRotation,
    updateXYCoordinateOfActiveBlock,
    updateGameLevel,
    updateActiveBlockNumber
} from "../actions/TetrisGameAction";

mutator(setGameProgress, (msg) => {
    const store = getStore();
    store.gameStatus = msg.status;
});

mutator(updateTimerId, (msg) => {
    const store = getStore();
    store.timerId = msg.id;
});

mutator(updateTetrisGameBoard, (msg) => {
    const store = getStore();
    store.tetrisGameBoard = msg.board;
});

mutator(updateShadowPiece, (msg) => {
    const store = getStore();
    store.shadowPiece = msg.piece;
});

mutator(updateGameScore, (msg) => {
    const store = getStore();
    store.gameScore = msg.score;
});

mutator(updateRotation, (msg) => {
    const store = getStore();
    store.blockRotationNumber = msg.rotation;
});

mutator(updateXYCoordinateOfActiveBlock, (msg) => {
    const store = getStore();
    store.xCoordinateOfActiveBlock = msg.xCoordinate;
    store.yCoordinateOfActiveBlock = msg.yCoordinate;
});

mutator(updateGameLevel, (msg) => {
    const store = getStore();
    store.gameLevel = msg.level;
});

mutator(updateActiveBlockNumber, (msg) => {
    const store = getStore();
    store.activeBlockNumber = msg.blockNumber;
});