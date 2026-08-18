import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  height?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'slate';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 'sm',
  showLabel = false,
  label,
  color = 'indigo',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const heightClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[height];

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    indigo: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-600',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500',
    slate: 'bg-gradient-to-r from-slate-600 to-slate-800',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-medium">
          {label && <span>{label}</span>}
          {showLabel && <span className="font-semibold text-slate-800">{clamped}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-100/80 rounded-full overflow-hidden p-0.5 border border-slate-200/50', heightClasses)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className={clsx('h-full rounded-full shadow-2xs', colorClasses)}
        />
      </div>
    </div>
  );
};
