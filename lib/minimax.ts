export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function getWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

export function getWinningLine(board: Board): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export type GameStatus = 'ongoing' | 'X' | 'O' | 'draw';

export function getGameStatus(board: Board): GameStatus {
  const winner = getWinner(board);
  if (winner) return winner;
  if (isBoardFull(board)) return 'draw';
  return 'ongoing';
}

function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const winner = getWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

export function getRandomMove(board: Board): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);
  return empty[Math.floor(Math.random() * empty.length)] ?? -1;
}

export function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestIndex = -1;
  const b = [...board] as Board;

  for (let i = 0; i < 9; i++) {
    if (b[i] === null) {
      b[i] = 'O';
      const score = minimax(b, 0, false, -Infinity, Infinity);
      b[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
  }

  return bestIndex;
}
