'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  hoverScale?: number;
  tapScale?: number;
  glowEffect?: boolean;
}

export const AnimatedButton = ({ 
  children, 
  hoverScale = 1.05, 
  tapScale = 0.95,
  glowEffect = false,
  className = '',
  ...props 
}: AnimatedButtonProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: tapScale,
        transition: { duration: 0.1 }
      }}
      className={glowEffect ? 'relative' : ''}
    >
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-tulane-green to-tulane-blue opacity-0 blur-lg"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <Button 
        className={`relative z-10 ${className}`}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};