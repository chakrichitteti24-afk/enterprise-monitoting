import React from 'react';
import { motion } from 'framer-motion';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showGlow?: boolean;
  animated?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-9 h-9 sm:w-10 sm:h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = false,
  animated = false,
}) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  const inner = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}
    >
      {showGlow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-2xl blur-sm opacity-60 animate-pulse -z-10" />
      )}
      <img
        src="/favicon.svg"
        alt="GKCE DSA Platform Logo"
        className="w-full h-full object-contain rounded-2xl shadow-sm drop-shadow-sm"
        draggable={false}
      />
    </div>
  );

  if (!animated) {
    return inner;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-flex shrink-0 cursor-pointer"
    >
      {inner}
    </motion.div>
  );
};

export default AppLogo;
