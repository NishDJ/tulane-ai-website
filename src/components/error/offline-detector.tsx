'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineDetectorProps {
  className?: string;
  showOnlineMessage?: boolean;
  onlineMessageDuration?: number;
}

export default function OfflineDetector({ 
  className,
  showOnlineMessage = true,
  onlineMessageDuration = 3000
}: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOnlineNotification, setShowOnlineNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showOnlineMessage) {
        setShowOnlineNotification(true);
        setTimeout(() => {
          setShowOnlineNotification(false);
        }, onlineMessageDuration);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineNotification(false);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showOnlineMessage, onlineMessageDuration]);

  if (isOnline && !showOnlineNotification) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300',
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <Wifi className="h-5 w-5" />
        ) : (
          <WifiOff className="h-5 w-5" />
        )}
        <span className="font-medium">
          {isOnline ? 'Back online!' : 'You are offline'}
        </span>
      </div>
      
      {!isOnline && (
        <p className="text-sm mt-1 opacity-90">
          Some features may not work properly until you reconnect.
        </p>
      )}
    </div>
  );
}