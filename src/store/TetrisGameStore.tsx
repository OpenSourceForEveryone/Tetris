// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import "../mutator/TetrisGameMutator";
import { Constants } from "../utils/Constants";
import { initializeGameBoard } from "../components/Response/GameUtils/TetrisUtils";

// This represents the various stages of Tetris game in response view
export enum GameStatus {
    NotStarted,
    InProgress,
    End,
    Paused,
    Expired
}

interface ITetrisGameStore {
   gameStatus: GameStatus;
   xCoordinateOfActiveBlock: number;
   yCoordinateOfActiveBlock: number;
   activeBlockNumber: number;
   blockRotationNumber: number;
   gameScore: number;
   gameLevel: number;
   blockCount: number;
   tetrisGameBoard: number[][];
   timerId: number;
   blocks: number[][][][];
   shadowPiece: any[];
   isGameInstructionPageVisible: boolean;
}

// This store holds the model for Tetris game component
const store: ITetrisGameStore = {
   gameStatus: GameStatus.NotStarted,
   xCoordinateOfActiveBlock: Math.floor(Constants.BOARD_WIDTH / 2) - 1,
   yCoordinateOfActiveBlock: 1,
   activeBlockNumber: Math.floor(Math.random() * Constants.NUMBER_OF_BLOCK + 1),
   blockRotationNumber: 0,
   gameLevel: 1,
   gameScore: 0,
   blockCount: 0,
   blocks: Constants.BLOCKS,
   shadowPiece: null,
   tetrisGameBoard: initializeGameBoard(),
   timerId : 0,
   isGameInstructionPageVisible: false,
};

export default createStore<ITetrisGameStore>("TetrisGameStore", store);