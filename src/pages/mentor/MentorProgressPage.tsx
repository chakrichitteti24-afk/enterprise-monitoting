import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DSA_TOPICS } from '../../data/mockData';
import { TrendingUp, Users, BookOpen } from 'lucide-react';

export const MentorProgressPage: React.FC = () => {
  const { currentUser, students, setSelectedStudent } = useAuth();

  const assignedTeamId = currentUser.teamId || 'team-7';
  const assignedTeamNumber = currentUser.teamNumber || 'Team 07';
  const teamStudents = students.filter(
    (s) => s.teamId === assignedTeamId || s.teamNumber === assignedTeamNumber
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Topic Mastery Matrix</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {assignedTeamNumber} Curriculum Performance
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Comparative breakdown of the 5 assigned students across all 8 DSA core curriculum modules.
        </p>
      </div>

      {/* 5-Student Matrix Table */}
      <BentoCard
        title="Student vs Topic Mastery Matrix"
        subtitle="Live completion percentage per topic"
        icon={<BookOpen className="w-4 h-4 text-blue-600" />}
      >
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                {DSA_TOPICS.map((topic) => (
                  <th key={topic} className="py-3 px-3 text-center min-w-[90px]">
                    {topic}
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamStudents.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[130px]">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.rollNo}</div>
                      </div>
                    </div>
                  </td>

                  {DSA_TOPICS.map((topic) => {
                    const perc = st.topicProgress[topic]?.percentage || 0;
                    return (
                      <td key={topic} className="py-3 px-3 text-center">
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

                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {st.progress}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>
  );
};
