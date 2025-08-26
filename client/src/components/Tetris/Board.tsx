import { motion } from 'framer-motion';
import { PIECES, PieceType, rotatePiece } from '@/lib/tetris';

interface BoardProps {
  board: (PieceType | null)[][];
  currentPiece: PieceType;
  position: { x: number; y: number };
  currentRotation?: number;
}

export default function Board({ board, currentPiece, position, currentRotation = 0 }: BoardProps) {
  const getRotatedPiece = (piece: PieceType, rotation: number) => {
    let rotated = PIECES[piece];
    for (let i = 0; i < rotation; i++) {
      rotated = rotatePiece(rotated);
    }
    return rotated;
  };

  const rotatedPiece = getRotatedPiece(currentPiece, currentRotation);

  return (
    <div className="relative">
      <div className="grid gap-[2px] p-4 bg-gray-800 rounded-lg">
        {board.map((row, y) => (
          <div key={y} className="flex gap-[2px]">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 rounded border-2 ${
                  cell
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-lg'
                    : 'bg-gray-700 border-gray-600'
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      {rotatedPiece.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;
          
          const boardX = position.x + x;
          const boardY = position.y + y;
          
          if (boardY < 0 || boardY >= board.length || boardX < 0 || boardX >= board[0].length) {
            return null;
          }
          
          return (
            <motion.div
              key={`piece-${x}-${y}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
              className="absolute w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-500 border-2 border-cyan-300 rounded shadow-lg"
              style={{
                left: `${(position.x + x) * 32 + 16}px`,
                top: `${(position.y + y) * 32 + 16}px`,
              }}
            />
          );
        })
      )}

      <div className="absolute inset-0 border-2 border-gray-600 rounded-lg pointer-events-none" />

      <div className="flex justify-center mt-4">
        <p className="text-sm text-gray-500">
          Made by: <a href="https://github.com/gabrielsants" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@gabrielsants</a>
        </p>
      </div>
    </div>
  );
}