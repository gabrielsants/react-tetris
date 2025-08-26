export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export const PIECES: Record<PieceType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const COLORS: Record<PieceType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

export function rotatePiece(piece: number[][]): number[][] {
  const rows = piece.length;
  const cols = piece[0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = piece[i][j];
    }
  }
  
  return rotated;
}

export function getRotatedPiece(piece: number[][], rotation: number): number[][] {
  let rotated = piece;
  for (let i = 0; i < rotation; i++) {
    rotated = rotatePiece(rotated);
  }
  return rotated;
}

export function createEmptyBoard(height: number, width: number): (PieceType | null)[][] {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

export function checkCollision(
  board: (PieceType | null)[][],
  piece: number[][],
  position: Position
): boolean {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        if (
          boardY < 0 ||
          boardY >= board.length ||
          boardX < 0 ||
          boardX >= board[0].length ||
          board[boardY][boardX] !== null
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function clearLines(board: (PieceType | null)[][]): number {
  const completedLines: number[] = [];
  
  for (let y = 0; y < board.length; y++) {
    if (board[y].every(cell => cell !== null)) {
      completedLines.push(y);
    }
  }
  
  if (completedLines.length === 0) {
    return 0;
  }
  
  const newBoard = board.filter((_, index) => !completedLines.includes(index));
  
  const emptyLines = Array.from({ length: completedLines.length }, () =>
    Array(board[0].length).fill(null)
  );
  
  newBoard.unshift(...emptyLines);
  
  for (let i = 0; i < board.length; i++) {
    board[i] = [...newBoard[i]];
  }
  
  return completedLines.length;
}
