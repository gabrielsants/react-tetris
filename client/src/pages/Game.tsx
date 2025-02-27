import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Board from '@/components/Tetris/Board';
import Preview from '@/components/Tetris/Preview';
import Score from '@/components/Tetris/Score';
import { PIECES, PieceType, createEmptyBoard, checkCollision, clearLines, rotatePiece } from '@/lib/tetris';
import { playSound } from '@/lib/audio';
import { useToast } from '@/hooks/use-toast';
import Commands from '@/components/Tetris/Commands';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

export default function Game() {
  const [board, setBoard] = useState(createEmptyBoard(BOARD_HEIGHT, BOARD_WIDTH));
  const [currentPiece, setCurrentPiece] = useState<PieceType>('T');
  const [nextPiece, setNextPiece] = useState<PieceType>('I');
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
      document.title = "React Tetris";
    }, []);

  const rotatePieceAction = useCallback(() => {
    if (gameOver || isPaused) return;

    const rotated = rotatePiece(PIECES[currentPiece]);
    if (!checkCollision(board, rotated, position)) {
      PIECES[currentPiece] = rotated;
      playSound('rotate');
    }
  }, [board, currentPiece, position, gameOver, isPaused]);

  const spawnPiece = useCallback(() => {
    const pieces = Object.keys(PIECES) as PieceType[];
    const newPiece = nextPiece;
    const newNextPiece = pieces[Math.floor(Math.random() * pieces.length)];
    
    setCurrentPiece(newPiece);
    setNextPiece(newNextPiece);
    setPosition({ x: 4, y: 0 });
    
    if (checkCollision(board, PIECES[newPiece], { x: 4, y: 0 })) {
      setGameOver(true);
      playSound('gameOver');
    }
  }, [board, nextPiece]);

  const movePiece = useCallback((dx: number) => {
    if (gameOver || isPaused) return;
    
    const newPos = { x: position.x + dx, y: position.y };
    if (!checkCollision(board, PIECES[currentPiece], newPos)) {
      setPosition(newPos);
      playSound('move');
    }
  }, [board, currentPiece, position, gameOver, isPaused]);

  const dropPiece = useCallback(() => {
    if (gameOver || isPaused) return;

    const newPos = { x: position.x, y: position.y + 1 };
    if (!checkCollision(board, PIECES[currentPiece], newPos)) {
      setPosition(newPos);
    } else {
      // Create a new board to avoid mutation
      const newBoard = board.map(row => [...row]);

      PIECES[currentPiece].forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = y + position.y;
            const boardX = x + position.x;
            if (boardY >= 0 && boardY < newBoard.length && boardX >= 0 && boardX < newBoard[0].length) {
              newBoard[boardY][boardX] = currentPiece;
            }
          }
        });
      });

      setBoard(newBoard);
      playSound('drop');

      const clearedLines = clearLines(newBoard);
      if (clearedLines > 0) {
        setBoard([...newBoard]);
        setLines(l => l + clearedLines);
        setScore(s => s + (clearedLines * 100 * level));
        setLevel(l => Math.floor((lines + clearedLines) / 10) + 1);
        playSound('clear');
      }

      spawnPiece();
    }
  }, [board, currentPiece, position, gameOver, isPaused, level, lines, spawnPiece]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft') movePiece(-1);
    if (e.key === 'ArrowRight') movePiece(1);
    if (e.key === 'ArrowDown') dropPiece();
    if (e.key === 'ArrowUp') rotatePieceAction();
    if (e.key === 'p') setIsPaused(p => !p);
  }, [movePiece, dropPiece, rotatePieceAction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(dropPiece, INITIAL_SPEED / level);
      return () => clearInterval(interval);
    }
  }, [dropPiece, gameOver, isPaused, level]);

  const resetGame = () => {
    setBoard(createEmptyBoard(BOARD_HEIGHT, BOARD_WIDTH));
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    spawnPiece();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <Card className="p-6">
          <Board 
            board={board} 
            currentPiece={currentPiece}
            position={position}
          />
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">
              Made by: <a href="https://github.com/gabrielsants" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@gabrielsants</a>
              </p>
            </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <Preview piece={nextPiece} />
          </Card>

          <Card className="p-6">
            <Score score={score} level={level} lines={lines} />
          </Card>

          <Commands />

          <div className="flex gap-2">
            <Button 
              onClick={() => setIsPaused(p => !p)}
              disabled={gameOver}
              variant="outline"
              className="flex-1"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>

            <Button 
              onClick={resetGame}
              variant="default"
              className="flex-1"
            >
              {gameOver ? 'Play Again' : 'Reset'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}