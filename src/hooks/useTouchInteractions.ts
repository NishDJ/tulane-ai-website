/**
 * Hook for handling touch interactions and mobile-specific behaviors
 */

import { useEffect, useState, useCallback, useRef } from 'react';

interface TouchInteractionOptions {
  onTap?: () => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  longPressDelay?: number;
  swipeThreshold?: number;
}

export function useTouchInteractions(options: TouchInteractionOptions = {}) {
  const {
    onTap,
    onLongPress,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    longPressDelay = 500,
    swipeThreshold = 50,
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    setIsPressed(true);
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const touchStart = touchStartRef.current;
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    // Check for swipe gestures
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > swipeThreshold || absY > swipeThreshold) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    } else if (deltaTime < 300 && onTap) {
      // Quick tap
      onTap();
    }

    touchStartRef.current = null;
  }, [onTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold]);

  const handleTouchCancel = useCallback(() => {
    setIsPressed(false);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    touchStartRef.current = null;
  }, []);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    isPressed,
    touchHandlers,
  };
}

/**
 * Hook for detecting mobile device capabilities
 */
export function useMobileCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isTouchDevice: false,
    hasHover: false,
    supportsVibration: false,
    devicePixelRatio: 1,
    screenSize: { width: 0, height: 0 },
  });

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities({
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasHover: window.matchMedia('(hover: hover)').matches,
        supportsVibration: 'vibrate' in navigator,
        devicePixelRatio: window.devicePixelRatio || 1,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };

    updateCapabilities();
    window.addEventListener('resize', updateCapabilities);
    
    return () => window.removeEventListener('resize', updateCapabilities);
  }, []);

  return capabilities;
}

/**
 * Hook for handling mobile-specific performance optimizations
 */
export function useMobilePerformance() {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);

  useEffect(() => {
    // Detect low-end devices
    const connection = (navigator as any).connection;
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    const isLowEnd = 
      (memory && memory < 4) || 
      (cores && cores < 4) ||
      (connection && connection.effectiveType && 
       ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

    setIsLowEndDevice(isLowEnd);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldReduceAnimations(prefersReducedMotion || isLowEnd);
  }, []);

  return {
    isLowEndDevice,
    shouldReduceAnimations,
  };
}

/**
 * Hook for handling mobile viewport changes
 */
export function useMobileViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isLandscape: false,
    visualViewportHeight: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const visualViewportHeight = window.visualViewport?.height || height;

      setViewport({
        width,
        height,
        isLandscape: width > height,
        visualViewportHeight,
      });
    };

    updateViewport();
    
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
    }

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
      }
    };
  }, []);

  return viewport;
}