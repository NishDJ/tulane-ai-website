import { useEffect, useState } from 'react';
import { useAnimation } from 'framer-motion';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const controls = useAnimation();
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '0px',
    triggerOnce: options.triggerOnce !== false,
  });

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      const timer = setTimeout(() => {
        controls.start('visible');
        setHasAnimated(true);
      }, options.delay || 0);

      return () => clearTimeout(timer);
    }
  }, [isIntersecting, hasAnimated, controls, options.delay]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        staggerChildren: 0.1,
      },
    },
  };

  return {
    elementRef,
    controls,
    variants,
    isIntersecting,
    hasAnimated,
  };
};