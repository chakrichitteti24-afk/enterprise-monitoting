import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { DSA_TOPICS } from '../../data/mockData';
import { MentorDailyVerificationGrid } from '../../components/mentor/MentorDailyVerificationGrid';
import { TrendingUp, BookOpen, CheckSquare, BarChart3, Users } from 'lucide-react';

export const MentorProgressPage: React.FC = () => {
  const { currentUser, students, setSelectedStudent } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'daily-tasks' | 'topic-matrix'>('daily-tasks');

  const assignedTeamId = currentUser.teamId || 'team-7';
  const assignedTeamNumber = currentUser.teamNumber || 'Team 07';
  const teamStudents = students.filter(
    (s) => s.teamId === assignedTeamId || s.teamNumber === assignedTeamNumber
  );

  return (
    <div className="space-y-6">
      {/* Header with Sub-Tabs */}
      <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Academic Performance & Verification Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {assignedTeamNumber} Curriculum & Task Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign off daily student tasks (100 placement questions, 5/day) and inspect comprehensive topic mastery.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('daily-tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'daily-tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Daily 5 Verification</span>
          </button>

          <button
            onClick={() => setActiveSubTab('topic-matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'topic-matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Topic Matrix</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Daily 5 Verification Grid */}
      {activeSubTab === 'daily-tasks' && (
        <MentorDailyVerificationGrid
          teamStudents={teamStudents}
          onStudentClick={(st) => setSelectedStudent(st)}
        />
      )}

      {/* Tab 2: Topic Mastery Matrix Table */}
      {activeSubTab === 'topic-matrix' && (
        <BentoCard
          title="Student vs Topic Mastery Matrix"
          subtitle="Live completion percentage per topic across 100 curriculum problems"
          icon={<BookOpen className="w-4 h-4 text-blue-600" />}
        >
          {/* Mobile Swipe Indicator */}
          <div className="sm:hidden px-3 py-1.5 bg-blue-50/70 rounded-xl border border-blue-100/60 flex items-center justify-between text-[11px] text-blue-700 font-semibold mb-2">
            <span>👈 Swipe horizontally to view all 8 topics 👉</span>
            <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-blue-200">8 Topics</span>
          </div>

          <div className="overflow-x-auto pt-1 touch-scroll-x custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4 sticky left-0 bg-slate-50 z-10 sticky-col-shadow w-36 sm:w-48">Student</th>
                  {DSA_TOPICS.map((topic) => (
                    <th key={topic} className="py-3 px-2 sm:px-3 text-center min-w-[75px] sm:min-w-[90px]">
                      {topic}
                    </th>
                  ))}
                  <th className="py-3 px-3 sm:px-4 text-right">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamStudents.map((st) => (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudent(st)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-2 sm:py-3 sm:px-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 sticky-col-shadow border-r border-slate-100 w-36 sm:w-48">
                      <div className="flex items-center gap-2 min-w-0">
                        <UserAvatar
                          src={st.avatar}
                          name={st.name}
                          id={st.rollNo}
                          role="STUDENT"
                          size="xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate max-w-[85px] sm:max-w-[130px]">{st.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{st.rollNo}</div>
                        </div>
                      </div>
                    </td>

                    {DSA_TOPICS.map((topic) => {
                      const perc = st.topicProgress[topic]?.percentage || 0;
                      return (
                        <td key={topic} className="py-3 px-2 sm:px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold ${
                              perc >= 80
                                ? 'bg-emerald-50 text-emerald-800'
                                : perc >= 60
                                ? 'bg-blue-50 text-blue-800'
                                : perc >= 40
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {perc}%
                          </span>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 sm:px-4 text-right font-bold text-slate-900">
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                        {st.progress}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>
      )}
    </div>
  );
};
