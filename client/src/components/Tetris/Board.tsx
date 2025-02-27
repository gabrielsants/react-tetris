import { motion } from 'framer-motion';
import { PIECES, COLORS, PieceType } from '@/lib/tetris';

interface BoardProps {
  board: (string | null)[][];
  currentPiece: PieceType;
  position: { x: number; y: number };
}

export default function Board({ board, currentPiece, position }: BoardProps) {
  return (
    <div className="grid gap-[1px]" style={{ 
      gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`
    }}>
      {board.map((row, y) => (
        row.map((cell, x) => {
          let isCurrent = false;
          if (PIECES[currentPiece]) {
            const piece = PIECES[currentPiece];
            const pieceY = y - position.y;
            const pieceX = x - position.x;

            if (
              pieceY >= 0 && 
              pieceY < piece.length && 
              pieceX >= 0 && 
              pieceX < piece[pieceY].length
            ) {
              isCurrent = !!piece[pieceY][pieceX];
            }
          }

          const color = cell ? COLORS[cell as PieceType] : (isCurrent ? COLORS[currentPiece] : 'rgba(0, 0, 0, 0.1)');

          return (
            <motion.div
              key={`${x}-${y}`}
              initial={false}
              animate={{ backgroundColor: color }}
              transition={{ duration: 0.05 }}
              className={`w-6 h-6 border border-gray-700 rounded-sm ${
                color !== 'rgba(0, 0, 0, 0.1)' ? 'shadow-inner' : ''
              }`}
            />
          );
        })
      ))}
    </div>
  );
}