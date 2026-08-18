import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  padding?: 'none' | 'sm' | 'normal' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  title,
  subtitle,
  icon,
  action,
  badge,
  padding = 'normal',
  onClick,
  hoverable = false,
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    normal: 'p-4 sm:p-5 md:p-6',
    lg: 'p-5 sm:p-6 md:p-8',
  }[padding];

  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hoverable || onClick
          ? { y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } }
          : undefined
      }
      whileTap={onClick ? { scale: 0.985, transition: { duration: 0.1 } } : undefined}
      className={twMerge(
        clsx(
          'glass-panel rounded-[24px] sm:rounded-[28px] transition-colors duration-200 flex flex-col justify-between overflow-hidden relative group gpu-layer',
          hoverable && 'glass-card-hover cursor-pointer',
          onClick && 'cursor-pointer',
          paddingClasses,
          className
        )
      )}
    >
      {(title || subtitle || icon || action || badge) && (
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {icon && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-b from-slate-100/95 to-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs border border-white/80">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <div className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate leading-snug">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {action}
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1">{children}</div>
    </motion.div>
  );
};
