'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  direction: number;
}

interface ParticlesProps {
  count?: number;
  className?: string;
}

export const Particles = ({ count = 50, className = '' }: ParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        direction: Math.random() * Math.PI * 2,
      });
    }
    setParticles(newParticles);
  }, [count, dimensions]);

  useEffect(() => {
    if (particles.length === 0) return;

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + Math.cos(particle.direction) * particle.speed;
        let newY = particle.y + Math.sin(particle.direction) * particle.speed;

        // Wrap around screen edges
        if (newX < -10) newX = dimensions.width + 10;
        if (newX > dimensions.width + 10) newX = -10;
        if (newY < -10) newY = dimensions.height + 10;
        if (newY > dimensions.height + 10) newY = -10;

        return {
          ...particle,
          x: newX,
          y: newY,
        };
      }));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [particles.length, dimensions]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: particle.id * 0.01 }}
        />
      ))}
    </div>
  );
};