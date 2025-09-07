'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface VideoBackgroundProps {
  videoSources: { src: string; type: string }[];
  fallbackImage: string;
  className?: string;
  showControls?: boolean;
}

export const VideoBackground = ({ 
  videoSources, 
  fallbackImage, 
  className = '',
  showControls = true 
}: VideoBackgroundProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {!hasError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={handleError}
        >
          {videoSources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
        </video>
      ) : (
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${fallbackImage}')` }}
        />
      )}
      
      {showControls && !hasError && (
        <motion.button
          onClick={togglePlayback}
          className="absolute bottom-4 right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
      )}
    </div>
  );
};