'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  delay?: number;
}

export const Typewriter = ({ 
  texts, 
  className = '', 
  speed = 3000, 
  delay = 500 
}: TypewriterProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentText = texts[currentIndex];
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      // Typing animation
      if (displayText.length < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 100);
      } else {
        // Finished typing, wait then start erasing
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, speed);
      }
    } else {
      // Erasing animation
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        // Finished erasing, move to next text
        timeoutId = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setIsTyping(true);
        }, delay);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentIndex, displayText, isTyping, texts, speed, delay]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentIndex}-${displayText}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {displayText}
          <motion.span
            className="inline-block w-0.5 h-[1em] bg-current ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </AnimatePresence>
    </div>
  );
};