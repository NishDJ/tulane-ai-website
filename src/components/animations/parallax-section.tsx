'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = '',
  offset = 0 
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset - (speed * 100)]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxBackgroundProps {
  imageSrc: string;
  speed?: number;
  className?: string;
  overlay?: boolean;
}

export const ParallaxBackground = ({ 
  imageSrc, 
  speed = 0.3, 
  className = '',
  overlay = true 
}: ParallaxBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 w-full h-[120%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${imageSrc}')`,
          y,
        }}
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/30" />
      )}
    </div>
  );
};