import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [currentRotation, setCurrentRotation] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "React Tetris";
  }, []);

  const rotatePieceAction = useCallback(() => {
    if (gameOver || isPaused) return;

    const nextRotation = (currentRotation + 1) % 4;
    
    let rotated = PIECES[currentPiece];
    for (let i = 0; i < nextRotation; i++) {
      rotated = rotatePiece(rotated);
    }
    
    if (!checkCollision(board, rotated, position)) {
      setCurrentRotation(nextRotation);
      playSound('rotate');
    } else {
      const leftKick = { x: position.x - 1, y: position.y };
      const rightKick = { x: position.x + 1, y: position.y };
      
      if (!checkCollision(board, rotated, leftKick)) {
        setPosition(leftKick);
        setCurrentRotation(nextRotation);
        playSound('rotate');
      } else if (!checkCollision(board, rotated, rightKick)) {
        setPosition(rightKick);
        setCurrentRotation(nextRotation);
        playSound('rotate');
      }
    }
  }, [board, currentPiece, position, gameOver, isPaused, currentRotation]);

  const spawnPiece = useCallback(() => {
    const pieces = Object.keys(PIECES) as PieceType[];
    const newPiece = nextPiece;
    const newNextPiece = pieces[Math.floor(Math.random() * pieces.length)];
    
    setCurrentPiece(newPiece);
    setNextPiece(newNextPiece);
    setPosition({ x: 4, y: 0 });
    setCurrentRotation(0);
    
    if (checkCollision(board, PIECES[newPiece], { x: 4, y: 0 })) {
      setGameOver(true);
      playSound('gameOver');
      
      toast({
        title: "Game Over!",
        description: `Final Score: ${score}`,
        variant: "destructive",
      });
    }
  }, [board, nextPiece, score, toast]);

  const movePiece = useCallback((dx: number) => {
    if (gameOver || isPaused) return;
    
    const newPos = { x: position.x + dx, y: position.y };
    let rotatedPiece = PIECES[currentPiece];
    for (let i = 0; i < currentRotation; i++) {
      rotatedPiece = rotatePiece(rotatedPiece);
    }
    
    if (!checkCollision(board, rotatedPiece, newPos)) {
      setPosition(newPos);
      playSound('move');
    }
  }, [board, currentPiece, position, gameOver, isPaused, currentRotation]);

  const dropPiece = useCallback(() => {
    if (gameOver || isPaused) return;
    
    const newPos = { x: position.x, y: position.y + 1 };
    let rotatedPiece = PIECES[currentPiece];
    for (let i = 0; i < currentRotation; i++) {
      rotatedPiece = rotatePiece(rotatedPiece);
    }
    
    if (!checkCollision(board, rotatedPiece, newPos)) {
      setPosition(newPos);
      setScore(s => s + 1);
    } else {
      const newBoard = [...board];
      for (let y = 0; y < rotatedPiece.length; y++) {
        for (let x = 0; x < rotatedPiece[y].length; x++) {
          if (rotatedPiece[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = currentPiece;
            }
          }
        }
      }
      
      const linesCleared = clearLines(newBoard);
      if (linesCleared > 0) {
        setLines(l => l + linesCleared);
        setLevel(l => Math.floor((l + linesCleared) / 10) + 1);
        setScore(s => s + linesCleared * 100 * level);
        playSound('line');
        
        toast({
          title: `Lines Cleared: ${linesCleared}`,
          description: `Score: +${linesCleared * 100 * level}`,
        });
      }
      
      setBoard(newBoard);
      spawnPiece();
    }
  }, [board, currentPiece, position, gameOver, isPaused, currentRotation, level, spawnPiece, toast]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(BOARD_HEIGHT, BOARD_WIDTH));
    setCurrentPiece('T');
    setNextPiece('I');
    setPosition({ x: 4, y: 0 });
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setCurrentRotation(0);
    playSound('reset');
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceAction();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setIsPaused(p => !p);
          break;
        case ' ':
          e.preventDefault();
          if (e.key === ' ') setIsPaused(p => !p);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, movePiece, dropPiece, rotatePieceAction]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const interval = setInterval(dropPiece, INITIAL_SPEED / level);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, dropPiece, level]);

  const currentPieceMatrix = useMemo(() => {
    let rotated = PIECES[currentPiece];
    for (let i = 0; i < currentRotation; i++) {
      rotated = rotatePiece(rotated);
    }
    return rotated;
  }, [currentPiece, currentRotation]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
            Game Over!
          </h1>
          <div className="text-2xl text-gray-300 mb-8">
            <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
            <p>Level Reached: <span className="text-blue-400 font-bold">{level}</span></p>
            <p>Lines Cleared: <span className="text-green-400 font-bold">{lines}</span></p>
          </div>
          <Button onClick={resetGame} size="lg" className="text-xl px-8 py-4">
            🎮 Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            React Tetris
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center text-lg sm:text-xl lg:text-2xl text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Score:</span>
              <span className="font-bold text-white">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">Level:</span>
              <span className="font-bold text-white">{level}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">Lines:</span>
              <span className="font-bold text-white">{lines}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-start">
          <div className="flex flex-col items-center">
            <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-600 shadow-2xl">
              <Board 
                board={board} 
                currentPiece={currentPiece}
                position={position}
                currentRotation={currentRotation}
              />
            </Card>
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => setIsPaused(p => !p)}
                disabled={gameOver}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </Button>

              <Button 
                onClick={resetGame}
                variant="default"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                {gameOver ? '🎮 Play Again' : '🔄 Reset'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-[300px]">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-center">Next Piece</h3>
              <div className="flex justify-center">
                <Preview piece={nextPiece} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Controls</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>Move Left/Right</span>
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">← →</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>Move Down</span>
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">↓</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>Rotate</span>
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">↑</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>Pause</span>
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">P</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>Reset Game </span>
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">Space</kbd>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Game Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lines/Level</span>
                  <span className="font-semibold">{(lines / Math.max(level, 1)).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Score/Line</span>
                  <span className="font-semibold">{lines > 0 ? Math.round(score / lines) : 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Progress to Next Level</span>
                  <span className="font-semibold">{lines % 10}/10</span>
                </div>
              </div>
            </Card>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Made by: <a href="https://github.com/gabrielsants" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@gabrielsants</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}