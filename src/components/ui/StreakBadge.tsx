import React from 'react';
import { Flame } from 'lucide-react';
import { clsx } from 'clsx';

interface StreakBadgeProps {
  streak: number;
  longestStreak?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  size = 'md',
  showLabel = true,
}) => {
  const isHigh = streak >= 7;

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/70 p-3.5 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
        </div>
        <div className="min-w-0">
          <div className="text-lg font-bold text-slate-900 leading-tight truncate">
            {streak} Day Streak
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">
            {streak > 0 ? 'Consistent daily solve' : 'No streak recorded'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap shrink-0 shadow-2xs leading-tight select-none',
        isHigh
          ? 'bg-amber-50 text-amber-900 border-amber-200/90'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      )}
    >
      <Flame
        className={clsx(
          'w-3.5 h-3.5 shrink-0',
          isHigh ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
        )}
      />
      <span>
        {streak} {showLabel ? (streak === 1 ? 'Day' : 'Days') : ''}
      </span>
    </div>
  );
};
