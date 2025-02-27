import { PieceType } from './tetris';

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export const PIECES: Record<PieceType, number[][]> = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'O': [
    [1, 1],
    [1, 1]
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

export const COLORS: Record<PieceType, string> = {
  'I': '#00f0f0',
  'O': '#f0f000',
  'T': '#a000f0',
  'S': '#00f000',
  'Z': '#f00000',
  'J': '#0000f0',
  'L': '#f0a000'
};

export function createEmptyBoard(rows: number, cols: number): (string | null)[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
}

export function rotatePiece(piece: number[][]): number[][] {
  const rows = piece.length;
  const cols = piece[0].length;
  const rotated = Array(cols).fill(0).map(() => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = piece[r][c];
    }
  }

  return rotated;
}

export function checkCollision(
  board: (string | null)[][],
  piece: number[][],
  position: { x: number, y: number }
): boolean {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const newY = y + position.y;
        const newX = x + position.x;

        if (
          newX < 0 ||
          newX >= board[0].length ||
          newY >= board.length ||
          (newY >= 0 && board[newY][newX] !== null)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function clearLines(board: (string | null)[][]): number {
  const completedLines: number[] = [];

  // Find all completed lines
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      completedLines.push(y);
    }
  }

  if (completedLines.length === 0) return 0;

  // Remove all completed lines at once
  const newBoard = board.filter((_, index) => !completedLines.includes(index));

  // Add new empty lines at the top
  const emptyLines = Array(completedLines.length)
    .fill(null)
    .map(() => Array(board[0].length).fill(null));

  newBoard.unshift(...emptyLines);

  // Update the original board
  for (let y = 0; y < board.length; y++) {
    board[y] = [...newBoard[y]];
  }

  return completedLines.length;
}