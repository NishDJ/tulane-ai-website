'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStateProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
  onClose?: () => void;
  className?: string;
}

export const FormStateAlert = ({
  type,
  message,
  visible,
  onClose,
  className = ''
}: FormStateProps) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600'
    }
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            'flex items-center p-4 border rounded-lg',
            colorScheme.bg,
            className
          )}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <Icon className={cn('w-5 h-5 mr-3', colorScheme.icon)} />
          </motion.div>
          
          <p className={cn('flex-1', colorScheme.text)}>{message}</p>
          
          {onClose && (
            <motion.button
              onClick={onClose}
              className={cn('ml-3 hover:opacity-70', colorScheme.text)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XCircle className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SubmissionStateProps {
  state: 'idle' | 'submitting' | 'success' | 'error';
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export const SubmissionState = ({
  state,
  successMessage = 'Form submitted successfully!',
  errorMessage = 'An error occurred. Please try again.',
  className = ''
}: SubmissionStateProps) => {
  return (
    <div className={cn('min-h-[60px] flex items-center justify-center', className)}>
      <AnimatePresence mode="wait">
        {state === 'submitting' && (
          <motion.div
            key="submitting"
            className="flex items-center space-x-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-6 h-6 border-2 border-tulane-green border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-gray-600">Submitting...</span>
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            className="flex items-center space-x-3 text-green-600"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-6 h-6" />
            </motion.div>
            <span>{successMessage}</span>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            className="flex items-center space-x-3 text-red-600"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <XCircle className="w-6 h-6" />
            </motion.div>
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProgressBar = ({
  progress,
  className = '',
  showPercentage = true,
  animated = true
}: {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Progress</span>
        {showPercentage && (
          <motion.span
            className="text-sm text-gray-600"
            key={progress}
            initial={animated ? { opacity: 0, scale: 0.8 } : {}}
            animate={animated ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-tulane-green to-tulane-blue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export const ValidationIcon = ({
  isValid,
  isValidating = false,
  className = ''
}: {
  isValid?: boolean;
  isValidating?: boolean;
  className?: string;
}) => {
  return (
    <div className={cn('flex items-center justify-center w-5 h-5', className)}>
      <AnimatePresence mode="wait">
        {isValidating && (
          <motion.div
            key="validating"
            className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
              rotate: { duration: 1, repeat: Infinity, ease: "linear" }
            }}
          />
        )}

        {!isValidating && isValid === true && (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
        )}

        {!isValidating && isValid === false && (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <XCircle className="w-4 h-4 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};