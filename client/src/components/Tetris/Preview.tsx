import { motion } from 'framer-motion';
import { PIECES, COLORS, PieceType } from '@/lib/tetris';

interface PreviewProps {
  piece: PieceType;
}

export default function Preview({ piece }: PreviewProps) {
  const pieceShape = PIECES[piece];

  let minX = pieceShape[0].length;
  let maxX = 0;
  let minY = pieceShape.length;
  let maxY = 0;

  pieceShape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    });
  });

  const trimmedShape = pieceShape
    .slice(minY, maxY + 1)
    .map(row => row.slice(minX, maxX + 1));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Next Piece</h2>
      <div className="flex justify-center items-center">
        <div className="grid gap-0" style={{
          gridTemplateColumns: `repeat(${trimmedShape[0].length}, minmax(0, 1fr))`
        }}>
          {trimmedShape.map((row, y) => (
            row.map((cell, x) => (
              <motion.div
                key={`${x}-${y}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: cell ? 1 : 0.8,
                  opacity: cell ? 1 : 0.2
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="w-6 h-6 border rounded-sm"
                style={{
                  backgroundColor: cell ? COLORS[piece] : 'rgba(0, 0, 0, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: cell ? 'inset 0 0 8px rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                {/* Add inner gradient effect */}
                <div 
                  className="w-full h-full rounded-sm"
                  style={{
                    background: cell ? `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.1) 0%, 
                      rgba(255, 255, 255, 0.05) 50%, 
                      rgba(0, 0, 0, 0.05) 100%
                    )` : 'none'
                  }}
                />
              </motion.div>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}