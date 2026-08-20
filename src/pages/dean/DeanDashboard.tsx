import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  TrendingUp,
  Layers,
  ChevronRight,
  Search,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const DeanDashboard: React.FC = () => {
  const { teams, students, mentors, setSelectedTeam, setActiveTab } = useAuth();
  const [teamStatusFilter, setTeamStatusFilter] = useState<'All' | 'Active' | 'Needs Attention' | 'Inactive'>('All');
  const [searchTeam, setSearchTeam] = useState('');

  // Top Stats from prompt specifications
  const totalStudents = students.length; // 100
  const totalTeams = teams.length; // 20
  const totalMentors = mentors.length; // 20
  const overallProgress = Math.round(students.reduce((sum, s) => sum + s.progress, 0) / Math.max(1, students.length)); // ~76%

  const filteredTeams = teams.filter((t) => {
    const matchesStatus = teamStatusFilter === 'All' || t.status === teamStatusFilter;
    const matchesSearch = t.teamNumber.toLowerCase().includes(searchTeam.toLowerCase()) ||
      t.mentorName.toLowerCase().includes(searchTeam.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const topPerformingTeams = [...teams].sort((a, b) => b.avgProgress - a.avgProgress).slice(0, 3);
  const needsAttentionTeams = teams.filter((t) => t.status === 'Needs Attention' || t.status === 'Inactive');

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Dean & Department Oversight</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
            GKCE DSA Student Monitoring Platform
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>{totalStudents} engineering students across {totalTeams} mentored teams</span>
            <span>•</span>
            <span>Academic Term 2025-26</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold transition-colors"
          >
            Export Report
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>View 100 Students</span>
          </button>
        </div>
      </div>

      {/* Top Key Statistics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. 100 Students */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{totalStudents}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5">Total Students</div>
          </div>
        </div>

        {/* 2. 20 Teams */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{totalTeams}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5">Monitored Teams</div>
          </div>
        </div>

        {/* 3. 20 Mentors */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{totalMentors}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5">Faculty Mentors</div>
          </div>
        </div>

        {/* 4. 76% Overall Progress */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 tracking-tight leading-tight">{overallProgress}%</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Main Dean Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Large Overall Progress Card */}
        <BentoCard
          title="Overall DSA Completion"
          subtitle="Curriculum Benchmark"
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
          action={
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Analytics →
            </button>
          }
          className="col-span-1"
        >
          <div className="flex flex-col items-center justify-center py-3 text-center">
            <ProgressRing
              percentage={overallProgress}
              size={140}
              strokeWidth={11}
              color="#1d4ed8"
              label="Completed"
              subLabel="100 Students"
            />
            <div className="mt-3 space-y-1">
              <div className="text-sm font-bold text-slate-900">
                {overallProgress}% DSA Completion
              </div>
              <div className="text-[11px] text-slate-500">
                Across 100 students in 20 teams (5 students each)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-2xl bg-slate-50">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Active</div>
                <div className="text-sm font-extrabold text-emerald-700">
                  {students.filter(s => s.status === 'Active').length}
                </div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Attention</div>
                <div className="text-sm font-extrabold text-amber-700">
                  {students.filter(s => s.status === 'Needs Attention').length}
                </div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Inactive</div>
                <div className="text-sm font-extrabold text-slate-600">
                  {students.filter(s => s.status === 'Inactive').length}
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Top Performing Teams & At-Risk Alert */}
        <BentoCard
          title="Team Benchmarks & Alerts"
          subtitle="Performance Outliers & Support Queue"
          icon={<Award className="w-4 h-4 text-amber-600" />}
          className="col-span-1 lg:col-span-2 flex flex-col justify-between"
        >
          <div className="space-y-4 pt-1">
            {/* Top 3 Teams */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Top Performing Teams
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {topPerformingTeams.map((tm, idx) => (
                  <motion.div
                    key={tm.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTeam(tm)}
                    className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{tm.teamNumber}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{tm.mentorName}</div>
                    <div className="mt-2.5 flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="font-bold text-blue-700">{tm.avgProgress}%</span>
                      <span className="text-[10px] text-slate-400 font-medium">{tm.totalSolved} solved</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Needs Attention Alert Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-amber-900">
                    {needsAttentionTeams.length} Teams flagged for Mentor Academic Review
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    {needsAttentionTeams.map(t => t.teamNumber).join(', ')} require dynamic programming & recursion intervention.
                  </div>
                </div>
                <button
                  onClick={() => setTeamStatusFilter('Needs Attention')}
                  className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded-xl text-xs font-semibold hover:bg-amber-100 shrink-0 shadow-2xs"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>20 Teams • Exactly 5 Students per Team</span>
            <button
              onClick={() => setActiveTab('teams')}
              className="text-blue-600 hover:underline font-bold"
            >
              View Full 20-Team Roster →
            </button>
          </div>
        </BentoCard>
      </div>

      {/* Team Performance Grid: ALL 20 TEAMS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Team Performance Grid (All 20 Teams)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any team card to drill down into its 5 students and individual performance.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Pills */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl text-xs">
              {(['All', 'Active', 'Needs Attention', 'Inactive'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setTeamStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl transition-all text-[11px] font-semibold ${
                    teamStatusFilter === st
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTeam}
                onChange={(e) => setSearchTeam(e.target.value)}
                placeholder="Find team..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 20 Teams Bento Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedTeam(team)}
              className="p-4 sm:p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group gpu-layer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                    {team.teamNumber}
                  </span>
                  <StatusBadge status={team.status} size="sm" />
                </div>

                <div className="text-xs text-slate-600 font-semibold">
                  5 Students
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Mentor: {team.mentorName}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Avg Progress</span>
                    <span className="font-bold text-slate-900">{team.avgProgress}%</span>
                  </div>
                  <ProgressBar
                    percentage={team.avgProgress}
                    height="xs"
                    color={team.avgProgress >= 80 ? 'emerald' : team.avgProgress >= 70 ? 'indigo' : 'amber'}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Problems:</span>
                    <span className="font-bold text-slate-800">{team.totalSolved}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                <span>View 5 Students</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
