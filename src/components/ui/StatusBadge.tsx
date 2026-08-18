import React from 'react';
import { clsx } from 'clsx';
import { StudentStatus } from '../../types';

interface StatusBadgeProps {
  status: StudentStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-500';

  if (status === 'Active') {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotClass = 'bg-emerald-500';
  } else if (status === 'Needs Attention') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotClass = 'bg-amber-500';
  } else if (status === 'Inactive') {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
    dotClass = 'bg-slate-400';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px] font-semibold' : 'px-3 py-1 text-xs font-bold';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap shrink-0 leading-none select-none transition-colors shadow-2xs',
        bgClass,
        sizeClasses
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotClass)} />
      <span>{status}</span>
    </span>
  );
};
