// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import CongratulationView from "../CongrtulationView";
import { PauseIcon, PlayIcon, Reaction } from "@fluentui/react-northstar";
import cloneDeep from "lodash.clonedeep";

// Define props for TetrisBoard component
type TetrisBoardProps = {
  field: any[],
  gameOver: boolean,
  score: number,
  rotate: number,
  onClickHandler: any,
  isPaused: boolean,
  ghost?: any[]
};

// Create TetrisBoard component
const tetrisBoard: React.FC<TetrisBoardProps> = (props) => {
  // Create board rows
  let rows: any[] = [];
  let copy = cloneDeep(props.field);
  const ghostPiece = props.ghost;

  if(ghostPiece) {
    for(let block of [...ghostPiece]) {
      copy[block.y][block.x] = - 1;
    }
  }

  copy.forEach((row, index) => {
    // Create board columns
    const cols = row.map((column: any, index: number) => <div className={column != -1 ? `col-${column}` : `col-8`} key={index} />);
    rows.push(<div className="tetris-board__row" key={index}>{cols}</div>);
  });

  copy = [];

  React.useEffect(() => {
    document.getElementById("focus").tabIndex = 0;
    document.getElementById("focus").focus();
  });

  return (
    <>
      {props.gameOver ?
        <CongratulationView gameScore={props.score} shouldShowAlert="false" />
        :
        <>
          <div style={{ clear: "both" }}></div>
          <div className="tetris-board" id="focus">
            <div className="tetris-board__board" >
              <div className="tetris-header-box">
                <p className="tetris-board__text">Score {props.score}</p>
                <Reaction tabIndex={1}
                  onClick={props.onClickHandler}
                  icon={props.isPaused ?
                    <PlayIcon size="large" style={{ color: "#212121" }} /> :
                    <PauseIcon size="large" style={{ color: "#212121" }} />}
                />
              </div>
              <div style={{clear:"both" }} >
              </div>
                {rows}
              </div>
          </div>
        </>

      }
    </>
  );
};

export default tetrisBoard;