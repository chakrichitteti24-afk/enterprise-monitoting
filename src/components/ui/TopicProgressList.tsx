import React from 'react';
import { DSATopic } from '../../types';
import { DSA_TOPICS } from '../../data/mockData';
import { ProgressBar } from './ProgressBar';

interface TopicProgressListProps {
  topicProgress: Record<DSATopic, { solved: number; total: number; percentage: number }>;
  compact?: boolean;
  onTopicClick?: (topic: DSATopic) => void;
}

export const TopicProgressList: React.FC<TopicProgressListProps> = ({
  topicProgress,
  compact = false,
  onTopicClick,
}) => {
  return (
    <div className={compact ? 'space-y-2.5' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
      {DSA_TOPICS.map((topic) => {
        const data = topicProgress[topic] || { solved: 0, total: 10, percentage: 0 };
        const isMastered = data.percentage >= 80;
        const isStarted = data.percentage > 0;

        return (
          <div
            key={topic}
            onClick={() => onTopicClick?.(topic)}
            className={`p-3 sm:p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition-all ${
              onTopicClick ? 'cursor-pointer' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs mb-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 min-w-0">
                <span className="truncate">{topic}</span>
                {isMastered && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md shrink-0">
                    Mastered
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-[11px] font-medium shrink-0 flex items-center gap-1 text-right">
                <span className="text-slate-900 font-bold">{data.solved}</span>
                <span className="text-slate-400">/{data.total}</span>
                <span className="ml-1 text-slate-700 font-bold bg-white px-1.5 py-0.5 rounded-md border border-slate-200/60 shadow-2xs font-mono">
                  {data.percentage}%
                </span>
              </div>
            </div>
            <ProgressBar
              percentage={data.percentage}
              height="xs"
              color={
                data.percentage >= 75
                  ? 'emerald'
                  : data.percentage >= 40
                  ? 'indigo'
                  : isStarted
                  ? 'amber'
                  : 'slate'
              }
            />
          </div>
        );
      })}
    </div>
  );
};
