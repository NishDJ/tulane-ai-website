import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

interface UseParallaxOptions {
  speed?: number;
  offset?: ["start end", "end start"] | ["start start", "end end"] | ["start center", "end center"];
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5, offset = ["start end", "end start"], direction = 'up' } = options;
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const range = speed * 100;
  
  const transform = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === 'down' ? [`-${range}px`, `${range}px`] :
    direction === 'left' ? [`${range}px`, `-${range}px`] :
    direction === 'right' ? [`-${range}px`, `${range}px`] :
    [`${range}px`, `-${range}px`] // default 'up'
  );

  return {
    ref,
    transform,
    scrollYProgress
  };
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return {
    scrollYProgress,
    scrollPercentage: useTransform(scrollYProgress, [0, 1], [0, 100])
  };
};

export const useElementInView = (options: IntersectionObserverInit = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { ref, isInView };
};