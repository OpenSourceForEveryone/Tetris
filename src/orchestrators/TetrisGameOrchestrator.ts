// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { orchestrator } from "satcheljs";
import { initialize } from "../actions/TetrisGameAction";
import { Constants } from "../utils/Constants";
import getStore from "../store/TetrisGameStore";

orchestrator(initialize, async () => {
    getStore().tetrisGameBoard = defautGameBoard();
});

function defautGameBoard() {
    let gameBoardGrid = [];
    for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
        let rowData = [];
        for (let column = 0; column < Constants.BOARD_WIDTH; column++) {
            rowData.push(0);
        }
        gameBoardGrid.push(rowData);
    }
    return gameBoardGrid;
}