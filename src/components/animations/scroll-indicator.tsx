'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  targetId?: string;
  className?: string;
  size?: number;
}

export const ScrollIndicator = ({ 
  targetId = 'content', 
  className = '',
  size = 32 
}: ScrollIndicatorProps) => {
  const scrollToTarget = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <motion.button
      onClick={scrollToTarget}
      className={`text-white hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Scroll to content"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <ChevronDown size={size} />
      </motion.div>
    </motion.button>
  );
};