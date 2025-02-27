import { motion } from 'framer-motion';
import { PieceType, COLORS } from '@/lib/tetris';

interface PieceProps {
  type: PieceType;
  active?: boolean;
  ghost?: boolean;
  className?: string;
}

export default function Piece({ type, active = true, ghost = false, className = '' }: PieceProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: active ? 1 : 0.8,
        opacity: ghost ? 0.3 : (active ? 1 : 0.2)
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={`w-6 h-6 border rounded-sm ${className}`}
      style={{
        backgroundColor: COLORS[type],
        borderColor: ghost ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
        boxShadow: ghost ? 'none' : `inset 0 0 8px rgba(255, 255, 255, 0.1)`
      }}
    >
      {/* Add inner gradient effect */}
      <div 
        className="w-full h-full rounded-sm"
        style={{
          background: ghost ? 'none' : `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(0, 0, 0, 0.05) 100%
          )`
        }}
      />
    </motion.div>
  );
}
