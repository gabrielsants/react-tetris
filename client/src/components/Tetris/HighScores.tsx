import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useHighScores, type NewScore } from '@/hooks/use-high-scores';
import { useToast } from '@/hooks/use-toast';

interface HighScoresProps {
  score: number;
  level: number;
  lines: number;
  onClose: () => void;
}

export default function HighScores({ score, level, lines, onClose }: HighScoresProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scores, submitScore, isNewHighScore, getRank, isLoading } = useHighScores();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newScore: NewScore = {
        playerName: playerName.trim(),
        score,
        level,
        lines,
      };
      
      await submitScore(newScore);
      toast({
        title: "Score Submitted!",
        description: `Congratulations! Your score has been saved.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-sm font-medium">{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 border-yellow-500/50';
    if (rank === 2) return 'bg-gray-400/20 border-gray-400/50';
    if (rank === 3) return 'bg-amber-600/20 border-amber-600/50';
    return 'bg-muted border-border';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-background rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="text-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">High Scores</h2>
            {isNewHighScore(score) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-green-500 font-semibold"
              >
                🎉 New High Score! 🎉
              </motion.div>
            )}
          </div>

          {/* Form para novo score */}
          {isNewHighScore(score) && (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="playerName" className="block text-sm font-medium mb-2">
                  Enter your name:
                </label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name"
                  maxLength={20}
                  className="text-center"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !playerName.trim()}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </Button>
            </form>
          )}

          {/* Lista de High Scores */}
          <div className="space-y-3">
            <h3 className="font-semibold text-center mb-3">Top Scores</h3>
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : scores.length === 0 ? (
              <div className="text-center text-muted-foreground">No scores yet. Be the first!</div>
            ) : (
              <AnimatePresence>
                {scores.map((scoreItem, index) => (
                  <motion.div
                    key={scoreItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${getRankColor(index + 1)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <div className="font-medium">{scoreItem.playerName}</div>
                        <div className="text-sm text-muted-foreground">
                          Level {scoreItem.level} • {scoreItem.lines} lines
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{scoreItem.score.toLocaleString()}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
