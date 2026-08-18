import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { Activity, Calendar, CheckCircle2, Clock, Flame, Award } from 'lucide-react';

export const StudentActivityPage: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser.studentData;

  if (!student) return null;

  // Calendar mock matrix for last 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const isSolved = (i % 3 !== 0 && i > 3) || (i >= 16);
    return {
      day: i + 1,
      solvedCount: isSolved ? (i % 4) + 1 : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
          <Activity className="w-4 h-4" />
          <span>Activity Timeline & Consistency</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Submission Logs & Streak</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Real-time activity feed, daily solve milestones, and streak records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Streak & Consistency Bento */}
        <BentoCard title="Current Streak" subtitle="Daily coding momentum" className="col-span-1">
          <div className="space-y-4 pt-2">
            <StreakBadge streak={student.streak} size="lg" />

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Longest Streak</span>
                <span className="font-bold text-slate-900">{student.longestStreak} Days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Active Days (Month)</span>
                <span className="font-bold text-emerald-700">22 / 28 Days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Submissions This Week</span>
                <span className="font-bold text-blue-700">14 Solved</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 28-Day Heatmap Bento */}
        <BentoCard
          title="Activity Heatmap"
          subtitle="Problem Solving Frequency (Last 4 Weeks)"
          icon={<Calendar className="w-4 h-4 text-blue-600" />}
          className="col-span-1 md:col-span-2"
        >
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => (
                <div
                  key={d.day}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center border transition-all text-xs font-mono ${
                    d.solvedCount > 2
                      ? 'bg-blue-600 text-white border-blue-700 font-bold'
                      : d.solvedCount > 0
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}
                  title={`Day ${d.day}: ${d.solvedCount} problems solved`}
                >
                  <span className="text-[10px] opacity-75">{d.day}</span>
                  {d.solvedCount > 0 && <span className="text-[9px] font-bold">+{d.solvedCount}</span>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Less</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-slate-100 border border-slate-200" />
                <div className="w-3 h-3 rounded-xs bg-blue-100" />
                <div className="w-3 h-3 rounded-xs bg-blue-600" />
              </div>
              <span>More</span>
            </div>
          </div>
        </BentoCard>

        {/* Full Chronological Logs */}
        <div className="col-span-1 md:col-span-3">
          <BentoCard
            title="Chronological Submission Feed"
            subtitle="Verified solutions submitted on GKCE code bench"
            icon={<Clock className="w-4 h-4 text-slate-700" />}
          >
            <div className="space-y-3 pt-2">
              {student.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {act.action} {act.problemTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Topic: {act.topic} • Complexity: {act.difficulty} • Memory: 41.2 MB
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700">{act.timeAgo}</span>
                    <div className="text-[10px] text-emerald-600 font-medium">All Test Cases Passed</div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
