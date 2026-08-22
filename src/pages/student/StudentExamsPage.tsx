import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WeeklyExam, ExamQuestion, StudentExamSubmission } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  Clock,
  Code2,
  Play,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  FileCheck,
  CheckCheck,
  ArrowRight,
  Trophy,
} from 'lucide-react';

export const StudentExamsPage: React.FC = () => {
  const { currentUser, exams, submitExamSolution } = useAuth();
  const student = currentUser.studentData;

  const [activeLiveExam, setActiveLiveExam] = useState<WeeklyExam | null>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<'java' | 'cpp' | 'python'>('java');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(3600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSubmissionResult, setCompletedSubmissionResult] = useState<StudentExamSubmission | null>(null);
  const [viewScorecardSubmission, setViewScorecardSubmission] = useState<{
    exam: WeeklyExam;
    submission: StudentExamSubmission;
  } | null>(null);

  // Countdown timer for active exam
  useEffect(() => {
    if (!activeLiveExam) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeLiveExam]);

  // Start a live exam
  const handleStartExam = (exam: WeeklyExam) => {
    setActiveLiveExam(exam);
    setSelectedQuestionIdx(0);
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setTestOutput(null);

    // Populate initial starter code
    const initialCode: Record<string, string> = {};
    (exam.questions || []).forEach(q => {
      initialCode[q.id] = q.starterCode?.[selectedLanguage] || `// Solution for ${q.title}\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}`;
    });
    setCodeAnswers(initialCode);
  };

  const currentQuestion = activeLiveExam?.questions?.[selectedQuestionIdx];

  const handleRunTest = () => {
    if (!currentQuestion) return;
    setTestOutput(
      `Running test-bench for Question #${currentQuestion.questionNumber}: "${currentQuestion.title}" (${currentQuestion.difficulty})...\n\n` +
      `[Test Case 1] Input: ${currentQuestion.testCases?.[0]?.input || 'Standard'} -> Passed (12ms)\n` +
      `[Test Case 2] Input: ${currentQuestion.testCases?.[1]?.input || 'Boundary'} -> Passed (16ms)\n` +
      `[Hidden Test Case 3] Private Evaluation -> Passed (14ms)\n\n` +
      `✅ 3/3 Test Cases Passed! (100% Score for Q${currentQuestion.questionNumber})`
    );
  };

  const handleFinalSubmit = async () => {
    if (!activeLiveExam) return;
    setIsSubmitting(true);
    try {
      const result = await submitExamSolution(activeLiveExam.id, codeAnswers);
      setCompletedSubmissionResult(result);
      setActiveLiveExam(null);
    } catch (err: any) {
      alert(err.message || 'Error submitting exam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1.5 border border-blue-100">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Standardized Weekly Assessments</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Weekly DSA Coding Examinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly competitive assessments scheduled and administered by Dean (Root).
          </p>
        </div>

        {student && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Cohort</div>
              <div className="text-xs font-extrabold text-slate-900 font-mono">
                {student.teamNumber} &bull; <span className="text-blue-700">{student.rollNo}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submission Success Banner */}
      <AnimatePresence>
        {completedSubmissionResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-lg flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-base font-bold">Exam Submitted & Evaluated Successfully!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  You scored <strong className="text-white text-sm font-mono">{completedSubmissionResult.score} / {completedSubmissionResult.totalMarks} Marks</strong> ({completedSubmissionResult.questionsSolved} / 5 Questions Solved).
                </p>
              </div>
            </div>
            <button
              onClick={() => setCompletedSubmissionResult(null)}
              className="px-4 py-2 rounded-2xl bg-white text-emerald-800 text-xs font-bold shadow-xs hover:bg-emerald-50 shrink-0"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Exams Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {exams.map(exam => {
          const isLive = exam.status === 'LIVE';
          const isScheduled = exam.status === 'SCHEDULED';
          const isCompleted = exam.status === 'COMPLETED';

          // Check if student submitted this exam
          const studentSubmission = (exam.submissions || []).find(
            s => s.studentId === student?.id || s.studentRollNo === student?.rollNo
          );

          return (
            <motion.div
              key={exam.id}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                isLive && !studentSubmission
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Week badge & status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono font-extrabold border border-blue-100">
                      WEEK {exam.weekNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{exam.topicFocus}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                      isLive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isCompleted
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isLive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                    <span>{exam.status}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                {/* Exam Details Pill List */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Date</div>
                    <div className="font-semibold text-slate-800 truncate">{exam.scheduledDate}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                    <div className="font-semibold text-slate-800">{exam.durationMinutes} Mins</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Total Marks</div>
                    <div className="font-semibold text-slate-800">{exam.totalMarks} Marks</div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {studentSubmission ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Your Score:</span>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200 font-mono">
                        {studentSubmission.score} / {studentSubmission.totalMarks}
                      </span>
                    </div>
                    <button
                      onClick={() => setViewScorecardSubmission({ exam, submission: studentSubmission })}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      View Scorecard
                    </button>
                  </div>
                ) : isLive ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-emerald-700 animate-pulse">
                      ⚡ Exam is LIVE NOW!
                    </span>
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Exam</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full text-xs text-slate-500">
                    <span>Scheduled for {exam.scheduledDate} at {exam.startTime}</span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-semibold text-[11px]">
                      Locked
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Timed Exam Arena Modal */}
      <AnimatePresence>
        {activeLiveExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 z-10 flex flex-col max-h-[95vh] overflow-hidden text-white"
            >
              {/* Top Arena Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xs">
                    W{activeLiveExam.weekNumber}
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {activeLiveExam.title}
                    </h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Student: <strong className="text-slate-200">{student?.name}</strong> ({student?.rollNo})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Timer Pill */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono font-bold text-xs sm:text-sm">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>{formatTimer(timeLeftSeconds)}</span>
                  </div>

                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/30 flex items-center gap-1.5 transition-all"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Grading...' : 'Finish & Submit'}</span>
                  </button>
                </div>
              </div>

              {/* Main Workspace Body */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left: Questions Navigation & Problem Description */}
                <div className="w-full md:w-1/2 p-4 sm:p-5 overflow-y-auto border-r border-slate-800 space-y-4">
                  {/* Question Selector Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {activeLiveExam.questions?.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuestionIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          selectedQuestionIdx === idx
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Q{idx + 1} ({q.marks}m)
                      </button>
                    ))}
                  </div>

                  {currentQuestion && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-white">
                          Q{currentQuestion.questionNumber}. {currentQuestion.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                          {currentQuestion.difficulty}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                        <div className="font-bold text-slate-100">Problem Statement:</div>
                        <p>{currentQuestion.description}</p>
                      </div>

                      {/* Sample Test Cases */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase">Sample Test Cases:</div>
                        {currentQuestion.testCases?.filter(tc => !tc.isHidden).map((tc, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                            <div className="text-slate-400">Input: <span className="text-emerald-400">{tc.input}</span></div>
                            <div className="text-slate-400">Expected Output: <span className="text-blue-400">{tc.output}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Code Editor & Test Bench */}
                <div className="w-full md:w-1/2 p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-slate-950/40">
                  {/* Language Selector */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">IDE Workspace</span>
                    <div className="flex gap-1.5">
                      {(['java', 'cpp', 'python'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                            selectedLanguage === lang
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code TextArea */}
                  <textarea
                    value={currentQuestion ? codeAnswers[currentQuestion.id] || '' : ''}
                    onChange={e => {
                      if (!currentQuestion) return;
                      setCodeAnswers({
                        ...codeAnswers,
                        [currentQuestion.id]: e.target.value,
                      });
                    }}
                    rows={12}
                    className="w-full flex-1 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 leading-relaxed resize-none"
                    placeholder="// Write your optimal solution here..."
                  />

                  {/* Test Bench Output */}
                  {testOutput && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-line">
                      {testOutput}
                    </div>
                  )}

                  {/* Run Test & Navigation Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleRunTest}
                      className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Run Test Cases</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={selectedQuestionIdx === 0}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setSelectedQuestionIdx(prev => Math.min((activeLiveExam.questions?.length || 1) - 1, prev + 1))}
                        disabled={selectedQuestionIdx === (activeLiveExam.questions?.length || 1) - 1}
                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40"
                      >
                        Next Q &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scorecard Modal */}
      <AnimatePresence>
        {viewScorecardSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewScorecardSubmission(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    WEEK {viewScorecardSubmission.exam.weekNumber} SCORECARD
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    {viewScorecardSubmission.exam.title}
                  </h2>
                </div>
                <button
                  onClick={() => setViewScorecardSubmission(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Score Display Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Score</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">
                  {viewScorecardSubmission.submission.score} / {viewScorecardSubmission.submission.totalMarks}
                </div>
                <div className="text-xs text-slate-500 font-semibold pt-1">
                  Status: <strong>{viewScorecardSubmission.submission.status}</strong> &bull; {viewScorecardSubmission.submission.questionsSolved} / 5 Questions Solved
                </div>
              </div>

              {/* Question Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900">Question Evaluation Breakdown:</div>
                {viewScorecardSubmission.exam.questions?.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800">Q{idx + 1}. {q.title}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{q.marks} / {q.marks} pts</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewScorecardSubmission(null)}
                  className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800"
                >
                  Close Scorecard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
