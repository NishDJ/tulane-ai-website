'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  shadowIntensity?: 'light' | 'medium' | 'strong';
}

export const HoverCard = ({ 
  children, 
  className = '',
  hoverScale = 1.02,
  shadowIntensity = 'medium'
}: HoverCardProps) => {
  const shadowClasses = {
    light: 'hover:shadow-md',
    medium: 'hover:shadow-lg',
    strong: 'hover:shadow-xl'
  };

  return (
    <motion.div
      className={cn(
        'transition-shadow duration-300 cursor-pointer',
        shadowClasses[shadowIntensity],
        className
      )}
      whileHover={{ 
        scale: hoverScale,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
};

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const InteractiveButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false
}: InteractiveButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = "relative overflow-hidden font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-tulane-green text-white hover:bg-tulane-green/90 focus:ring-tulane-green/50",
    secondary: "bg-tulane-blue text-white hover:bg-tulane-blue/90 focus:ring-tulane-blue/50",
    ghost: "bg-transparent text-tulane-green border border-tulane-green hover:bg-tulane-green hover:text-white focus:ring-tulane-green/50"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={!disabled ? { 
        scale: 1.05,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={isPressed ? { 
          scale: 1, 
          opacity: [0, 1, 0],
          transition: { duration: 0.6 }
        } : {}}
      />
      
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* Button content */}
      <motion.span
        className={loading ? "opacity-0" : "opacity-100"}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

interface AnimatedInputProps {
  label: string;
  type?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const AnimatedInput = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  className = '',
  required = false
}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = (value || '').length > 0;

  return (
    <div className={cn("relative", className)}>
      <motion.input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tulane-green/50 peer",
          error ? "border-red-500" : "border-gray-300 focus:border-tulane-green",
          hasValue || isFocused ? "pt-6 pb-2" : ""
        )}
        required={required}
      />
      
      {/* Floating label */}
      <motion.label
        className={cn(
          "absolute left-3 text-gray-500 pointer-events-none transition-all duration-200",
          error ? "text-red-500" : "",
          hasValue || isFocused ? "text-xs top-1.5 text-tulane-green" : "text-base top-2"
        )}
        animate={{
          fontSize: hasValue || isFocused ? "0.75rem" : "1rem",
          y: hasValue || isFocused ? -8 : 0,
          color: error ? "#ef4444" : (hasValue || isFocused ? "#006747" : "#6b7280")
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PulseIcon = ({ 
  children, 
  className = '',
  intensity = 'medium' 
}: { 
  children: ReactNode; 
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}) => {
  const intensityScale = {
    light: 1.05,
    medium: 1.1,
    strong: 1.2
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      whileHover={{
        scale: intensityScale[intensity],
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
};

export const FloatingActionButton = ({
  children,
  onClick,
  className = '',
  size = 'md'
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.button
      className={cn(
        "fixed bottom-6 right-6 bg-tulane-green text-white rounded-full shadow-lg flex items-center justify-center z-50",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 10px 25px rgba(0, 103, 71, 0.3)"
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      {children}
    </motion.button>
  );
};