// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board(props) {
  const {squares, onSquareSelected} = props
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareSelected(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
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
    </div>
  )
}

function GameHistory(props) {
  const {history, currentStep, onStepSelected} = props

  const listItems = history.map((_, index) => {
    const isCurrentStep = parseInt(currentStep) === index
    return (
      <li key={index}>
        <button
          disabled={isCurrentStep}
          value={index}
          onClick={() => onStepSelected(index)}
        >
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
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', '0')

  const squares = currentSquare(history, currentStep)
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) return

    const newSquares = [...squares]
    newSquares[square] = nextValue
    const newHistory = history.slice(0, currentStep + 1)
    setHistory([...newHistory, newSquares])
    setCurrentStep(newHistory.length)
  }

  function onSquareSelected(square) {
    selectSquare(square)
  }

  function onStepSelected(step) {
    console.log('step: ', step)
    setCurrentStep(step)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onSquareSelected={onSquareSelected} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <GameHistory
          history={history}
          currentStep={currentStep}
          onStepSelected={onStepSelected}
        />
      </div>
    </div>
  )
}

function currentSquare(history, currentStep) {
  return history[parseInt(currentStep)]
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
