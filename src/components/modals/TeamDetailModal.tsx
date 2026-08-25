import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../ui/StatusBadge';
import { StreakBadge } from '../ui/StreakBadge';
import { ProgressRing } from '../ui/ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { UserAvatar } from '../ui/UserAvatar';
import { DSA_TOPICS } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Mail, Phone, ChevronRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { Student, DSALevel } from '../../types';

export const TeamDetailModal: React.FC = () => {
  const {
    selectedTeam,
    setSelectedTeam,
    students,
    mentors,
    setSelectedStudent,
    role,
    addStudent,
  } = useAuth();

  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [dsaLevelInput, setDsaLevelInput] = useState<DSALevel>('Beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setIsEnrollOpen(false);
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

  const handleEnrollInTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !rollInput.trim() || !selectedTeam) return;

    setIsSubmitting(true);
    try {
      const studentRoll = rollInput.trim().toUpperCase();
      const studentName = nameInput.trim();
      await addStudent({
        name: studentName,
        rollNo: studentRoll,
        email: emailInput.trim() || `${studentRoll.toLowerCase()}@gkce.edu.in`,
        teamNumber: selectedTeam.teamNumber,
        teamId: selectedTeam.id,
        dsaLevel: dsaLevelInput,
        status: 'Active',
      });
      setIsEnrollOpen(false);
      setSuccessMessage(`Student ${studentName} enrolled in ${selectedTeam.teamNumber}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setNameInput('');
      setRollInput('');
      setEmailInput('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to enroll student. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
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
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 max-h-[92vh] flex flex-col gpu-layer overscroll-contain"
          >
            {/* Mobile Sheet Pull Indicator */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-0.5 bg-slate-50/80">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 gap-3">
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

            {/* Success Banner */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                  <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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

              {/* Inline Enroll Student Form for Dean */}
              <AnimatePresence>
                {isEnrollOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-blue-600" />
                        <span>Enroll Student into {selectedTeam.teamNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEnrollOpen(false)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleEnrollInTeam} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Student Name</label>
                          <input
                            type="text"
                            required
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="e.g. S. PAVAN KUMAR"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Roll Number</label>
                          <input
                            type="text"
                            required
                            value={rollInput}
                            onChange={(e) => setRollInput(e.target.value)}
                            placeholder="e.g. 24F81A0588"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Email (Optional)</label>
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Auto-generated if blank"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">DSA Level</label>
                          <select
                            value={dsaLevelInput}
                            onChange={(e) => setDsaLevelInput(e.target.value as DSALevel)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden text-slate-700"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Mastery">Mastery</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEnrollOpen(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs disabled:opacity-50"
                        >
                          {isSubmitting ? 'Enrolling...' : 'Confirm Enrollment'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Assigned Students Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Assigned Students ({teamStudents.length})</span>
                  </h3>
                  {role === 'DEAN' && !isEnrollOpen && (
                    <button
                      onClick={() => {
                        const nextNum = 100 + students.length + 1;
                        setRollInput(`24F81A05${nextNum < 1000 ? nextNum : Math.floor(100 + Math.random() * 899)}`);
                        setNameInput('');
                        setEmailInput('');
                        setIsEnrollOpen(true);
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1 border border-blue-200 transition-colors shadow-2xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Enroll Student</span>
                    </button>
                  )}
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

