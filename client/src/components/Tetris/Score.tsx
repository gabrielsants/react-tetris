import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target } from 'lucide-react';

interface ScoreProps {
  score: number;
  level: number;
  lines: number;
}

export default function Score({ score, level, lines }: ScoreProps) {
  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-red-500';
    if (level >= 7) return 'text-orange-500';
    if (level >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getLinesProgress = (lines: number) => {
    const linesForNextLevel = 10;
    const progress = (lines % linesForNextLevel) / linesForNextLevel;
    return Math.min(progress, 1);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center mb-4">Game Stats</h2>
      
      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-muted-foreground">Score</span>
        </div>
        <motion.div
          key={score}
          initial={{ scale: 1.2, color: '#fbbf24' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-2xl font-bold text-primary"
        >
          {formatScore(score)}
        </motion.div>
      </motion.div>

      {/* Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-muted-foreground">Level</span>
        </div>
        <motion.div
          key={level}
          initial={{ scale: 1.2, color: '#3b82f6' }}
          animate={{ scale: 1, color: getLevelColor(level) }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`text-xl font-bold ${getLevelColor(level)}`}
        >
          {level}
        </motion.div>
        
        {/* Progress bar para próximo nível */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getLinesProgress(lines) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-blue-500 h-2 rounded-full"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {lines % 10}/10 lines to next level
          </div>
        </div>
      </motion.div>

      {/* Lines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-muted-foreground">Lines</span>
        </div>
        <motion.div
          key={lines}
          initial={{ scale: 1.2, color: '#10b981' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-xl font-bold text-green-500"
        >
          {lines}
        </motion.div>
      </motion.div>

      {/* Estatísticas adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4 border-t border-border"
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Lines/Level</div>
            <div className="font-semibold">{(lines / Math.max(level, 1)).toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Score/Line</div>
            <div className="font-semibold">{lines > 0 ? Math.round(score / lines) : 0}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
