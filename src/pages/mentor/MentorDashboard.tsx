import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { DSA_TOPICS } from '../../data/mockData';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  BarChart3,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { Student } from '../../types';

export const MentorDashboard: React.FC = () => {
  const { currentUser, students, teams, setSelectedStudent, setActiveTab } = useAuth();

  const assignedTeamNumber = currentUser.teamNumber || 'Team 07';
  const assignedTeamId = currentUser.teamId || 'team-7';

  // Strictly retrieve ONLY the assigned students
  const teamStudents = students.filter((s) => s.teamId === assignedTeamId || s.teamNumber === assignedTeamNumber);
  const team = teams.find((t) => t.id === assignedTeamId || t.teamNumber === assignedTeamNumber);

  const avgProgress = teamStudents.length > 0 ? Math.round(teamStudents.reduce((a, b) => a + b.progress, 0) / teamStudents.length) : (team?.avgProgress || 0);
  const totalProblemsSolved = teamStudents.reduce((sum, st) => sum + st.solved, 0);
  const avgStreak = teamStudents.length > 0 ? Math.round((teamStudents.reduce((sum, st) => sum + st.streak, 0) / teamStudents.length) * 10) / 10 : 0;

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header matching specifications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-100">
            <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Mentor Monitoring Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight truncate">
            {assignedTeamNumber}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>Cohort of <strong>{teamStudents.length} Students</strong></span>
            <span>•</span>
            <span>Faculty Mentor: <strong className="text-slate-800">{currentUser.name}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('students')}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage ({teamStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
        {/* 1. Team Progress Card */}
        <BentoCard
          title="Team Progress"
          subtitle="Overall Cohort Mastery"
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
          className="col-span-1"
        >
          <div className="flex flex-col items-center justify-center my-auto py-3 text-center">
            <ProgressRing
              percentage={avgProgress}
              size={130}
              strokeWidth={10}
              color="#2563eb"
              label="Team Average"
            />
            <div className="mt-3">
              <div className="text-sm font-bold text-slate-900">{avgProgress}% Team Progress</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Target: &gt;70% milestone for GKCE Term Evaluation
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 2. Team Analytics Card */}
        <BentoCard
          title="Team Analytics"
          subtitle="Aggregate Performance"
          icon={<BarChart3 className="w-4 h-4 text-indigo-600" />}
          className="col-span-1 lg:col-span-3"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">Avg Progress</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{avgProgress}%</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">
                {teamStudents.filter(s => s.progress >= 70).length} / {teamStudents.length} On Target
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">Problems Solved</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{totalProblemsSolved}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Across {teamStudents.length} students</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">Average Streak</div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1">{avgStreak}d</div>
              <div className="text-[10px] text-amber-600 font-bold mt-1">Daily consistency</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">Active Cohort</div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
                {teamStudents.filter(s => s.status === 'Active').length} / {teamStudents.length}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">
                {teamStudents.length > 0 ? Math.round((teamStudents.filter(s => s.status === 'Active').length / teamStudents.length) * 100) : 0}% active rate
              </div>
            </div>
          </div>

          {/* Quick Topic Overview */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
              <span>Topic Performance Overview</span>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-blue-600 hover:underline text-[11px] font-semibold"
              >
                Deep Analytics →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DSA_TOPICS.slice(0, 4).map((topic) => {
                const perc = teamStudents.length > 0
                  ? Math.round(teamStudents.reduce((sum, st) => sum + (st.topicProgress[topic]?.percentage || 0), 0) / teamStudents.length)
                  : (team?.topicPerformance[topic] || 0);
                return (
                  <div key={topic} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span className="truncate pr-1">{topic}</span>
                      <span className="font-bold shrink-0">{perc}%</span>
                    </div>
                    <ProgressBar percentage={perc} height="xs" color={perc >= 80 ? 'emerald' : 'indigo'} />
                  </div>
                );
              })}
            </div>
          </div>
        </BentoCard>

        {/* 3. The Exactly 5 Assigned Student Cards (Prompt Requirement) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Assigned Students ({teamStudents.length})
            </h2>
            <span className="text-[11px] text-slate-400">Click any card to open student detail & log feedback</span>
          </div>

          {/* 5 Student Bento Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {teamStudents.map((st) => (
              <motion.div
                key={st.id}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleStudentClick(st)}
                className="p-4 sm:p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group gpu-layer"
              >
                <div>
                  {/* Top: Avatar, Name, Roll No, Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <UserAvatar
                      src={st.avatar}
                      name={st.name}
                      id={st.rollNo}
                      role="STUDENT"
                      size="md"
                    />
                    <StatusBadge status={st.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate leading-snug">
                    {st.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    {st.rollNo}
                  </div>

                  {/* Core Metrics: Progress & Problems Solved */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-500 font-medium">Progress</span>
                        <span className="font-bold text-slate-900">{st.progress}%</span>
                      </div>
                      <ProgressBar
                        percentage={st.progress}
                        height="xs"
                        color={st.progress >= 80 ? 'emerald' : st.progress >= 70 ? 'indigo' : 'amber'}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-medium">Problems</span>
                      <span className="font-bold text-slate-900">{st.solved} Solved</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Streak</span>
                      <StreakBadge streak={st.streak} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>View Full Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
