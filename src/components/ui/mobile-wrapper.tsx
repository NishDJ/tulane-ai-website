'use client';

import React from 'react';
import { useIsMobile, useTouchFriendly, getMobileOptimizedClasses } from '@/lib/mobile-utils';
import { cn } from '@/lib/utils';

interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableTouchOptimization?: boolean;
  enableMobileContainer?: boolean;
}

/**
 * Wrapper component that applies mobile-specific optimizations
 */
export function MobileWrapper({ 
  children, 
  className,
  enableTouchOptimization = true,
  enableMobileContainer = true,
}: MobileWrapperProps) {
  const isMobile = useIsMobile();
  const isTouchDevice = useTouchFriendly();
  
  const mobileClasses = getMobileOptimizedClasses(
    enableMobileContainer && isMobile,
    enableTouchOptimization && isTouchDevice
  );
  
  return (
    <div className={cn(mobileClasses, className)}>
      {children}
    </div>
  );
}

/**
 * Higher-order component for mobile optimization
 */
export function withMobileOptimization<T extends Record<string, any>>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function MobileOptimizedComponent(props: T) {
    return (
      <MobileWrapper>
        <Component {...props} />
      </MobileWrapper>
    );
  };
}