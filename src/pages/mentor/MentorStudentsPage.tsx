import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { Users, Search, Mail, ExternalLink, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { Student } from '../../types';

export const MentorStudentsPage: React.FC = () => {
  const { currentUser, students, setSelectedStudent } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const assignedTeamId = currentUser.teamId || 'team-7';
  const assignedTeamNumber = currentUser.teamNumber || 'Team 07';

  // Strictly filter to the assigned team students
  const teamStudents = students.filter(
    (s) => s.teamId === assignedTeamId || s.teamNumber === assignedTeamNumber
  );

  const filtered = teamStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
            <Users className="w-4 h-4" />
            <span>Assigned Cohort Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {assignedTeamNumber} Students ({teamStudents.length})
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Individual student monitoring, academic feedback notes, and progress logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search student or roll no..."
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* 5-Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Student Details</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">DSA Progress</th>
                <th className="py-3.5 px-4">Problems Solved</th>
                <th className="py-3.5 px-4">Current Streak</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={st.avatar}
                        name={st.name}
                        id={st.rollNo}
                        role="STUDENT"
                        size="sm"
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
                    <div className="w-28">
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>{st.progress}%</span>
                        <span className="text-[10px] text-slate-400 font-mono">{st.dsaLevel}</span>
                      </div>
                      <ProgressBar
                        percentage={st.progress}
                        height="xs"
                        color={st.progress >= 80 ? 'emerald' : st.progress >= 70 ? 'indigo' : 'amber'}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <span className="font-bold">{st.solved}</span>
                    <span className="text-slate-400 text-[11px]"> / {st.attempted}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StreakBadge streak={st.streak} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={st.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(st);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
