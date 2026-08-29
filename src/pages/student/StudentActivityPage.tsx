import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { Activity, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const StudentActivityPage: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser.studentData;

  if (!student) return null;

  const totalWeeklySubmissions = (student.submissionsHistory || []).reduce((acc, curr) => acc + curr.count, 0);

  // Real 28-day activity heatmap based on authentic submission history and daily solves
  const days = Array.from({ length: 28 }, (_, i) => {
    const daysAgo = 27 - i;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.getDate();

    // Match against real submission history date
    const historyEntry = (student.submissionsHistory || []).find((sh) => sh.date === dateStr);
    let solvedCount = historyEntry ? historyEntry.count : 0;

    // Check today's real-time activities if any
    if (solvedCount === 0 && daysAgo === 0 && student.recentActivities && student.recentActivities.length > 0) {
      const todayActs = student.recentActivities.filter(
        (a) => a.timeAgo.includes('Just now') || a.timeAgo.includes('Today') || a.timeAgo.includes('m ago') || a.timeAgo.includes('h ago')
      );
      if (todayActs.length > 0) {
        solvedCount = todayActs.length;
      }
    }

    return {
      day: dayLabel,
      date: dateStr,
      solvedCount,
    };
  });

  const activeDaysCount = days.filter((d) => d.solvedCount > 0).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
          <Activity className="w-4 h-4" />
          <span>Activity Timeline & Consistency</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Submission Logs & Streak</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Real-time activity feed, daily solve milestones, and streak records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Streak & Consistency Bento */}
        <BentoCard title="Current Streak" subtitle="Daily coding momentum" className="col-span-1">
          <div className="space-y-4 pt-2">
            <StreakBadge streak={student.streak} size="lg" />

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Longest Streak</span>
                <span className="font-bold text-slate-900">{student.longestStreak} Days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Active Days (Month)</span>
                <span className="font-bold text-emerald-700">{activeDaysCount} / 28 Days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Submissions This Week</span>
                <span className="font-bold text-blue-700">{totalWeeklySubmissions > 0 ? totalWeeklySubmissions : student.recentActivities.length} Logged</span>
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
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((d) => (
                <div
                  key={d.day}
                  className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center border transition-all text-xs font-mono min-w-0 ${
                    d.solvedCount > 2
                      ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-2xs'
                      : d.solvedCount > 0
                      ? 'bg-blue-100 text-blue-900 border-blue-200 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}
                  title={`Day ${d.day}: ${d.solvedCount} problems solved`}
                >
                  <span className="text-[10px] sm:text-xs opacity-75">{d.day}</span>
                  {d.solvedCount > 0 && <span className="text-[8px] sm:text-[9px] font-bold">+{d.solvedCount}</span>}
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
            <div className="space-y-2.5 pt-2">
              {student.recentActivities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No submissions logged yet. Navigate to the <strong>Problems Bank</strong> to solve coding challenges and build your activity streak!
                </div>
              ) : (
                student.recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 sm:p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between hover:bg-slate-50 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${act.status === 'Attempted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {act.status === 'Attempted' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {act.action} {act.problemTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          Topic: {act.topic} • Complexity: {act.difficulty}
                        </div>
                      </div>
                    </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-semibold text-slate-600 block">{act.timeAgo}</span>
                        <span className={`text-[9px] font-bold block mt-0.5 ${act.status === 'Attempted' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {act.status === 'Attempted' ? 'Attempted' : 'Verified Correct'}
                        </span>
                      </div>
                  </div>
                ))
              )}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

