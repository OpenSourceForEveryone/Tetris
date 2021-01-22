// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import "../mutator/TetrisGameMutator";
import "../orchestrators/TetrisGameOrchestrator";
import { Constants } from "../utils/Constants";

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
   tetrisGameBoard: any[];
   timerId: any;
   blocks: number[][][][];
   shadowPiece: any[];
}

const store: ITetrisGameStore = {
   gameStatus: GameStatus.NotStarted,
   xCoordinateOfActiveBlock: Math.floor(Constants.BOARD_WIDTH / 2),
   yCoordinateOfActiveBlock: 1,
   activeBlockNumber: Math.floor(Math.random() * Constants.NUMBER_OF_BLOCK + 1),
   blockRotationNumber: 0,
   gameLevel: 1,
   gameScore: 0,
   blockCount: 0,
   blocks: Constants.BLOCKS,
   shadowPiece: null,
   tetrisGameBoard: null,
   timerId : null,
};

export default createStore<ITetrisGameStore>("TetrisGameStore", store);