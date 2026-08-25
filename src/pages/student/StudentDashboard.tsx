import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { TopicProgressList } from '../../components/ui/TopicProgressList';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { TOTAL_CURRICULUM_PROBLEMS } from '../../data/mockData';
import {
  User,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  ArrowUpRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setActiveTab } = useAuth();
  const student = currentUser.studentData;

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        No student profile linked. Please switch role using the top bar.
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner / Welcome with RBAC Tier 3 Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Tier 3 &bull; Enrolled Student Workspace</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
              {student.rollNo}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
            Welcome back, {student.name}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>Enrolled in <strong className="text-slate-800">{student.teamNumber}</strong></span>
            <span>•</span>
            <span>Faculty Mentor: <strong className="text-slate-800">{student.mentorName}</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">DSA Level: {student.dsaLevel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('exams')}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-indigo-200"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Weekly Exams</span>
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <Code2 className="w-4 h-4 shrink-0" />
            <span>Forge Code IDE</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid — 1-col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {/* 1. Profile Card */}
        <BentoCard
          title="Student Profile"
          subtitle="Academic Credentials"
          icon={<User className="w-4 h-4" />}
          className="col-span-1"
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <UserAvatar
                src={student.avatar}
                name={student.name}
                id={student.rollNo}
                role="STUDENT"
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-slate-900 truncate leading-snug">{student.name}</div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">{student.rollNo}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                <span className="text-slate-500 shrink-0">Team</span>
                <span className="font-bold text-slate-800 text-right">{student.teamNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                <span className="text-slate-500 shrink-0">Mentor</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[150px]">{student.mentorName}</span>
              </div>
              <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                <span className="text-slate-500 shrink-0">DSA Level</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] border border-blue-100/60">
                  {student.dsaLevel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-slate-500 shrink-0">Status</span>
                <StatusBadge status={student.status} size="sm" />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 2. Progress Card */}
        <BentoCard
          title="DSA Progress"
          subtitle="Curriculum Completion"
          icon={<Sparkles className="w-4 h-4 text-blue-600" />}
          action={
            <button
              onClick={() => setActiveTab('my-progress')}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="View full progress"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          }
          className="col-span-1 flex flex-col justify-between"
        >
          <div className="flex flex-col items-center justify-center my-auto py-2">
            <ProgressRing
              percentage={student.progress}
              size={130}
              strokeWidth={10}
              label="Completed"
              subLabel="Overall Target"
            />
            <div className="text-center mt-3">
              <div className="text-sm font-bold text-slate-900">{student.progress}% DSA Progress</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {student.solved} of {TOTAL_CURRICULUM_PROBLEMS} core problems mastered
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 3. Problems Card */}
        <BentoCard
          title="Problems Summary"
          subtitle="Solve Metrics"
          icon={<Code2 className="w-4 h-4 text-emerald-600" />}
          className="col-span-1"
        >
          <div className="space-y-3.5 pt-1">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Solved</div>
                <div className="text-lg font-bold text-emerald-900 mt-0.5">{student.solved}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-100">
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Attempted</div>
                <div className="text-lg font-bold text-blue-900 mt-0.5">{student.attempted}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100/80 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pending</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{student.pending}</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Accuracy Rate</span>
                <span className="font-bold text-slate-900">
                  {Math.round((student.solved / Math.max(1, student.attempted)) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Recent Solves</span>
                <span className="font-bold text-emerald-700">{student.recentActivities.length} Logged</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 4. Streak Card */}
        <BentoCard
          title="Activity Streak"
          subtitle="Consistency Meter"
          icon={<Flame className="w-4 h-4 text-amber-500" />}
          className="col-span-1"
        >
          <div className="space-y-3 pt-1">
            <StreakBadge streak={student.streak} size="lg" />

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Current Streak</span>
                <span className="font-bold text-amber-600">{student.streak} Days</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Longest Streak</span>
                <span className="font-bold text-slate-800">{student.longestStreak} Days</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-1.5 flex items-center justify-between">
                <span>Consistency Level</span>
                <span className="font-bold text-emerald-600">
                  {student.streak >= 10 ? 'High' : student.streak >= 5 ? 'Moderate' : 'Active'} ({Math.min(100, Math.round((student.streak / Math.max(1, student.longestStreak)) * 100))}%)
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 5. Topics Card (1 col on mobile, 2 cols on sm+) */}
        <BentoCard
          title="DSA Topics Breakdown"
          subtitle="8 Core Curriculum Domains"
          icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
          action={
            <button
              onClick={() => setActiveTab('my-progress')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Detailed View →
            </button>
          }
          className="col-span-1 sm:col-span-2 lg:col-span-2"
        >
          <div className="pt-2">
            <TopicProgressList topicProgress={student.topicProgress} />
          </div>
        </BentoCard>

        {/* 6. Activity Card (1 col on mobile, 2 cols on sm+) */}
        <BentoCard
          title="Recent Activity"
          subtitle="Latest Solved Problems & Submissions"
          icon={<Clock className="w-4 h-4 text-slate-600" />}
          action={
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Full Log →
            </button>
          }
          className="col-span-1 sm:col-span-2 lg:col-span-2"
        >
          <div className="space-y-2.5 pt-1">
            {student.recentActivities.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No activity recorded yet. Click <strong>Solve Problems</strong> above to start your practice!
              </div>
            ) : (
              student.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 sm:p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {act.action} {act.problemTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {act.topic} • {act.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-700 block">{act.timeAgo}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Passed Test Cases</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
