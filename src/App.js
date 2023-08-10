import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Congratulations ${winner}, you win!`
  } else {
    status = `It is ${(xIsNext ? "X" : "O")}'s turn`
  }
  
  const boardRows = [...Array(3)].map((x, i) => {
    const boardSquares = [...Array(3)].map((x, j) => {
      return (
        <Square
          key={3 * i + j}
          value={squares[3 * i + j]}
          onSquareClick={() => handleClick(3 * i + j)}
        />
      );
    });
  
    return (
      <div key={i} className="board-row">
        {boardSquares}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentTurn, setCurrentTurn] = useState(0)
  const xIsNext = currentTurn % 2 === 0
  const currentSquares = history[currentTurn]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentTurn + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentTurn(nextHistory.length - 1)
  }

  function jumpTo(nextTurn) {
    setCurrentTurn(nextTurn)
  }

  const turns = history.map((squares, turn) => {
    let description
    if (turn === currentTurn) {
      description = `You are on turn #${turn + 1}`
    } else if (turn > 0) {
      description = <button onClick={() => jumpTo(turn)}>Go to turn #{turn + 1}</button>
    } else {
      description = <button onClick={() => jumpTo(turn)}>Go to game Start</button>
    }
    return (
      <li key={turn}>
        {description}
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{turns}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}