import { motion } from 'framer-motion';

interface ScoreProps {
  score: number;
  level: number;
  lines: number;
}

export default function Score({ score, level, lines }: ScoreProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-2 text-center"
      >
        <h2 className="text-lg font-semibold">Score</h2>
        <p className="text-xl font-bold">{score}</p>
      </motion.div>
      
      <div className="flex gap-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-lg font-semibold">Level</h2>
          <p className="text-2xl font-bold">{level}</p>
        </motion.div>
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-lg font-semibold">Lines</h2>
          <p className="text-2xl font-bold">{lines}</p>
        </motion.div>
      </div>
    </div>
  );
}
