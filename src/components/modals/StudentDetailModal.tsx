import React, { useState } from 'react';
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

  if (!selectedStudent) return null;

  // Strict role isolation check
  const isAuthorized =
    role === 'DEAN' ||
    (role === 'MENTOR' && (selectedStudent.teamId === currentUser.teamId || selectedStudent.teamNumber === currentUser.teamNumber)) ||
    (role === 'STUDENT' && (selectedStudent.id === currentUser.studentData?.id || selectedStudent.rollNo === currentUser.studentData?.rollNo));

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addMentorFeedback(selectedStudent.id, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0"
        onClick={() => setSelectedStudent(null)}
      />

      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="relative w-full max-w-3xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-slate-200/80 overflow-hidden z-10 max-h-[88vh] sm:max-h-[90vh] flex flex-col gpu-layer"
      >
        {/* Mobile Swipe / Drag Handle (ColorOS/OxygenOS) */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <UserAvatar
              src={selectedStudent.avatar}
              name={selectedStudent.name}
              id={selectedStudent.rollNo}
              role="STUDENT"
              size="xl"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                  {selectedStudent.name}
                </h2>
                <StatusBadge status={selectedStudent.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap font-medium">
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-semibold">
                  {selectedStudent.rollNo}
                </span>
                <span>{selectedStudent.teamNumber}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Mentor: {selectedStudent.mentorName}</span>
                <span>•</span>
                <span className="text-blue-700 font-semibold">{selectedStudent.dsaLevel}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setSelectedStudent(null)}
            className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Content Section */}
        {!isAuthorized ? (
          <div className="p-8 text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Access Restricted</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              As a Mentor of {currentUser.teamNumber}, you are authorized to view students in your assigned team only.
            </p>
          </div>
        ) : (
          <>
            {/* Tab Navigation with Liquid Spring Indicator */}
            <div className="flex items-center gap-2 px-5 sm:px-6 pt-2 border-b border-slate-100 text-xs font-medium bg-white overflow-x-auto">
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
                    className={`relative py-3 px-3 transition-colors shrink-0 ${
                      isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
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
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 overscroll-contain">
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Bento Grid Top Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                    {/* Ring */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center justify-center text-center">
                      <ProgressRing percentage={selectedStudent.progress} size={110} strokeWidth={8} />
                      <div className="text-xs font-bold text-slate-800 mt-2">Overall Progress</div>
                      <div className="text-[11px] text-slate-400">Curriculum standard</div>
                    </div>

                    {/* Problems Stats */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Activity Streak
                        </div>
                        <StreakBadge streak={selectedStudent.streak} size="lg" />
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Longest:</span>
                        <span className="font-bold text-amber-700">{selectedStudent.longestStreak} Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-3">
                    <div className="text-xs font-bold text-slate-900">Difficulty Distribution</div>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <div className="text-[11px] font-semibold text-emerald-800">Easy</div>
                        <div className="text-base font-bold text-emerald-900 mt-0.5">
                          {selectedStudent.difficultyStats.easy.solved}
                          <span className="text-xs font-normal text-emerald-700">/{selectedStudent.difficultyStats.easy.total}</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                        <div className="text-[11px] font-semibold text-amber-800">Medium</div>
                        <div className="text-base font-bold text-amber-900 mt-0.5">
                          {selectedStudent.difficultyStats.medium.solved}
                          <span className="text-xs font-normal text-amber-700">/{selectedStudent.difficultyStats.medium.total}</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                        <div className="text-[11px] font-semibold text-rose-800">Hard</div>
                        <div className="text-base font-bold text-rose-900 mt-0.5">
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
                    {selectedStudent.recentActivities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{act.problemTitle}</div>
                            <div className="text-[11px] text-slate-500">
                              Topic: {act.topic} • Complexity: {act.difficulty}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-slate-600">{act.timeAgo}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-900 mb-2">Weekly Submissions Volume</div>
                    <div className="flex items-end gap-2 h-20 pt-4">
                      {selectedStudent.submissionsHistory.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${item.count * 8}px` }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="w-full bg-blue-600 rounded-t-md"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
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
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!newNote.trim()}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Log
                      </motion.button>
                    </div>
                  </form>

                  {/* Notes History */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No feedback notes recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2 truncate pr-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{selectedStudent.email}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStudent(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors shrink-0 shadow-2xs"
              >
                Close
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
