// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { PauseIcon, PlayIcon, Reaction } from "@fluentui/react-northstar";
import cloneDeep from "lodash.clonedeep";
import { Localizer } from "../../utils/Localizer";
import { initialize, setGameProgress } from "../../actions/TetrisGameAction";
import getStore, { GameStatus } from "../../store/TetrisGameStore";

/**
 * <TetrisGameBoard> component for tetris game board
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class TetrisGameBoard extends React.Component<any, any> {
  constructor(props) {
    super(props);
    initialize();
  }

  render() {
    const store = getStore();
    let TetrisGamerows: any[] = [];
    let copyOfTetrisBoardGrid = cloneDeep(getStore().tetrisGameBoard);
    const ghostPiece = getStore().shadowPiece;
    if (ghostPiece) {
      for (let block of [...ghostPiece]) {
        copyOfTetrisBoardGrid[block.y][block.x] = - 1;
      }
    }
    copyOfTetrisBoardGrid.forEach((row, index) => {
      // Create board columns
      const cols = row.map((column: any, index: number) =>
        <div
          className={column == 0 ? `column-blank` : column == -1 ? `column-shadow` : `column-block`}
          key={index}
        />);
        TetrisGamerows.push(<div className="tetris-board__row" key={index}>{cols}</div>);
    });

    return (
      <>
        <div className="game-clear-both"></div>
        <div className="tetris-board" id="focus">
          <div className="tetris-board__board" >
            <div className="tetris-header-box">
              <p className="tetris-board__text">{Localizer.getString("Score")} {store.gameScore}</p>
              <Reaction tabIndex={1}
                onClick={
                  () => {
                    if (store.gameStatus == GameStatus.Paused) {
                      setGameProgress(GameStatus.InProgress);
                    } else {
                      setGameProgress(GameStatus.Paused);
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
            {TetrisGamerows}
          </div>
        </div>
      </>
    );
  }
}
