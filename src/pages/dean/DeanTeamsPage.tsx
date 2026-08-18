import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { motion } from 'framer-motion';
import { Layers, Search, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Team } from '../../types';

export const DeanTeamsPage: React.FC = () => {
  const { teams, setSelectedTeam } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'progress' | 'solved' | 'streak' | 'team'>('progress');

  const filteredTeams = teams
    .filter((t) => {
      const matchesSearch =
        t.teamNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return b.avgProgress - a.avgProgress;
      if (sortBy === 'solved') return b.totalSolved - a.totalSolved;
      if (sortBy === 'streak') return b.avgStreak - a.avgStreak;
      return a.teamNumber.localeCompare(b.teamNumber);
    });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <Layers className="w-4 h-4 shrink-0" />
            <span>Institutional Cohort Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">All 20 Teams</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Each team consists of exactly 5 students and 1 dedicated faculty mentor.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team or mentor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Statuses ({teams.length})</option>
              <option value="Active">Active</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="progress">Average Progress (High to Low)</option>
              <option value="solved">Problems Solved</option>
              <option value="streak">Average Streak</option>
              <option value="team">Team Number</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredTeams.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedTeam(t)}
              className="p-4 sm:p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group gpu-layer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                      {t.teamNumber}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0">
                      #{t.rank}
                    </span>
                  </div>
                  <StatusBadge status={t.status} size="sm" />
                </div>

                <div className="text-xs font-semibold text-slate-700">5 Students Enrolled</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Mentor: {t.mentorName}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Avg Progress</span>
                    <span className="font-bold text-slate-900">{t.avgProgress}%</span>
                  </div>
                  <ProgressBar
                    percentage={t.avgProgress}
                    height="xs"
                    color={t.avgProgress >= 80 ? 'emerald' : t.avgProgress >= 70 ? 'indigo' : 'amber'}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Solved: <strong className="text-slate-800">{t.totalSolved}</strong></span>
                    <StreakBadge streak={Math.round(t.avgStreak)} size="sm" />
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
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Team</th>
                  <th className="py-3.5 px-4">Faculty Mentor</th>
                  <th className="py-3.5 px-4">Students</th>
                  <th className="py-3.5 px-4">Average Progress</th>
                  <th className="py-3.5 px-4">Total Solved</th>
                  <th className="py-3.5 px-4">Avg Streak</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Drilldown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTeams.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTeam(t)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{t.teamNumber}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">#{t.rank}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="font-bold">{t.mentorName}</div>
                      <div className="text-[10px] text-slate-400">{t.mentorDepartment}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">5 Students</td>
                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] text-slate-700 font-bold mb-1">
                          <span>{t.avgProgress}%</span>
                        </div>
                        <ProgressBar
                          percentage={t.avgProgress}
                          height="xs"
                          color={t.avgProgress >= 80 ? 'emerald' : t.avgProgress >= 70 ? 'indigo' : 'amber'}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.totalSolved}</td>
                    <td className="py-3.5 px-4">
                      <StreakBadge streak={Math.round(t.avgStreak)} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(t);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
