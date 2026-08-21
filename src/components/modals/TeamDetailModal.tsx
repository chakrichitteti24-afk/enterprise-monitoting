import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../ui/StatusBadge';
import { StreakBadge } from '../ui/StreakBadge';
import { ProgressRing } from '../ui/ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { UserAvatar } from '../ui/UserAvatar';
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
  } = useAuth();

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (selectedTeam) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedTeam]);

  const handleClose = () => {
    setSelectedTeam(null);
  };

  const teamStudents = selectedTeam
    ? students.filter(
        (s) => s.teamId === selectedTeam.id || s.teamNumber === selectedTeam.teamNumber
      )
    : [];

  const mentor = selectedTeam
    ? mentors.find(
        (m) => m.id === selectedTeam.mentorId || m.assignedTeamNumber === selectedTeam.teamNumber
      )
    : null;

  const handleOpenStudent = (st: Student) => {
    setSelectedStudent(st);
  };

  return (
    <AnimatePresence>
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 300) {
                handleClose();
              }
            }}
            className="relative w-full max-w-2xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 max-h-[90vh] flex flex-col gpu-layer overscroll-contain"
          >
            {/* Mobile Drag Indicator Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {selectedTeam.teamNumber}
                  </span>
                  <StatusBadge status={selectedTeam.status} size="sm" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight mt-1 truncate">
                  {selectedTeam.name}
                </h2>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors shrink-0 shadow-2xs"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            {/* Modal Scroll Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 overscroll-contain">
              {/* Top Grid: Progress & Mentor Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Average Progress Card */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3.5 sm:gap-4">
                  <ProgressRing percentage={selectedTeam.avgProgress} size={70} strokeWidth={7} />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 font-semibold truncate">Cohort Average Progress</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedTeam.avgProgress}%
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {selectedTeam.totalSolved} total problems solved
                    </div>
                  </div>
                </div>

                {/* Mentor Information */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Assigned Faculty Mentor
                    </div>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={mentor?.avatar || selectedTeam.mentorAvatar}
                        name={selectedTeam.mentorName}
                        role="MENTOR"
                        size="md"
                        showBadge
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{selectedTeam.mentorName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{selectedTeam.mentorDepartment}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedTeam.mentorEmail}</span>
                    </div>
                    {mentor?.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{mentor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Students Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Assigned Students ({teamStudents.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Click to view student dossier</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {teamStudents.map((st) => (
                    <motion.div
                      key={st.id}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleOpenStudent(st)}
                      className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <UserAvatar
                          src={st.avatar}
                          name={st.name}
                          id={st.rollNo}
                          role="STUDENT"
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate max-w-[150px] sm:max-w-none">{st.name}</span>
                            <StatusBadge status={st.status} size="sm" />
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-700">{st.rollNo}</span>
                            <span>•</span>
                            <span className="text-blue-700 font-semibold">{st.dsaLevel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">{st.progress}%</div>
                          <div className="text-[10px] text-slate-400">{st.solved} solved</div>
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
                  Team Topic Performance (Average across {teamStudents.length} students)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DSA_TOPICS.map((topic) => {
                    const percentage = teamStudents.length > 0
                      ? Math.round(teamStudents.reduce((sum, st) => sum + (st.topicProgress[topic]?.percentage || 0), 0) / teamStudents.length)
                      : (selectedTeam.topicPerformance[topic] || 0);
                    return (
                      <div key={topic} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span className="truncate pr-1">{topic}</span>
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
            <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>GKCE DSA Monitoring System</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

