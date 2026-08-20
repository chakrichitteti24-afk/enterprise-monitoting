import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, GraduationCap, Users, BookOpen, X, ArrowRight, Sparkles } from 'lucide-react';
import { UserAvatar } from '../ui/UserAvatar';
import { DSA_TOPICS } from '../../data/mockData';
import { Student, Team } from '../../types';

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

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/40 backdrop-blur-md">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, roll numbers, teams, or DSA topics..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Quick Actions (When no query) */}
          {!query && (
            <div className="p-2 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    switchRole('DEAN');
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-slate-800">Jump to Dean View</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    switchRole('MENTOR', 'mentor-7');
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-medium text-slate-800">Jump to Team 07 Mentor</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Students Results */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Students ({filteredStudents.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStudent(st)}
                    className="w-full p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={st.avatar}
                        name={st.name}
                        id={st.rollNo}
                        role="STUDENT"
                        size="sm"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {st.rollNo} • {st.teamNumber}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
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
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Teams ({filteredTeams.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredTeams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTeam(t)}
                    className="w-full p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={t.mentorName}
                        role="MENTOR"
                        size="sm"
                        showBadge
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{t.teamNumber} - {t.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Mentor: {t.mentorName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-700">{t.avgProgress}% Avg</span>
                      <div className="text-[10px] text-slate-400">{t.totalSolved} Problems</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topics Results */}
          {filteredTopics.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                DSA Topics
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {filteredTopics.map((top) => (
                  <button
                    key={top}
                    onClick={handleSelectTopic}
                    className="p-2 rounded-xl hover:bg-slate-50 border border-slate-100 text-left transition-colors flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-800">{top}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
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
          <span>Navigate with mouse or keyboard</span>
          <span>GKCE DSA Monitor</span>
        </div>
      </div>
    </div>
  );
};
