import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onPause: () => void;
  isPaused: boolean;
  gameOver: boolean;
}

export default function TouchControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onPause,
  isPaused,
  gameOver,
}: TouchControlsProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
      <div className="flex flex-col items-center gap-4">
        {/* Controles direcionais */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onMoveLeft}
              disabled={gameOver}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full"
            >
              <ArrowLeft className="w-8 h-8" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onRotate}
              disabled={gameOver}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full"
            >
              <RotateCw className="w-8 h-8" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onMoveRight}
              disabled={gameOver}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full"
            >
              <ArrowRight className="w-8 h-8" />
            </Button>
          </motion.div>
        </div>

        {/* Botão de queda rápida */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={onMoveDown}
            disabled={gameOver}
            size="lg"
            variant="default"
            className="w-20 h-12 rounded-full"
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Botão de pausa */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={onPause}
            disabled={gameOver}
            size="lg"
            variant="secondary"
            className="w-16 h-16 rounded-full"
          >
            {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
