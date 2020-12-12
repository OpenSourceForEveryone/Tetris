import * as React from 'react'
import CongratulationView from '../CongrtulationView'
// Define props for TetrisBoard component
type TetrisBoardProps = {
  field: any[],
  gameOver: boolean,
  score: number,
  rotate: number
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

  return (
    <>
      {props.gameOver ?
        <CongratulationView gameScore={props.score} shouldShowAlert="false" />
        :
        <div className="tetris-board body-container">
          <div className="tetris-board__info">
            <p className="tetris-board__text">Score: {props.score}</p>
          </div>
          <div className="tetris-board__board">{rows}</div>
        </div>
      }
    </>
  )
}

export default TetrisBoard