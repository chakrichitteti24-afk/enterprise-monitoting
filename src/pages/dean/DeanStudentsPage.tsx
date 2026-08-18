import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  GraduationCap,
  Search,
  Download,
  Filter,
  ChevronRight,
  ExternalLink,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Student } from '../../types';

export const DeanStudentsPage: React.FC = () => {
  const { students, teams, setSelectedStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === 'All' || s.teamNumber === selectedTeam;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesLevel = selectedLevel === 'All' || s.dsaLevel === selectedLevel;

    return matchesSearch && matchesTeam && matchesStatus && matchesLevel;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedStudents = filteredStudents.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Team', 'Mentor', 'DSA Progress %', 'Solved', 'Attempted', 'Streak', 'Status', 'Level'];
    const rows = filteredStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.email,
      s.teamNumber,
      `"${s.mentorName}"`,
      s.progress,
      s.solved,
      s.attempted,
      s.streak,
      s.status,
      s.dsaLevel,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GKCE_DSA_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Enrolled Students Master Roster</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">100 Monitored Students</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Browse, filter, and inspect individual progress across all 20 teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV ({filteredStudents.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, roll no, or mentor..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Team filter */}
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Teams (20)</option>
              {teams.map((tm) => (
                <option key={tm.id} value={tm.teamNumber}>{tm.teamNumber}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Level filter */}
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Levels</option>
              <option value="Mastery">Mastery (&gt;85%)</option>
              <option value="Advanced">Advanced (70-84%)</option>
              <option value="Intermediate">Intermediate (45-69%)</option>
              <option value="Beginner">Beginner (&lt;45%)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing {filteredStudents.length} of 100 students</span>
          {(selectedTeam !== 'All' || selectedStatus !== 'All' || selectedLevel !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTeam('All');
                setSelectedStatus('All');
                setSelectedLevel('All');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Student Details</th>
                <th className="py-3.5 px-4">Roll No</th>
                <th className="py-3.5 px-4">Team & Mentor</th>
                <th className="py-3.5 px-4">DSA Progress</th>
                <th className="py-3.5 px-4">Problems Solved</th>
                <th className="py-3.5 px-4">Streak</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedStudents.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {st.rollNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{st.teamNumber}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                      {st.mentorName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-28">
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span className="font-bold text-slate-900">{st.progress}%</span>
                        <span className="text-[10px] text-slate-400">{st.dsaLevel}</span>
                      </div>
                      <ProgressBar
                        percentage={st.progress}
                        height="xs"
                        color={st.progress >= 80 ? 'emerald' : st.progress >= 70 ? 'indigo' : 'amber'}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{st.solved}</span>
                    <span className="text-slate-400 text-[11px]"> / {st.attempted}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StreakBadge streak={st.streak} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={st.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(st);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Previous
            </button>
            <span className="font-mono px-2 font-medium">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
