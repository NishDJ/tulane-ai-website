/**
 * Mobile optimization utilities for responsive design and touch interactions
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user is on a mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(mobileRegex.test(userAgent) || (isTouchDevice && isSmallScreen));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to detect screen size breakpoints
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook for touch-friendly interactions
 */
export function useTouchFriendly() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchDevice;
}

/**
 * Get responsive class names based on screen size
 */
export function getResponsiveClasses(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  const classes = [base];
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  return classes.join(' ');
}

/**
 * Mobile-optimized touch target size (minimum 44px)
 */
export const TOUCH_TARGET_SIZE = {
  min: 'min-h-[44px] min-w-[44px]',
  comfortable: 'min-h-[48px] min-w-[48px]',
  large: 'min-h-[56px] min-w-[56px]',
} as const;

/**
 * Mobile-optimized spacing
 */
export const MOBILE_SPACING = {
  xs: 'p-2 sm:p-3',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12',
} as const;

/**
 * Mobile-optimized text sizes
 */
export const MOBILE_TEXT = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl',
  '4xl': 'text-4xl sm:text-5xl',
} as const;

/**
 * Mobile-optimized grid layouts
 */
export const MOBILE_GRID = {
  auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  faculty: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  research: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  news: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  stats: 'grid-cols-1 sm:grid-cols-3',
} as const;

/**
 * Check if device supports hover interactions
 */
export function supportsHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Get mobile-optimized animation duration
 */
export function getMobileAnimationDuration(
  desktop: number,
  mobile?: number
): number {
  if (typeof window === 'undefined') return desktop;
  
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) return 0.01;
  if (isMobile) return mobile || desktop * 0.7; // Faster animations on mobile
  
  return desktop;
}

/**
 * Mobile-optimized container classes
 */
export const MOBILE_CONTAINER = {
  full: 'w-full px-4 sm:px-6 lg:px-8',
  constrained: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
} as const;

/**
 * Mobile-optimized flex layouts
 */
export const MOBILE_FLEX = {
  stack: 'flex flex-col',
  stackToRow: 'flex flex-col sm:flex-row',
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  wrap: 'flex flex-wrap',
} as const;

/**
 * Get mobile-optimized class names for components
 */
export function getMobileOptimizedClasses(isMobile: boolean, isTouchDevice: boolean): string {
  const classes = [];
  if (isMobile) classes.push('mobile-container');
  if (isTouchDevice) classes.push('touch-manipulation');
  return classes.join(' ');
}