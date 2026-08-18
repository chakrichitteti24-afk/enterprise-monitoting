import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../ui/StatusBadge';
import { StreakBadge } from '../ui/StreakBadge';
import { ProgressRing } from '../ui/ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { DSA_TOPICS } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Mail, Phone, ChevronRight } from 'lucide-react';
import { Student } from '../../types';

export const TeamDetailModal: React.FC = () => {
  const {
    selectedTeam,
    setSelectedTeam,
    students,
    mentors,
    setSelectedStudent,
    role,
    currentUser,
  } = useAuth();

  if (!selectedTeam) return null;

  const teamStudents = students.filter(
    (s) => s.teamId === selectedTeam.id || s.teamNumber === selectedTeam.teamNumber
  );
  const mentor = mentors.find(
    (m) => m.id === selectedTeam.mentorId || m.assignedTeamNumber === selectedTeam.teamNumber
  );

  const handleOpenStudent = (st: Student) => {
    setSelectedStudent(st);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0"
        onClick={() => setSelectedTeam(null)}
      />

      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-slate-200/80 overflow-hidden z-10 max-h-[88vh] sm:max-h-[90vh] flex flex-col gpu-layer"
      >
        {/* Mobile Swipe / Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {selectedTeam.teamNumber}
              </h2>
              <StatusBadge status={selectedTeam.status} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                Rank #{selectedTeam.rank || 1}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              5 Students • Mentor: <strong className="text-slate-800">{selectedTeam.mentorName}</strong> ({selectedTeam.mentorDepartment})
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setSelectedTeam(null)}
            className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 overscroll-contain">
          {/* Top Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Team Progress Ring */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center justify-center text-center">
              <ProgressRing percentage={selectedTeam.avgProgress} size={110} strokeWidth={8} color="#1d4ed8" />
              <div className="text-xs font-bold text-slate-800 mt-2">Team Average Progress</div>
              <div className="text-[11px] text-slate-400">Target: 75% for mid-term review</div>
            </div>

            {/* Team Stats */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Team Aggregates
              </div>
              <div className="space-y-2 my-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Solved</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedTeam.totalSolved}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Attempted</span>
                  <span className="font-semibold text-slate-700">{selectedTeam.totalAttempted}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Average Streak</span>
                  <span className="font-bold text-amber-700">{selectedTeam.avgStreak} Days</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5 flex justify-between">
                <span>Active Cohort</span>
                <span className="font-bold text-emerald-700">5 / 5 Students Enrolled</span>
              </div>
            </div>

            {/* Mentor Information */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Assigned Faculty Mentor
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={mentor?.avatar || selectedTeam.mentorEmail}
                    alt={selectedTeam.mentorName}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{selectedTeam.mentorName}</div>
                    <div className="text-[11px] text-slate-500">{selectedTeam.mentorDepartment}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedTeam.mentorEmail}</span>
                </div>
                {mentor?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{mentor.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assigned 5 Students Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Assigned Students (5)
              </h3>
              <span className="text-[11px] text-slate-400">Click to view student dossier</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {teamStudents.map((st) => (
                <motion.div
                  key={st.id}
                  whileHover={{ y: -1, scale: 1.005 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleOpenStudent(st)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{st.name}</span>
                        <StatusBadge status={st.status} size="sm" />
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{st.rollNo}</span>
                        <span>•</span>
                        <span>{st.dsaLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-900">{st.solved} Solved</div>
                      <div className="text-[10px] text-slate-400">{st.attempted} attempted</div>
                    </div>

                    <div className="w-20 sm:w-24 hidden md:block">
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>Progress</span>
                        <span className="font-bold">{st.progress}%</span>
                      </div>
                      <ProgressBar percentage={st.progress} height="xs" color="indigo" />
                    </div>

                    <StreakBadge streak={st.streak} size="sm" />

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team DSA Topics Mastery */}
          <div className="p-4 rounded-2xl border border-slate-200/70 bg-white space-y-3">
            <div className="text-xs font-bold text-slate-900">
              Team Topic Performance (Average across 5 students)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DSA_TOPICS.map((topic) => {
                const percentage = selectedTeam.topicPerformance[topic] || 0;
                return (
                  <div key={topic} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span className="truncate">{topic}</span>
                      <span className="font-bold text-slate-900">{percentage}%</span>
                    </div>
                    <ProgressBar
                      percentage={percentage}
                      height="xs"
                      color={percentage >= 80 ? 'emerald' : percentage >= 60 ? 'indigo' : 'amber'}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>GKCE DSA Monitoring System</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTeam(null)}
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
