import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentExamSubmission, Student } from '../../types';
import { getExamTier } from '../../data/mockExams';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const MentorExamsPage: React.FC = () => {
  const { currentUser, exams, students, addMentorFeedback } = useAuth();

  const assignedTeamId = currentUser.teamId || 'team-7';
  const assignedTeamNumber = currentUser.teamNumber || 'Team 07';
  const teamStudents = students.filter(
    s => s.teamId === assignedTeamId || s.teamNumber === assignedTeamNumber
  );

  const [selectedExamId, setSelectedExamId] = useState<string>(
    exams[0]?.id || 'exam-root-official-01'
  );
  const [inspectSubmission, setInspectSubmission] = useState<{
    student: Student;
    submission?: StudentExamSubmission;
  } | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];
  const questionCount = selectedExam?.questions?.length || 20;

  // Cohort statistics for selected exam
  const examSubmissions = selectedExam?.submissions || [];
  const teamSubmissions = teamStudents.map(st => {
    const sub = examSubmissions.find(s => s.studentId === st.id || s.studentRollNo === st.rollNo);
    return {
      student: st,
      submission: sub,
    };
  });

  const evaluatedSubs = teamSubmissions.filter(ts => ts.submission && ts.submission.status === 'EVALUATED');
  const teamAvgScore = evaluatedSubs.length > 0
    ? Math.round(evaluatedSubs.reduce((sum, ts) => sum + (ts.submission?.score || 0), 0) / evaluatedSubs.length)
    : 0;
  const teamHighestScore = evaluatedSubs.length > 0
    ? Math.max(...evaluatedSubs.map(ts => ts.submission?.score || 0))
    : 0;

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim() || !inspectSubmission) return;
    addMentorFeedback(inspectSubmission.student.id, `[Week ${selectedExam.weekNumber} Exam Feedback] ${feedbackInput.trim()}`);
    setFeedbackInput('');
    setInspectSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1.5 border border-indigo-100">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>Faculty Mentor Assessment Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {assignedTeamNumber} Weekly DSA Exams Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review exam evaluations, test case passes, and student scorecards scheduled by Dean (Root).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-2xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Cohort of <strong>{teamStudents.length} Students</strong></span>
        </div>
      </div>

      {/* Week Selector Carousel */}
      <div className="bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
          <span>Select Weekly Examination:</span>
          <span className="text-indigo-600 font-mono font-bold">{exams.length} Total Exams</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {exams.map(ex => {
            const isSelected = selectedExamId === ex.id;
            const tier = getExamTier(ex.weekNumber);
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExamId(ex.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border select-none ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span>Week {String(ex.weekNumber).padStart(2, '0')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    tier.tier === 'EASY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : tier.tier === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {tier.tier}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    ex.status === 'LIVE'
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : ex.status === 'COMPLETED'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ex.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Exam Information & Cohort KPI Grid */}
      {selectedExam && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-white via-indigo-50/20 to-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                  Week {String(selectedExam.weekNumber).padStart(2, '0')} Assessment ({questionCount} Problems)
                </span>
                {(() => {
                  const tier = getExamTier(selectedExam.weekNumber);
                  return (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        tier.tier === 'EASY'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : tier.tier === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {tier.tier} TIER
                    </span>
                  );
                })()}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedExam.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Focus: <strong className="text-slate-700">{selectedExam.topicFocus}</strong> &bull; Scheduled: {selectedExam.scheduledDate} ({selectedExam.durationMinutes} Mins)
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 flex-wrap">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Cohort Average</div>
                <div className="text-lg font-extrabold text-indigo-700 font-mono">
                  {teamAvgScore > 0 ? `${teamAvgScore} / 100` : 'Pending'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Cohort Highest</div>
                <div className="text-lg font-extrabold text-emerald-700 font-mono">
                  {teamHighestScore > 0 ? `${teamHighestScore} / 100` : '--'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {teamAvgScore > 0 ? `${Math.round(teamAvgScore)}%` : '--'}
              </div>
            </div>
          </div>

          {/* Assigned Students Roster Exam Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-sm">
                  {assignedTeamNumber} Student Submissions ({teamStudents.length} Students)
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Click any row to review code & evaluation</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-3">Roll Number</th>
                    <th className="py-3 px-3 text-center">Randomized Paper Set</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3 text-center">Problems Solved</th>
                    <th className="py-3 px-3 text-center">Time Spent</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamSubmissions.map(({ student, submission }) => {
                    const hasSubmitted = Boolean(submission);
                    const score = submission?.score ?? 0;
                    const solved = submission?.questionsSolved ?? 0;

                    return (
                      <tr
                        key={student.id}
                        onClick={() => setInspectSubmission({ student, submission })}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              src={student.avatar}
                              name={student.name}
                              id={student.rollNo}
                              role="STUDENT"
                              size="sm"
                            />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {student.name}
                              </div>
                              <div className="text-[10px] text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-blue-700">
                          {student.rollNo}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                          <span className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            {submission?.randomizedSetCode || 'SET-A'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono">
                          {hasSubmitted ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {score} / 100
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">--</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center font-mono">
                          {hasSubmitted ? (
                            <span className="font-bold text-slate-800">{solved} / {questionCount}</span>
                          ) : (
                            <span className="text-slate-400">0 / {questionCount}</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center text-slate-600">
                          {submission?.timeSpentMinutes ? `${submission.timeSpentMinutes} mins` : '--'}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {hasSubmitted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Evaluated</span>
                            </span>
                          ) : selectedExam.status === 'LIVE' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>In Progress</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              <span>Scheduled</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectSubmission({ student, submission });
                            }}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Exam Dossier & Code Inspector Modal */}
      <AnimatePresence>
        {inspectSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectSubmission(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={inspectSubmission.student.avatar}
                    name={inspectSubmission.student.name}
                    id={inspectSubmission.student.rollNo}
                    role="STUDENT"
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{inspectSubmission.student.name}</h3>
                      <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {inspectSubmission.submission?.randomizedSetCode || 'SET-A'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      <span className="font-bold text-blue-700">{inspectSubmission.student.rollNo}</span>
                      <span>&bull;</span>
                      <span>{inspectSubmission.student.teamNumber}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setInspectSubmission(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scorecard Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Week {selectedExam.weekNumber} Assessment Result
                  </span>
                  <span className="text-sm font-extrabold text-indigo-700 font-mono">
                    {inspectSubmission.submission ? `${inspectSubmission.submission.score} / 100 Marks` : 'Pending Submission'}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {selectedExam.title} &bull; {selectedExam.topicFocus} ({questionCount} Questions)
                </div>
              </div>

              {/* Solved Questions List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  Exam Problems Evaluation ({questionCount} Questions):
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {selectedExam.questions?.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400">Q{idx + 1}.</span>
                        <span className="font-semibold text-slate-800">{q.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-bold">{q.difficulty}</span>
                      </div>
                      <span className="text-emerald-700 font-bold font-mono">
                        {inspectSubmission.submission ? `${q.marks} / ${q.marks} pts` : '0 pts'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Feedback Input Form */}
              <form onSubmit={handleAddFeedback} className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Add Mentor Feedback / Note</label>
                <textarea
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  placeholder="Provide guidance or commendation on this weekly exam..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectSubmission(null)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                  >
                    Save Feedback
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
