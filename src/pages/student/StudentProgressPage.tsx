import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { TopicProgressList } from '../../components/ui/TopicProgressList';
import { TrendingUp, BookOpen, Target, Sparkles } from 'lucide-react';
import { DSA_TOPICS } from '../../data/mockData';

export const StudentProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser.studentData;

  if (!student) return null;

  const totalCurriculum =
    student.difficultyStats.easy.total +
    student.difficultyStats.medium.total +
    student.difficultyStats.hard.total;

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
          Track individual mastery across all 8 modules prescribed by GKCE Department of Computer Science.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ring & Overall Summary */}
        <BentoCard title="Overall Completion" subtitle="Curriculum Weightage" className="col-span-1">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <ProgressRing percentage={student.progress} size={150} strokeWidth={12} />
            <div className="mt-4 space-y-1">
              <div className="text-base font-bold text-slate-900">{student.solved} Problems Solved</div>
              <div className="text-xs text-slate-500">{totalCurriculum} Required to reach 100% Mastery</div>
            </div>
          </div>
        </BentoCard>

        {/* Difficulty Distribution */}
        <BentoCard title="Difficulty Mastery" subtitle="Solved by Complexity" className="col-span-1 md:col-span-2">
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Easy Problems
                </span>
                <span className="font-semibold text-slate-900">
                  {student.difficultyStats.easy.solved} / {student.difficultyStats.easy.total} (
                  {Math.round((student.difficultyStats.easy.solved / Math.max(1, student.difficultyStats.easy.total)) * 100)}%)
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
                  {Math.round((student.difficultyStats.medium.solved / Math.max(1, student.difficultyStats.medium.total)) * 100)}%)
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
                  {Math.round((student.difficultyStats.hard.solved / Math.max(1, student.difficultyStats.hard.total)) * 100)}%)
                </span>
              </div>
              <ProgressBar
                percentage={(student.difficultyStats.hard.solved / Math.max(1, student.difficultyStats.hard.total)) * 100}
                color="slate"
                height="md"
              />
            </div>
          </div>
        </BentoCard>

        {/* 8 Topics Grid Full */}
        <div className="col-span-1 md:col-span-3">
          <BentoCard
            title="Comprehensive 8-Module Syllabus Progress"
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
