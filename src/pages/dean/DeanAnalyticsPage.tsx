import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DSA_TOPICS } from '../../data/mockData';
import { BarChart3, TrendingUp, Users, Target, Award, PieChart, Activity } from 'lucide-react';

export const DeanAnalyticsPage: React.FC = () => {
  const { students, teams, mentors } = useAuth();

  const totalProblemsSolved = students.reduce((acc, s) => acc + s.solved, 0);
  const avgProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / Math.max(1, students.length));

  // Topic Averages across students
  const topicAverages = DSA_TOPICS.map((topic) => {
    const avg = Math.round(
      students.reduce((sum, st) => sum + (st.topicProgress[topic]?.percentage || 0), 0) / Math.max(1, students.length)
    );
    const totalSolvedInTopic = students.reduce((sum, st) => sum + (st.topicProgress[topic]?.solved || 0), 0);
    return {
      topic,
      percentage: avg,
      solved: totalSolvedInTopic,
    };
  });

  // Difficulty aggregates across students
  const easyTotalSolved = students.reduce((sum, st) => sum + st.difficultyStats.easy.solved, 0);
  const mediumTotalSolved = students.reduce((sum, st) => sum + st.difficultyStats.medium.solved, 0);
  const hardTotalSolved = students.reduce((sum, st) => sum + st.difficultyStats.hard.solved, 0);

  const totalPossibleEasy = students.reduce((sum, st) => sum + st.difficultyStats.easy.total, 0) || 1;
  const totalPossibleMedium = students.reduce((sum, st) => sum + st.difficultyStats.medium.total, 0) || 1;
  const totalPossibleHard = students.reduce((sum, st) => sum + st.difficultyStats.hard.total, 0) || 1;

  const activeCount = students.filter((s) => s.status === 'Active').length;
  const attentionCount = students.filter((s) => s.status === 'Needs Attention').length;
  const inactiveCount = students.filter((s) => s.status === 'Inactive').length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Institution-Wide Macro Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">DSA Learning Analytics</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Verified performance insights, topic progress analytics, and cohort velocity across {students.length} students.
          </p>
        </div>
      </div>

      {/* Top 3 KPI Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <BentoCard title="Cohort Completion Rate" subtitle={`${students.length} Student Average`} className="col-span-1">
          <div className="flex flex-col items-center justify-center py-3 text-center">
            <ProgressRing percentage={avgProgress} size={130} strokeWidth={10} color="#1d4ed8" />
            <div className="mt-3">
              <div className="text-sm font-bold text-slate-900">{avgProgress}% Batch Completion</div>
              <div className="text-[11px] text-slate-400">{totalProblemsSolved} Total Problems Verified</div>
            </div>
          </div>
        </BentoCard>

        {/* Status Distribution */}
        <BentoCard title="Engagement Segmentation" subtitle="Active vs Risk Breakdown" className="col-span-1">
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-900">Active Students</span>
              </div>
              <span className="text-sm font-bold text-emerald-900">{activeCount} / {students.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-amber-900">Needs Attention</span>
              </div>
              <span className="text-sm font-bold text-amber-900">{attentionCount} / {students.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-800">Inactive / Low Solve</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{inactiveCount} / {students.length}</span>
            </div>
          </div>
        </BentoCard>

        {/* Difficulty Distribution Across All Students */}
        <BentoCard title="Difficulty Solves Aggregate" subtitle="Total solutions by tier" className="col-span-1">
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Easy Solves</span>
                <span className="font-bold text-emerald-700">{easyTotalSolved} / {totalPossibleEasy}</span>
              </div>
              <ProgressBar percentage={(easyTotalSolved / totalPossibleEasy) * 100} color="emerald" height="xs" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Medium Solves</span>
                <span className="font-bold text-amber-700">{mediumTotalSolved} / {totalPossibleMedium}</span>
              </div>
              <ProgressBar percentage={(mediumTotalSolved / totalPossibleMedium) * 100} color="amber" height="xs" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Hard Solves</span>
                <span className="font-bold text-rose-700">{hardTotalSolved} / {totalPossibleHard}</span>
              </div>
              <ProgressBar percentage={(hardTotalSolved / totalPossibleHard) * 100} color="slate" height="xs" />
            </div>
          </div>
        </BentoCard>
      </div>

      {/* 8 DSA Topics Macro Benchmark */}
      <BentoCard
        title={`8 DSA Topics Macro Mastery (${students.length} Students)`}
        subtitle="Institution-wide syllabus completion rate"
        icon={<Target className="w-4 h-4 text-blue-600" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {topicAverages.map((t) => (
            <div key={t.topic} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-slate-800">{t.topic}</span>
                <span className="font-bold text-blue-700">{t.percentage}%</span>
              </div>
              <ProgressBar
                percentage={t.percentage}
                height="xs"
                color={t.percentage >= 80 ? 'emerald' : t.percentage >= 65 ? 'indigo' : 'amber'}
              />
              <div className="text-[10px] text-slate-400 mt-2 flex justify-between">
                <span>Total Solves</span>
                <span className="font-mono font-semibold text-slate-600">{t.solved}</span>
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* All Teams Ranked Comparison Chart */}
      <BentoCard
        title={`${teams.length} Teams Comparative Velocity Benchmark`}
        subtitle="Ranked by average cohort progress %"
        icon={<TrendingUp className="w-4 h-4 text-indigo-600" />}
      >
        <div className="space-y-2.5 pt-2">
          {teams.map((tm) => (
            <div key={tm.id} className="flex items-center gap-3 text-xs">
              <span className="w-16 font-bold text-slate-900 font-mono shrink-0">
                {tm.teamNumber}
              </span>
              <span className="w-32 text-slate-500 truncate hidden sm:block shrink-0">
                {tm.mentorName}
              </span>
              <div className="flex-1">
                <ProgressBar
                  percentage={tm.avgProgress}
                  height="xs"
                  color={tm.avgProgress >= 85 ? 'emerald' : tm.avgProgress >= 70 ? 'indigo' : 'amber'}
                />
              </div>
              <span className="w-12 text-right font-bold text-slate-900 shrink-0 font-mono">
                {tm.avgProgress}%
              </span>
            </div>
          ))}
        </div>
      </BentoCard>
    </div>
  );
};
