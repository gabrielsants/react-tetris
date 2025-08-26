import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, Pause, Space, Gamepad2 } from 'lucide-react';

export default function Commands() {
  const commands = [
    { 
      key: <ArrowLeft className="w-4 h-4" />, 
      action: 'Move Left',
      description: 'Move piece to the left'
    },
    { 
      key: <ArrowRight className="w-4 h-4" />, 
      action: 'Move Right',
      description: 'Move piece to the right'
    },
    { 
      key: <ArrowDown className="w-4 h-4" />, 
      action: 'Soft Drop',
      description: 'Move piece down faster'
    },
    { 
      key: <RotateCw className="w-4 h-4" />, 
      action: 'Rotate',
      description: 'Rotate piece clockwise'
    },
    { 
      key: <Pause className="w-4 h-4" />, 
      action: 'Pause/Resume',
      description: 'Pause or resume the game'
    },
    { 
      key: <Space className="w-4 h-4" />, 
      action: 'Pause/Resume',
      description: 'Alternative pause key'
    },
    { 
      key: <span className="text-xs font-bold">ESC</span>, 
      action: 'Close/Back',
      description: 'Close modals or go back'
    }
  ];

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Controls
        </h2>
        
        <div className="space-y-3">
          {commands.map((command, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg border border-border">
                {command.key}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{command.action}</div>
                <div className="text-xs text-muted-foreground">{command.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dica para mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Tip:</strong> On mobile devices, touch controls are available at the bottom of the screen.
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
}
