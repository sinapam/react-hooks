// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils.js'

function Board(props) {
  const {squares, onSquaresChanged} = props
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) return

    const updatedSquares = [...squares]
    updatedSquares[square] = nextValue

    onSquaresChanged(updatedSquares)
  }

  function restart() {
    onSquaresChanged(Array(9).fill(null))
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function GameHistory(props) {
  const {history, onHistorySelected} = props
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', '0')

  function onSelectStep(event) {
    const {value} = event.target
    onHistorySelected(value)
    setCurrentStep(value)
  }

  const listItems = history.map((_, index) => {
    const isCurrentStep = currentStep === String(index)
    return (
      <li key={index}>
        <button disabled={isCurrentStep} value={index} onClick={onSelectStep}>
          Go to{' '}
          {index === 0 ? <span>game start</span> : <span>move #{index}</span>}{' '}
          {isCurrentStep && <span>(current)</span>}
        </button>
      </li>
    )
  })

  return <ol>{listItems}</ol>
}

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [history, setHistory] = useLocalStorageState('history', [])

  function onSquaresChanged(updatedSquares) {
    setSquares(updatedSquares)

    const updatedHistory = [...history]
    updatedHistory.push(updatedSquares)
    setHistory(updatedHistory)
  }

  function onHistorySelected(step) {
    setSquares(history[step])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onSquaresChanged={onSquaresChanged} />
      </div>
      <div className="game-info">
        <div>History</div>
        <GameHistory history={history} onHistorySelected={onHistorySelected} />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
