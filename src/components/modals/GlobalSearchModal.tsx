import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, GraduationCap, Users, BookOpen, X, ArrowRight, Sparkles } from 'lucide-react';
import { UserAvatar } from '../ui/UserAvatar';
import { DSA_TOPICS } from '../../data/mockData';
import { Student, Team } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    role,
    currentUser,
    students,
    teams,
    setSelectedStudent,
    setSelectedTeam,
    setActiveTab,
    switchRole,
  } = useAuth();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock background body scroll while search modal is open
  useEffect(() => {
    if (isSearchOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Filter students based on role
  const accessibleStudents = () => {
    if (role === 'DEAN') return students;
    if (role === 'MENTOR')
      return students.filter(
        (s) => s.teamId === currentUser.teamId || s.teamNumber === currentUser.teamNumber
      );
    if (role === 'STUDENT')
      return students.filter(
        (s) => s.id === currentUser.studentData?.id || s.rollNo === currentUser.studentData?.rollNo
      );
    return [];
  };

  // Filter teams based on role
  const accessibleTeams = () => {
    if (role === 'DEAN') return teams;
    if (role === 'MENTOR')
      return teams.filter(
        (t) => t.id === currentUser.teamId || t.teamNumber === currentUser.teamNumber
      );
    return [];
  };

  const filteredStudents = accessibleStudents().filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
      s.teamNumber.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTeams = accessibleTeams().filter(
    (t) =>
      t.teamNumber.toLowerCase().includes(query.toLowerCase()) ||
      t.mentorName.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTopics = DSA_TOPICS.filter((tp) =>
    tp.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectStudent = (st: Student) => {
    setSelectedStudent(st);
    setIsSearchOpen(false);
  };

  const handleSelectTeam = (t: Team) => {
    setSelectedTeam(t);
    setIsSearchOpen(false);
  };

  const handleSelectTopic = () => {
    setActiveTab(role === 'STUDENT' ? 'my-progress' : 'progress');
    setIsSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 overscroll-contain"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students, roll no, teams, topics..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
                ESC
              </kbd>
            </div>

            {/* Results Container */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 overscroll-contain">
              {/* Quick Actions (When no query) */}
              {!query && (
                <div className="p-2 space-y-2">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Quick Shortcuts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        switchRole('DEAN');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800">Jump to Dean View</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        switchRole('MENTOR', 'mentor-7');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800">Jump to Team 07 Mentor</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Students Results */}
              {filteredStudents.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Students ({filteredStudents.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredStudents.slice(0, 10).map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSelectStudent(st)}
                        className="w-full p-2.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <UserAvatar
                            src={st.avatar}
                            name={st.name}
                            id={st.rollNo}
                            role="STUDENT"
                            size="sm"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate">{st.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {st.rollNo} • {st.teamNumber}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-900">{st.progress}%</span>
                          <div className="text-[10px] text-slate-400">{st.solved} Solved</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams Results (Dean & Mentor) */}
              {filteredTeams.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Teams ({filteredTeams.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredTeams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTeam(t)}
                        className="w-full p-2.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <UserAvatar
                            name={t.mentorName}
                            role="MENTOR"
                            size="sm"
                            showBadge
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate">{t.teamNumber} - {t.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">
                              Mentor: {t.mentorName}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-blue-700">{t.avgProgress}%</span>
                          <div className="text-[10px] text-slate-400">{t.totalSolved} Solved</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Results */}
              {filteredTopics.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>DSA Topics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {filteredTopics.map((top) => (
                      <button
                        key={top}
                        onClick={handleSelectTopic}
                        className="p-2.5 rounded-2xl hover:bg-slate-50 border border-slate-100 text-left transition-colors flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-slate-800 truncate">{top}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query && filteredStudents.length === 0 && filteredTeams.length === 0 && filteredTopics.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No results found for &ldquo;{query}&rdquo;.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Navigate with touch or keyboard</span>
              <button onClick={() => setIsSearchOpen(false)} className="sm:hidden text-blue-600 font-semibold">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

