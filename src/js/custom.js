require('../less/custom.less');

$(document).ready(function () {
  const cells = $('.cell');
  let currentPlayer = 'X';
  let board = ['', '', '', '', '', '', '', '', ''];

  function checkWin() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }

  function checkDraw() {
    return board.every(cell => cell !== '');
  }

  function handleMove(index) {
    if (board[index] === '') {
      board[index] = currentPlayer;
      cells.eq(index).text(currentPlayer);

      if (checkWin()) {
        alert(`${currentPlayer} wins!`);
        resetGame();
      } else if (checkDraw()) {
        alert('Draw!');
        resetGame();
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }

  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.text('');
    currentPlayer = 'X';
  }

  cells.on('click', function () {
    const index = $(this).data('cell');
    handleMove(index);
  });
});
