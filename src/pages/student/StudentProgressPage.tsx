import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { TopicProgressList } from '../../components/ui/TopicProgressList';
import { TrendingUp, BookOpen, Target, Sparkles } from 'lucide-react';
import { DSA_TOPICS, TOTAL_CURRICULUM_PROBLEMS, ACTIVE_TOPICS_COUNT } from '../../data/mockData';

export const StudentProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser.studentData;

  if (!student) return null;

  const totalCurriculum = TOTAL_CURRICULUM_PROBLEMS;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Curriculum Mastery Analytics</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">My DSA Progress & Roadmap</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Track individual mastery across all {ACTIVE_TOPICS_COUNT} modules prescribed by GKCE Department of Computer Science.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ring & Overall Summary */}
        <BentoCard title="Overall Completion" subtitle="Curriculum Weightage" className="col-span-1 h-full">
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="flex flex-col items-center justify-center my-auto py-2 text-center">
              <ProgressRing percentage={student.progress} size={136} strokeWidth={11} label="Completed" subLabel="Curriculum" />
              <div className="mt-3 space-y-1">
                <div className="text-base font-bold text-slate-900">{student.solved} Problems Solved</div>
                <div className="text-xs text-slate-500">{totalCurriculum} Required for 100% Mastery</div>
              </div>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Curriculum Status</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                student.progress >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {student.progress >= 70 ? 'Milestone Cleared (≥70%)' : 'In Progress'}
              </span>
            </div>
          </div>
        </BentoCard>

        {/* Difficulty Distribution */}
        <BentoCard title="Difficulty Mastery" subtitle="Solved by Complexity" className="col-span-1 md:col-span-2 h-full">
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Easy Problems
                  </span>
                  <span className="font-semibold text-slate-900">
                    {student.difficultyStats.easy.solved} / {student.difficultyStats.easy.total} (
                    {Number(((student.difficultyStats.easy.solved / Math.max(1, student.difficultyStats.easy.total)) * 100).toFixed(1))}%)
                  </span>
                </div>
                <ProgressBar
                  percentage={(student.difficultyStats.easy.solved / Math.max(1, student.difficultyStats.easy.total)) * 100}
                  color="emerald"
                  height="md"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Medium Problems
                  </span>
                  <span className="font-semibold text-slate-900">
                    {student.difficultyStats.medium.solved} / {student.difficultyStats.medium.total} (
                    {Number(((student.difficultyStats.medium.solved / Math.max(1, student.difficultyStats.medium.total)) * 100).toFixed(1))}%)
                  </span>
                </div>
                <ProgressBar
                  percentage={(student.difficultyStats.medium.solved / Math.max(1, student.difficultyStats.medium.total)) * 100}
                  color="amber"
                  height="md"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Hard Problems
                  </span>
                  <span className="font-semibold text-slate-900">
                    {student.difficultyStats.hard.solved} / {student.difficultyStats.hard.total} (
                    {Number(((student.difficultyStats.hard.solved / Math.max(1, student.difficultyStats.hard.total)) * 100).toFixed(1))}%)
                  </span>
                </div>
                <ProgressBar
                  percentage={(student.difficultyStats.hard.solved / Math.max(1, student.difficultyStats.hard.total)) * 100}
                  color="slate"
                  height="md"
                />
              </div>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block font-medium">Easy Solved</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{student.difficultyStats.easy.solved}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block font-medium">Medium Solved</span>
                <span className="font-bold text-amber-700 font-mono text-sm">{student.difficultyStats.medium.solved}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block font-medium">Hard Solved</span>
                <span className="font-bold text-rose-700 font-mono text-sm">{student.difficultyStats.hard.solved}</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 8 Topics Grid Full */}
        <div className="col-span-1 md:col-span-3">
          <BentoCard
            title={`Comprehensive ${ACTIVE_TOPICS_COUNT}-Module Syllabus Progress`}
            subtitle="Autonomous Academic Syllabus breakdown"
            icon={<BookOpen className="w-4 h-4 text-blue-600" />}
          >
            <div className="pt-2">
              <TopicProgressList topicProgress={student.topicProgress} />
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
