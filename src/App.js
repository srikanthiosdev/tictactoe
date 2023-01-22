import "./App.css";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(3).fill(Array(3).fill(null)),
          move: null,
        },
      ],
      isXNext: true,
      currentStep: 0,
    };
  }

  handleClick(row, column) {
    var history = this.state.history.slice(0, this.state.currentStep + 1);
    const current = Array.from(history[history.length - 1].squares);
    if (calculateWinner(current) || current[row][column]) {
      return;
    }
    const currentRow = Array.from(current[row]);
    currentRow[column] = this.state.isXNext ? "X" : "O";
    current[row] = currentRow;
    const isXNext = !this.state.isXNext;
    const newHistory = history.concat([
      {
        squares: current,
        move: {
          row: row,
          column: column,
        },
      },
    ])
    this.setState({
      history: newHistory,
      isXNext: isXNext,
      currentStep: history.length,
    });
  }

  jumpTo(index) {
    this.setState({
      isXNext: index % 2 === 0,
      currentStep: index,
    });
  }

  render() {
    var history = this.state.history;
    var currentValues = history[this.state.currentStep];

    const moves = history.map((step, move) => {
      const value = move
        ? "Go to move".concat(" ", step.move.row, " ", step.move.column)
        : "Go to start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{value}</button>
        </li>
      );
    });


    const totalMoves = (currentValues.squares.length * currentValues.squares.length);
    const winner = calculateWinner(currentValues.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (totalMoves < this.state.currentStep) {
      status = "Match is Draw";
    } else {
      status = "Next player: " + (this.state.isXNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{status}</div>
          <Board
            selectedValue={currentValues}
            handleClick={(row, column) => this.handleClick(row, column)}
          />
        </div>
        <div className="game-info">
          <div>History</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(row, column) {
    let selectedValue = this.props.selectedValue.squares[row][column];
    let key = "".concat(row, column);
    let move = this.props.selectedValue.move;
    let isSelected = false;
    if (move) {
      isSelected = column === move.column && row === move.row;
    }
    return (
      <Square
        className={isSelected ? "bold" : ""}
        key={key}
        value={selectedValue}
        isSelected={isSelected}
        onClick={() => this.props.handleClick(row, column)}
      />
    );
  }

  getColumns(row) {
    const columns = [];
    for (let column = 0; column < 3; column++) {
      columns.push(this.renderSquare(row, column));
    }
    return columns;
  }

  getRows() {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      rows.push(<div className="board-row">{this.getColumns(row)}</div>);
    }
    return rows;
  }

  render() {
    const square = this.getRows();
    return <div>{square}</div>;
  }
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      <span style={{ fontWeight: props.isSelected ? "bold" : "normal" }}>
        {props.value}
      </span>
    </button>
  );
}

function calculateWinner(squares) {
  const length = squares.length;
  let leftDiagonal = null;
  let rightDiagonal = null;
  for (let row = 0; row < length; row++) {
    const [a, b, c] = squares[row];

    if(a === b && a === c && a !== null) {
      return a;
    }
    if (row === 0) {
      leftDiagonal = a
      rightDiagonal = c
    }

    let columnValue = null;
    for (let column = 0; column < length; column++) {
          const currentValue = squares[row][column];

          if (leftDiagonal !== null && row === column) {
            if (leftDiagonal === currentValue) {
              if (row === length - 1) {
                return leftDiagonal
              }
            } else {
              leftDiagonal = null
            }
          } 
              

          if (rightDiagonal !== null && (row + column) === (length - 1)) {
            if (rightDiagonal === currentValue) {
              if (column === 0) {
                return rightDiagonal
              }
            } else {
              rightDiagonal = null
            }
          } 

          const columnElement = squares[column][row];

          if (column === 0) {
            columnValue = columnElement;
          } else if (columnValue) {
            if (columnValue === columnElement) {
              if (column === length - 1) {
                return columnElement;
              }
            } else {
              columnValue = null
            }
          }
      }
  }
  return null;
}
export default App;
