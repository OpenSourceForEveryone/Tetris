// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { PauseIcon, PlayIcon, Reaction } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { setGameStatus } from "../../actions/TetrisGameAction";
import getStore, { GameStatus } from "../../store/TetrisGameStore";
import {Utils} from "../../utils/Utils";

/**
 * <TetrisGameBoard> component for tetris game board
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class TetrisGameBoard extends React.Component {
  render() {
    const store = getStore();
    let tetrisGamerows: any[] = [];
    // Copy the reference type
    // Get the clone of the current tetris board
    let copyOfTetrisBoardGrid = Utils.cloneDeep(getStore().tetrisGameBoard);
    const ghostPiece = getStore().shadowPiece;

    // flag the cell with -1 to represent the shadow piece and later we will use this flag to render shadow block
    if (ghostPiece) {
      for (let block of [...ghostPiece]) {
        copyOfTetrisBoardGrid[block.y][block.x] = - 1;
      }
    }
    copyOfTetrisBoardGrid.forEach((row, index) => {
      // Create board columns
      // column 0 represents regular block
      // column -1 represetns shadow block
      // otherwise already placed block
      const cols = row.map((column: any, index: number) =>
        <div
          className={column == 0 ? `column-blank` : column == -1 ? `column-shadow` : `column-block`}
          key={index}
        />);
      tetrisGamerows.push(<div className="tetris-board__row" key={index}>{cols}</div>);
    });

    return (
      <>
        <div className="game-clear-both"></div>
        <div className="tetris-board" id="focus">
          <div className="tetris-board-board" >
            <div className="tetris-header-box">
              <p className="tetris-board-text">{Localizer.getString("Score")} {store.gameScore}</p>
              <Reaction tabIndex={1}
                onClick={
                  () => {
                    if (store.gameStatus == GameStatus.Paused) {
                      setGameStatus(GameStatus.InProgress);
                    } else {
                      setGameStatus(GameStatus.Paused);
                    }
                  }
                }
                icon={store.gameStatus === GameStatus.Paused ?
                  <PlayIcon size="large" className="action-button-color" /> :
                  <PauseIcon size="large" className="action-button-color" />
                }
              />
            </div>
            <div className="game-clear-both">
            </div>
            {tetrisGamerows}
          </div>
        </div>
      </>
    );
  }
}
