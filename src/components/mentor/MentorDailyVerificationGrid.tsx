import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../ui/UserAvatar';
import { StatusBadge } from '../ui/StatusBadge';
import {
  DAILY_TOPIC_THEMES,
  PROBLEMS_BANK_100,
  TOTAL_CURRICULUM_DAYS,
  PROBLEMS_PER_DAY,
} from '../../data/dsaCurriculum100';
import { Problem, Student } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Calendar,
  Sparkles,
  Users,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Filter,
} from 'lucide-react';

interface MentorDailyVerificationGridProps {
  teamStudents?: Student[];
  onStudentClick?: (student: Student) => void;
}

export const MentorDailyVerificationGrid: React.FC<MentorDailyVerificationGridProps> = ({
  teamStudents: propTeamStudents,
  onStudentClick,
}) => {
  const {
    currentUser,
    role,
    students,
    toggleMentorProblemVerification,
    batchVerifyDayProblems,
    batchVerifyTeamProblem,
  } = useAuth();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [justToggledId, setJustToggledId] = useState<string | null>(null);

  // Determine mentor's assigned team students
  const assignedTeamId = currentUser.teamId || 'team-7';
  const assignedTeamNumber = currentUser.teamNumber || 'Team 07';
  
  const teamStudents =
    propTeamStudents ||
    students.filter(
      (s) => s.teamId === assignedTeamId || s.teamNumber === assignedTeamNumber
    );

  const canVerify = role === 'MENTOR' || role === 'DEAN';

  // Get the 5 questions for selectedDay
  const dayTheme =
    DAILY_TOPIC_THEMES.find((t) => t.day === selectedDay) || DAILY_TOPIC_THEMES[0];
  
  const dayProblems = PROBLEMS_BANK_100.filter(
    (p) => p.dayNumber === selectedDay
  ).slice(0, PROBLEMS_PER_DAY);

  // Compute Day Completion Metrics for the team
  const totalPossibleChecks = teamStudents.length * dayProblems.length;
  const verifiedChecksCount = teamStudents.reduce((acc, st) => {
    const verifiedSet = new Set(st.verifiedProblemIds || []);
    const count = dayProblems.filter((p) => verifiedSet.has(p.id)).length;
    return acc + count;
  }, 0);

  const dayCompletionPct =
    totalPossibleChecks > 0
      ? Math.round((verifiedChecksCount / totalPossibleChecks) * 100)
      : 0;

  const handleCellToggle = (student: Student, problem: Problem) => {
    if (!canVerify) return;
    const isCurrentlyVerified = (student.verifiedProblemIds || []).includes(problem.id);
    const key = `${student.id}-${problem.id}`;
    setJustToggledId(key);
    setTimeout(() => setJustToggledId(null), 600);

    toggleMentorProblemVerification(student.id, problem.id, !isCurrentlyVerified);
  };

  const handleVerifyAllForStudent = (student: Student) => {
    if (!canVerify) return;
    const isAllDone = dayProblems.every((p) =>
      (student.verifiedProblemIds || []).includes(p.id)
    );
    batchVerifyDayProblems(student.id, selectedDay, !isAllDone);
  };

  const handleVerifyProblemForTeam = (problem: Problem) => {
    if (!canVerify) return;
    const isAllTeamDone = teamStudents.every((st) =>
      (st.verifiedProblemIds || []).includes(problem.id)
    );
    batchVerifyTeamProblem(assignedTeamNumber, problem.id, !isAllTeamDone);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner with Day Navigator */}
      <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Faculty Mentor Verification Desk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Day {selectedDay}: {dayTheme.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Core Focus: <strong className="text-slate-700">{dayTheme.focus}</strong> &bull; {teamStudents.length} Assigned Cohort Students
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Day Progress Ring / Pill */}
            <div className="bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Day {selectedDay} Progress</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">
                  {verifiedChecksCount} / {totalPossibleChecks} <span className="text-xs text-indigo-600 font-bold">({dayCompletionPct}%)</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {dayCompletionPct}%
              </div>
            </div>
          </div>
        </div>

        {/* Day Carousel Selector (Day 1 - 20) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Select Curriculum Day (20 Days &times; 5 Problems):</span>
            </span>
            <span className="text-[11px] text-indigo-600 font-mono">100 Total Problems</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
            {DAILY_TOPIC_THEMES.map((theme) => {
              const isSelected = selectedDay === theme.day;
              // Check completion for this day
              const dProbs = PROBLEMS_BANK_100.filter((p) => p.dayNumber === theme.day);
              const dChecks = teamStudents.reduce((acc, st) => {
                const vSet = new Set(st.verifiedProblemIds || []);
                return acc + dProbs.filter((p) => vSet.has(p.id)).length;
              }, 0);
              const dTotal = teamStudents.length * dProbs.length;
              const isFull = dTotal > 0 && dChecks === dTotal;

              return (
                <button
                  key={theme.day}
                  onClick={() => setSelectedDay(theme.day)}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex flex-col items-center gap-0.5 border select-none ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 scale-[1.03]'
                      : isFull
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] opacity-80 uppercase tracking-wider">Day</span>
                  <span className="text-sm font-extrabold">{theme.day}</span>
                  <span className="text-[9px] font-normal truncate max-w-[65px]">
                    {theme.topic.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Verification Table */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900 text-sm">
              Cohort Sign-Off Matrix — Day {selectedDay} (5 Problems)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified by Mentor
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
              <Circle className="w-3 h-3 text-slate-400" /> Pending Sign-off
            </span>
          </div>
        </div>

        {/* Mobile Swipe Indicator Banner */}
        <div className="sm:hidden px-4 py-1.5 bg-indigo-50/70 border-b border-indigo-100/60 flex items-center justify-between text-[11px] text-indigo-700 font-semibold">
          <span>👈 Swipe table to view & tick Q1 – Q5 👉</span>
          <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-indigo-200">5 Daily Problems</span>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto touch-scroll-x custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200/90 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-48 sm:w-56 sticky left-0 bg-slate-100/95 backdrop-blur-md z-20 sticky-col-shadow">
                  Student (Cohort)
                </th>

                {dayProblems.map((problem, idx) => (
                  <th key={problem.id} className="py-3 px-3 text-center min-w-[130px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <span>Q{idx + 1}.</span>
                        <span className="truncate max-w-[110px]" title={problem.title}>
                          {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            problem.difficulty === 'Easy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : problem.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        {problem.url && (
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-blue-600"
                            title="View Problem on LeetCode"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      {canVerify && (
                        <button
                          onClick={() => handleVerifyProblemForTeam(problem)}
                          className="mt-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                          title="Toggle verification for all students"
                        >
                          Toggle Team
                        </button>
                      )}
                    </div>
                  </th>
                ))}

                <th className="py-3.5 px-4 text-center w-28">
                  Day Solved
                </th>
                <th className="py-3.5 px-4 text-right w-24">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {teamStudents.map((st) => {
                const verifiedSet = new Set(st.verifiedProblemIds || []);
                const studentDaySolvedCount = dayProblems.filter((p) =>
                  verifiedSet.has(p.id)
                ).length;
                const isStudentDayComplete = studentDaySolvedCount === dayProblems.length;

                return (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Student Column (Sticky Left) */}
                    <td
                      onClick={() => onStudentClick?.(st)}
                      className="py-3 px-4 sticky left-0 bg-white group-hover:bg-slate-50/95 transition-colors z-20 sticky-col-shadow cursor-pointer border-r border-slate-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          src={st.avatar}
                          name={st.name}
                          id={st.rollNo}
                          role="STUDENT"
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate max-w-[130px] sm:max-w-[160px]">
                            {st.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-blue-700">{st.rollNo}</span>
                            <span>&bull;</span>
                            <span>{st.progress}% Total</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 5 Daily Problem Checkboxes */}
                    {dayProblems.map((problem) => {
                      const isVerified = verifiedSet.has(problem.id);
                      const key = `${st.id}-${problem.id}`;
                      const isAnimating = justToggledId === key;

                      return (
                        <td key={problem.id} className="py-3 px-3 text-center">
                          <motion.button
                            whileHover={canVerify ? { scale: 1.08 } : {}}
                            whileTap={canVerify ? { scale: 0.92 } : {}}
                            animate={isAnimating ? { scale: [1, 1.25, 1] } : {}}
                            onClick={() => handleCellToggle(st, problem)}
                            disabled={!canVerify}
                            className={`w-11 h-11 sm:w-10 sm:h-10 rounded-2xl mx-auto flex items-center justify-center transition-all cursor-pointer touch-manipulation select-none active:opacity-85 ${
                              isVerified
                                ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-200/80'
                            } ${!canVerify ? 'cursor-default' : ''}`}
                            title={
                              isVerified
                                ? `Verified: ${problem.title} for ${st.name}`
                                : `Click to verify: ${problem.title} for ${st.name}`
                            }
                            aria-label={`Verify ${problem.title} for ${st.name}`}
                          >
                            {isVerified ? (
                              <CheckCircle2 className="w-5 h-5 sm:w-4 sm:h-4 text-white shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400/80 shrink-0" />
                            )}
                          </motion.button>
                        </td>
                      );
                    })}

                    {/* Day Solved Counter */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                          isStudentDayComplete
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : studentDaySolvedCount > 0
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {studentDaySolvedCount} / 5
                      </span>
                    </td>

                    {/* Quick Row Action: Verify All 5 */}
                    <td className="py-3 px-4 text-right">
                      {canVerify && (
                        <button
                          onClick={() => handleVerifyAllForStudent(st)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                            isStudentDayComplete
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {isStudentDayComplete ? 'Unverify' : 'Verify 5'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>
              Mentor sign-offs update the student&apos;s real-time DSA solved tally, topic mastery, and streak immediately.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDay((prev) => Math.max(1, prev - 1))}
              disabled={selectedDay === 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Day
            </button>
            <button
              onClick={() => setSelectedDay((prev) => Math.min(TOTAL_CURRICULUM_DAYS, prev + 1))}
              disabled={selectedDay === TOTAL_CURRICULUM_DAYS}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-1 shadow-xs"
            >
              Next Day <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
