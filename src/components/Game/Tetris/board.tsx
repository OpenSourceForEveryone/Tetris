import * as React from 'react'
import CongratulationView from '../CongrtulationView'
import { PauseIcon, PlayIcon, Reaction } from '@fluentui/react-northstar'
// Define props for TetrisBoard component
type TetrisBoardProps = {
  field: any[],
  gameOver: boolean,
  score: number,
  rotate: number,
  onClickHandler: any,
  isPaused: boolean, 
}

// Create TetrisBoard component
const TetrisBoard: React.FC<TetrisBoardProps> = (props) => {
  // Create board rows
  let rows: any[] = []

  props.field.forEach((row, index) => {
    // Create board columns
    const cols = row.map((column: any, index: number) => <div className={`col-${column}`} key={index} />)
    rows.push(<div className="tetris-board__row" key={index}>{cols}</div>)
  })

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
          <div style={{ clear: 'both' }}></div>
          <div className="tetris-board" id="focus">
            <div className="tetris-board__board" >
              <div className="tetris-header-box">
                <p className="tetris-board__text">Score {props.score}</p>
                <Reaction
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
  )
}

export default TetrisBoard