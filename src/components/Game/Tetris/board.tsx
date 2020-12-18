import * as React from 'react'
import CongratulationView from '../CongrtulationView'
import { PauseIcon, PlayIcon, Reaction } from '@fluentui/react-northstar'
import {ProjectedPiece} from "./Tetris"
// Define props for TetrisBoard component
type TetrisBoardProps = {
  field: any[],
  gameOver: boolean,
  score: number,
  rotate: number,
  onClickHandler: any,
  isPaused: boolean,
  height?: number,
  width?: number,
  tile?: number,
  xCord?: number,
  yCord?: number,
  piece: ProjectedPiece
}

// Create TetrisBoard component
const TetrisBoard: React.FC<TetrisBoardProps> = (props) => {
  // Create board rows
  let rows: any[] = []

  // console.log("projected piece");

  // const ProjectedPiece = {...props.piece}
  // ProjectedPiece.grid = TilesMap[ProjectedPiece.tile-1];
  // const grid = props.field
  // const coordinate = getProjectionCoordinate(grid, ProjectedPiece);
  // console.log(coordinate); 
  //console.log(TilesMap[props.piece.tile]);
  
  
  
  props.field.forEach((row, index) => {
    // Create board columns
    const cols = row.map((column: any, index: number) => <div className={column != -1 ? `col-${column}` : `col-8`} key={index} />)
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

function getProjectionCoordinate(grid, piece) {

	let previousCordinate = []
	let coordinate = []

	for (let virtualY = piece.posY; virtualY < grid.length; virtualY++) { 

		previousCordinate = coordinate
		coordinate = []

		for (let y = 0; y < piece.grid.length; y++) {
			for (let x = 0; x < piece.grid[0].length; x++) {
				if (piece.grid[y][x] > 0) { 

					if (grid[y + virtualY] == 0) { 
						return previousCordinate
					}

					if (grid[y + virtualY][x + piece.posX] > 0) { 
						return previousCordinate
					}

					coordinate.push( (y + virtualY) + "_" + (x + piece.posX) )
				}
			}
		}
	}
	return coordinate
}


const TilesMap = [
  [
    [1,1],
		[1,1]
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],

  [
    [0,0,0],
		[0,1,0],
		[1,1,1]
  ],
  [
    [0,0,0],
		[1,1,1],
		[1,0,0]
  ],
  [
    [0,0,0],
		[1,1,1],
		[0,0,1]
  ],
  [
    [0,0,0],
		[1,1,0],
		[0,1,1]
  ],
  [
    [0,0,0],
		[0,1,1],
		[1,1,0]
  ]
]

export default TetrisBoard