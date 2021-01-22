// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import { GameStatus } from "../store/TetrisGameStore";


export enum TetrisGameAction {
    initialize = "initialize",
    updateGameScore = "updateGameScore",
    updateShadowPiece = "updateShadowPiece",
    setGameProgress = "setGameProgress",
    updateTimerId = "updateGameStatus",
    updateTetrisGameBoard = "updateTetrisGameBoard",
    updateRotation = "updateRotation",
    updateActiveBlockNumber = "updateActiveBlockNumber",
    updateXYCoordinateOfActiveBlock = "updateXYCoordinateOfActiveBlock",
    updateGameLevel = "updateGameLevel"
}

export let initialize = action(TetrisGameAction.initialize);

export let setGameProgress = action(TetrisGameAction.setGameProgress, (status: Partial<GameStatus>) => ({
    status: status
}));

export let updateTimerId = action(TetrisGameAction.updateTimerId, (id: any) => ({
    id: id
}));

export let updateTetrisGameBoard = action(TetrisGameAction.updateTetrisGameBoard, (board: any[]) => ({
    board: board
}));

export let updateShadowPiece = action(TetrisGameAction.updateShadowPiece, (piece: any[]) => ({
    piece: piece
}));

export let updateGameScore = action(TetrisGameAction.updateGameScore, (score: number) => ({
    score: score
}));

export let updateRotation = action(TetrisGameAction.updateRotation, (rotation: number) => ({
    rotation: rotation
}));

export let updateActiveBlockNumber = action(TetrisGameAction.updateActiveBlockNumber, (blockNumber: number) => ({
    blockNumber: blockNumber
}));

export let updateXYCoordinateOfActiveBlock = action(TetrisGameAction.updateXYCoordinateOfActiveBlock,
    (xCoordinate: number, yCoordinate: number) => ({
        xCoordinate: xCoordinate,
        yCoordinate: yCoordinate
    }));

export let updateGameLevel = action(TetrisGameAction.updateGameLevel, (level: number) => ({
    level: level
}));