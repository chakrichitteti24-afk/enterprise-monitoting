import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../ui/StatusBadge';
import { StreakBadge } from '../ui/StreakBadge';
import { ProgressRing } from '../ui/ProgressRing';
import { TopicProgressList } from '../ui/TopicProgressList';
import { UserAvatar } from '../ui/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  CheckCircle2,
  Send,
  Lock,
  ArrowLeft,
} from 'lucide-react';

export const StudentDetailModal: React.FC = () => {
  const {
    selectedStudent,
    setSelectedStudent,
    role,
    currentUser,
    addMentorFeedback,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'activity' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (selectedStudent) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedStudent]);

  // Reset to overview tab when student changes
  useEffect(() => {
    if (selectedStudent) {
      setActiveTab('overview');
      setNewNote('');
    }
  }, [selectedStudent?.id]);

  const handleClose = () => {
    setSelectedStudent(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedStudent) return;
    addMentorFeedback(selectedStudent.id, newNote.trim());
    setNewNote('');
  };

  // Strict role isolation check
  const isAuthorized =
    !selectedStudent ||
    role === 'DEAN' ||
    (role === 'MENTOR' && (selectedStudent.teamId === currentUser.teamId || selectedStudent.teamNumber === currentUser.teamNumber)) ||
    (role === 'STUDENT' && (selectedStudent.id === currentUser.studentData?.id || selectedStudent.rollNo === currentUser.studentData?.rollNo));

  return (
    <AnimatePresence>
      {selectedStudent && (
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

          {/* Modal / Bottom Sheet Box */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl lg:max-w-4xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 max-h-[92vh] flex flex-col gpu-layer overscroll-contain"
          >
            {/* Mobile Sheet Pull Indicator */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-0.5 bg-slate-50/80">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <UserAvatar
                  src={selectedStudent.avatar}
                  name={selectedStudent.name}
                  id={selectedStudent.rollNo}
                  role="STUDENT"
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-none">
                      {selectedStudent.name}
                    </h2>
                    <StatusBadge status={selectedStudent.status} size="sm" />
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      role === 'DEAN'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : role === 'MENTOR'
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {role === 'DEAN' ? '👑 Dean Oversight' : role === 'MENTOR' ? '🧑‍🏫 Mentor Scoped' : '🎓 Personal Portfolio'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mt-1 flex-wrap font-medium">
                    <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-800 font-bold">
                      {selectedStudent.rollNo}
                    </span>
                    <span className="text-slate-700 font-semibold">{selectedStudent.teamNumber}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline truncate max-w-[160px]">Mentor: {selectedStudent.mentorName}</span>
                    <span>•</span>
                    <span className="text-blue-700 font-bold">{selectedStudent.dsaLevel}</span>
                  </div>
                </div>
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

            {/* Content Section */}
            {!isAuthorized ? (
              <div className="p-6 sm:p-10 text-center my-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Access Restricted</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    As an authenticated {role}, you are authorized to view students within your assigned scope only. Cross-student private dossiers are protected by RBAC policy.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Tab Navigation with Indicator */}
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 pt-1.5 border-b border-slate-100 text-xs font-medium bg-white overflow-x-auto touch-scroll-x no-scrollbar">
                  {(
                    [
                      { id: 'overview', label: 'Overview' },
                      { id: 'topics', label: 'DSA Topics (8)' },
                      { id: 'activity', label: 'Submissions' },
                      ...(role === 'DEAN' || role === 'MENTOR'
                        ? [{ id: 'notes', label: `Mentor Notes (${selectedStudent.mentorFeedbackNotes?.length || 0})` }]
                        : []),
                    ] as const
                  ).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative py-3 px-3 transition-colors shrink-0 whitespace-nowrap ${
                          isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="modalTabActiveLine"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content Body */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 overscroll-contain">
                  {activeTab === 'overview' && (
                    <div className="space-y-4 sm:space-y-5">
                      {/* Bento Grid Top Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {/* Ring */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center justify-center text-center">
                          <ProgressRing percentage={selectedStudent.progress} size={105} strokeWidth={8} />
                          <div className="text-xs font-bold text-slate-800 mt-2">Overall Progress</div>
                          <div className="text-[11px] text-slate-400">Curriculum standard</div>
                        </div>

                        {/* Problems Stats */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
                          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            Problem Metrics
                          </div>
                          <div className="space-y-2 my-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Solved</span>
                              <span className="font-bold text-slate-900 text-sm">{selectedStudent.solved}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Attempted</span>
                              <span className="font-semibold text-slate-700">{selectedStudent.attempted}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Pending</span>
                              <span className="font-semibold text-slate-500">{selectedStudent.pending}</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5 flex justify-between">
                            <span>Accuracy Rate</span>
                            <span className="font-bold text-emerald-700">
                              {Math.round((selectedStudent.solved / Math.max(1, selectedStudent.attempted)) * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* Streak & Difficulty */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                              Activity Streak
                            </div>
                            <StreakBadge streak={selectedStudent.streak} size="lg" />
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Longest Streak:</span>
                            <span className="font-bold text-amber-700">{selectedStudent.longestStreak} Days</span>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty Breakdown */}
                      <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-3">
                        <div className="text-xs font-bold text-slate-900">Difficulty Distribution</div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100">
                            <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-800">Easy</div>
                            <div className="text-sm sm:text-base font-bold text-emerald-900 mt-0.5">
                              {selectedStudent.difficultyStats.easy.solved}
                              <span className="text-xs font-normal text-emerald-700">/{selectedStudent.difficultyStats.easy.total}</span>
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100">
                            <div className="text-[10px] sm:text-[11px] font-semibold text-amber-800">Medium</div>
                            <div className="text-sm sm:text-base font-bold text-amber-900 mt-0.5">
                              {selectedStudent.difficultyStats.medium.solved}
                              <span className="text-xs font-normal text-amber-700">/{selectedStudent.difficultyStats.medium.total}</span>
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100">
                            <div className="text-[10px] sm:text-[11px] font-semibold text-rose-800">Hard</div>
                            <div className="text-sm sm:text-base font-bold text-rose-900 mt-0.5">
                              {selectedStudent.difficultyStats.hard.solved}
                              <span className="text-xs font-normal text-rose-700">/{selectedStudent.difficultyStats.hard.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick DSA Topics Preview */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">Core DSA Modules</span>
                          <button
                            onClick={() => setActiveTab('topics')}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            All 8 topics →
                          </button>
                        </div>
                        <TopicProgressList topicProgress={selectedStudent.topicProgress} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'topics' && (
                    <div className="space-y-4">
                      <div className="text-xs text-slate-500">
                        Topic mastery tracked against GKCE autonomous CSE curriculum milestones.
                      </div>
                      <TopicProgressList topicProgress={selectedStudent.topicProgress} />
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-slate-900">Recent Solve Logs</div>
                      <div className="space-y-2">
                        {selectedStudent.recentActivities.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No solve logs recorded yet.
                          </div>
                        ) : (
                          selectedStudent.recentActivities.map((act) => (
                            <div
                              key={act.id}
                              className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">{act.problemTitle}</div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    Topic: {act.topic} • Complexity: {act.difficulty}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[11px] font-semibold text-slate-600">{act.timeAgo}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-900 mb-2">Weekly Submissions Volume</div>
                        <div className="flex items-end gap-1.5 sm:gap-2 h-20 pt-4">
                          {selectedStudent.submissionsHistory.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.min(56, Math.max(8, item.count * 10))}px` }}
                                transition={{ duration: 0.5, delay: idx * 0.04 }}
                                className="w-full bg-blue-600 rounded-t-md"
                              />
                              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">{item.date.slice(5)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      {/* Add Note Form */}
                      <form onSubmit={handleAddNote} className="space-y-2">
                        <label className="block text-xs font-bold text-slate-900">
                          Add Mentorship Feedback / Academic Advisory Note
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Log review note (e.g., Practicing graph traversals)..."
                            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50"
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!newNote.trim()}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Log</span>
                          </motion.button>
                        </div>
                      </form>

                      {/* Notes History */}
                      <div className="space-y-2.5 pt-2">
                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Recorded Feedback History
                        </div>
                        {selectedStudent.mentorFeedbackNotes && selectedStudent.mentorFeedbackNotes.length > 0 ? (
                          selectedStudent.mentorFeedbackNotes.map((note) => (
                            <div key={note.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span className="font-bold text-slate-800">{note.author}</span>
                                <span>{note.date}</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">{note.note}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            No feedback notes recorded yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedStudent.email}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors shrink-0 shadow-2xs"
                  >
                    Close
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

