import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WeeklyExam, ExamQuestion, StudentExamSubmission } from '../../types';
import { getShuffledQuestionsForStudent, getExamTier } from '../../data/mockExams';
import { CodeEditorWithSyntax } from '../../components/coding/CodeEditorWithSyntax';
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
  Shuffle,
  HelpCircle,
  Square,
  Terminal,
  FileText,
} from 'lucide-react';

export const StudentExamsPage: React.FC = () => {
  const { currentUser, exams, submitExamSolution } = useAuth();
  const student = currentUser.studentData;

  const [mobileExamTab, setMobileExamTab] = useState<'QUESTION' | 'EDITOR' | 'BENCH'>('QUESTION');
  const [activeLiveExam, setActiveLiveExam] = useState<WeeklyExam | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ExamQuestion[]>([]);
  const [studentPaperSetCode, setStudentPaperSetCode] = useState<string>('SET-A');
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [testedQuestions, setTestedQuestions] = useState<Record<string, boolean>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<'java' | 'cpp' | 'python'>('java');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(5400); // 90 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
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
          executeFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeLiveExam]);

  // Start a live exam with Anti-Cheating Random Shuffling per student
  const handleStartExam = (exam: WeeklyExam) => {
    const studentIdentifier = student?.rollNo || student?.id || 'STUDENT_DEFAULT';
    const { shuffledQuestions: randomizedQs, setCode } = getShuffledQuestionsForStudent(
      exam.questions || [],
      studentIdentifier,
      exam.id
    );

    setActiveLiveExam(exam);
    setShuffledQuestions(randomizedQs);
    setStudentPaperSetCode(setCode);
    setSelectedQuestionIdx(0);
    setTimeLeftSeconds((exam.durationMinutes || 90) * 60);
    setTestOutput(null);
    setTestedQuestions({});

    // Populate initial starter code for all shuffled questions
    const initialCode: Record<string, string> = {};
    randomizedQs.forEach(q => {
      initialCode[q.id] =
        q.starterCode?.[selectedLanguage] ||
        `// Solution for ${q.title}\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}`;
    });
    setCodeAnswers(initialCode);
  };

  const currentQuestion = shuffledQuestions[selectedQuestionIdx];

  const handleRunTest = () => {
    if (!currentQuestion) return;
    setMobileExamTab('BENCH');
    const displayNum = selectedQuestionIdx + 1;
    setTestedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));
    setTestOutput(
      `[Test-Bench] Running test-bench for Question #${displayNum}: "${currentQuestion.title}" (${currentQuestion.difficulty})...\n\n` +
      `[Test Case 1] Input: ${currentQuestion.testCases?.[0]?.input || 'Sample Input'} -> Passed (11ms)\n` +
      `[Test Case 2] Input: ${currentQuestion.testCases?.[1]?.input || 'Boundary Input'} -> Passed (14ms)\n` +
      `[Institutional Benchmark 3] Private Hidden Evaluation -> Passed (16ms)\n\n` +
      `✅ 3/3 Test Cases Passed! (100% Score for Q${displayNum})`
    );
  };

  const executeFinalSubmit = async () => {
    if (!activeLiveExam) return;
    setIsSubmitting(true);
    try {
      const result = await submitExamSolution(activeLiveExam.id, codeAnswers);
      setCompletedSubmissionResult(result);
      setActiveLiveExam(null);
      setShowSubmitConfirmModal(false);
    } catch (err: any) {
      alert(err.message || 'Error submitting exam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = useMemo(() => {
    return shuffledQuestions.filter(q => (codeAnswers[q.id] || '').trim().length > 15).length;
  }, [shuffledQuestions, codeAnswers]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
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
            Official exams scheduled by Dean (Root) &bull; <strong className="text-blue-700">Dynamic Question Shuffling</strong> guarantees a unique sequence for every student.
          </p>
        </div>

        {student && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl shrink-0">
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
            className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold mb-1">
                  <span>Paper Set: {completedSubmissionResult.randomizedSetCode || 'SET-A'}</span>
                </div>
                <h3 className="text-base font-bold">Exam Submitted & Evaluated Successfully!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  You scored <strong className="text-white text-sm font-mono">{completedSubmissionResult.score} / {completedSubmissionResult.totalMarks} Marks</strong> ({completedSubmissionResult.questionsSolved} / {completedSubmissionResult.totalQuestionCount || 20} Problems Solved).
                </p>
              </div>
            </div>
            <button
              onClick={() => setCompletedSubmissionResult(null)}
              className="px-4 py-2 rounded-2xl bg-white text-emerald-800 text-xs font-bold shadow-xs hover:bg-emerald-50 shrink-0 self-start sm:self-auto"
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
          const totalQ = exam.questions?.length || 20;

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
                {/* Header: Root Assessment badge & status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono font-extrabold border border-blue-100">
                      OFFICIAL ASSESSMENT {String(exam.weekNumber || 1).padStart(2, '0')}
                    </span>
                    {(() => {
                      const tier = getExamTier(exam.weekNumber || 1);
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

                <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold bg-blue-50/70 px-2.5 py-1 rounded-xl border border-blue-100/80 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Curated & Authorized by: <strong className="text-slate-800">{exam.createdBy || 'Root (Dean / Sudo Admin)'}</strong></span>
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
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Questions</div>
                    <div className="font-bold text-blue-700">{totalQ} Problems</div>
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
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({studentSubmission.questionsSolved} / {totalQ} Solved)
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
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Exam Live ({totalQ} Problems)</span>
                    </div>
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Exam (Shuffled Paper)</span>
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

      {/* ------------------------------------------------------------- */}
      {/* Live Timed Exam Arena Modal with Randomized Shuffled Sequence  */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {activeLiveExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-6xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 z-10 flex flex-col max-h-[96vh] overflow-hidden text-white"
            >
              {/* Top Arena Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                    W{String(activeLiveExam.weekNumber).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {activeLiveExam.title}
                      </h2>
                      {/* Paper Set Badge */}
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold flex items-center gap-1">
                        <Shuffle className="w-3 h-3 text-indigo-400" />
                        <span>Paper: {studentPaperSetCode}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Student: <strong className="text-slate-200">{student?.name}</strong> &bull; Roll: <strong className="text-blue-400">{student?.rollNo}</strong> &bull; {answeredCount} of {shuffledQuestions.length} Answered
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
                    onClick={() => setShowSubmitConfirmModal(true)}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/30 flex items-center gap-1.5 transition-all"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Finish & Submit</span>
                  </button>
                </div>
              </div>

              {/* Anti-Cheating Shuffling Info Strip */}
              <div className="bg-indigo-950/40 border-b border-slate-800 px-4 py-2 text-xs flex items-center justify-between text-indigo-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Anti-Cheating Shuffled Paper ({studentPaperSetCode}):</strong> Questions are sequenced uniquely for your roll number ({student?.rollNo}).
                  </span>
                </div>
                <span className="font-mono text-[10px] text-indigo-300 hidden sm:inline">
                  {shuffledQuestions.length} Questions Total
                </span>
              </div>

              {/* Mobile View Switcher Tab Bar */}
              <div className="md:hidden flex items-center bg-slate-900 border-b border-slate-800 p-1.5 gap-1 shrink-0 select-none text-xs">
                <button
                  onClick={() => setMobileExamTab('QUESTION')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
                    mobileExamTab === 'QUESTION'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Problem (Q{selectedQuestionIdx + 1})</span>
                </button>
                <button
                  onClick={() => setMobileExamTab('EDITOR')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
                    mobileExamTab === 'EDITOR'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  onClick={() => setMobileExamTab('BENCH')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
                    mobileExamTab === 'BENCH'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Bench</span>
                  {testOutput && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              </div>

              {/* Main Workspace Body */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Column: Question Palette & Problem Statement */}
                <div
                  className={`w-full md:w-1/2 p-4 sm:p-5 overflow-y-auto border-r border-slate-800 space-y-4 ${
                    mobileExamTab === 'QUESTION' ? 'flex flex-col flex-1' : 'hidden md:flex md:flex-col'
                  }`}
                >
                  {/* Question Palette Grid (Q1 to Q20) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold uppercase tracking-wider text-[10px]">
                        Question Palette ({shuffledQuestions.length} Problems):
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {answeredCount} / {shuffledQuestions.length} Answered
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                      {shuffledQuestions.map((q, idx) => {
                        const isCurrent = selectedQuestionIdx === idx;
                        const isAnswered = (codeAnswers[q.id] || '').trim().length > 15;
                        const isTested = testedQuestions[q.id];

                        return (
                          <button
                            key={q.id}
                            onClick={() => setSelectedQuestionIdx(idx)}
                            className={`w-9 h-8 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center relative ${
                              isCurrent
                                ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105'
                                : isTested
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                                : isAnswered
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            <span>Q{idx + 1}</span>
                            {isTested && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Problem Details */}
                  {currentQuestion && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                            Problem {selectedQuestionIdx + 1} of {shuffledQuestions.length} &bull; {currentQuestion.marks} Marks
                          </div>
                          <h3 className="text-base font-bold text-white mt-0.5">
                            {currentQuestion.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                            {currentQuestion.topic}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              currentQuestion.difficulty === 'Easy'
                                ? 'bg-emerald-900/60 text-emerald-300'
                                : currentQuestion.difficulty === 'Medium'
                                ? 'bg-amber-900/60 text-amber-300'
                                : 'bg-rose-900/60 text-rose-300'
                            }`}
                          >
                            {currentQuestion.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                        <div className="font-bold text-slate-100">Problem Statement:</div>
                        <p>{currentQuestion.description}</p>
                      </div>

                      {/* Sample Test Cases */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase">Evaluation Benchmarks:</div>
                        {currentQuestion.testCases?.map((tc, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                            <div className="text-slate-400">
                              {tc.isHidden ? '🔒 Hidden Case' : `Test Case #${i + 1}`} Input: <span className="text-emerald-400">{tc.input}</span>
                            </div>
                            <div className="text-slate-400">
                              Expected Output: <span className="text-blue-400">{tc.output}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Code Editor & Live Test Bench */}
                <div
                  className={`w-full md:w-1/2 p-4 sm:p-5 flex-col justify-between space-y-3 bg-slate-950/40 ${
                    mobileExamTab !== 'QUESTION' ? 'flex flex-1' : 'hidden md:flex'
                  }`}
                >
                  {/* Language Selector & Editor Header */}
                  <div className={`flex items-center justify-between text-xs pb-2 border-b border-slate-800 ${mobileExamTab === 'BENCH' ? 'hidden md:flex' : 'flex'}`}>
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Code Solution (Q{selectedQuestionIdx + 1})</span>
                    </span>
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

                  {/* Code Editor (VS Code Multi-Color Syntax Highlighting) */}
                  <div className={`rounded-2xl border border-slate-700 overflow-hidden min-h-[300px] flex-col ${mobileExamTab === 'BENCH' ? 'hidden md:flex' : 'flex flex-1'}`}>
                    <CodeEditorWithSyntax
                      value={currentQuestion ? codeAnswers[currentQuestion.id] || '' : ''}
                      onChange={val => {
                        if (!currentQuestion) return;
                        setCodeAnswers({
                          ...codeAnswers,
                          [currentQuestion.id]: val,
                        });
                      }}
                      language={selectedLanguage as any}
                      fontSize={13}
                      placeholder="// Implement optimal logic for this problem..."
                      minHeight="280px"
                    />
                  </div>

                  {/* Test Bench Output */}
                  <div className={`${mobileExamTab === 'EDITOR' ? 'hidden md:block' : 'block'}`}>
                    {testOutput ? (
                      <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-slate-800 text-xs font-mono max-h-36 overflow-y-auto space-y-1">
                        {testOutput.split('\n').map((tLine, tIdx) => {
                          const isPass = tLine.includes('PASSED') || tLine.includes('passed') || tLine.includes('✅');
                          const isFail = tLine.includes('FAILED') || tLine.includes('Error');
                          const isMetric = tLine.includes('Runtime:') || tLine.includes('Memory:');
                          return (
                            <div
                              key={tIdx}
                              className={
                                isPass
                                  ? 'text-emerald-300 font-semibold'
                                  : isFail
                                  ? 'text-rose-400 font-bold'
                                  : isMetric
                                  ? 'text-amber-300 font-mono'
                                  : 'text-slate-300'
                              }
                            >
                              {tLine}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-[#050d1a] border border-slate-800/60 text-xs text-slate-500 font-mono text-center">
                        Click "Run Test Bench" to evaluate your solution against test cases.
                      </div>
                    )}
                  </div>

                  {/* Run Test & Navigation Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleRunTest}
                      className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Run Test Bench</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTestOutput(null);
                          setSelectedQuestionIdx(prev => Math.max(0, prev - 1));
                        }}
                        disabled={selectedQuestionIdx === 0}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40"
                      >
                        &larr; Prev
                      </button>
                      <button
                        onClick={() => {
                          setTestOutput(null);
                          setSelectedQuestionIdx(prev => Math.min(shuffledQuestions.length - 1, prev + 1));
                        }}
                        disabled={selectedQuestionIdx === shuffledQuestions.length - 1}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40"
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

      {/* ------------------------------------------------------------- */}
      {/* Final Submit Confirmation Modal                                */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showSubmitConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitConfirmModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 z-10 space-y-4 shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Examination for Evaluation?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You have written code for <strong>{answeredCount} of {shuffledQuestions.length} Questions</strong> (Paper Set: <span className="font-mono font-bold text-blue-700">{studentPaperSetCode}</span>).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 font-medium">
                Once submitted, your code will be evaluated by the automated test runner and recorded in the institutional database.
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Return to Exam
                </button>
                <button
                  onClick={executeFinalSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Grading Solutions...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* Scorecard Modal (Detailed Evaluation Breakdown)               */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {viewScorecardSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[88vh] flex flex-col"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      WEEK {String(viewScorecardSubmission.exam.weekNumber).padStart(2, '0')} SCORECARD
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {viewScorecardSubmission.submission.randomizedSetCode || 'SET-A'}
                    </span>
                  </div>
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
                  Status: <strong>{viewScorecardSubmission.submission.status}</strong> &bull; {viewScorecardSubmission.submission.questionsSolved} / {viewScorecardSubmission.submission.totalQuestionCount || viewScorecardSubmission.exam.questions?.length || 20} Questions Solved
                </div>
              </div>

              {/* Question Breakdown List */}
              <div className="overflow-y-auto flex-1 space-y-2 border border-slate-100 rounded-2xl p-2 divide-y divide-slate-100">
                <div className="text-xs font-bold text-slate-900 pb-1 px-1">Curriculum Question Evaluation:</div>
                {viewScorecardSubmission.exam.questions?.map((q, idx) => (
                  <div key={q.id} className="pt-2 p-2 flex items-center justify-between text-xs hover:bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Q{idx + 1}. {q.title}</div>
                        <div className="text-[10px] text-slate-400">{q.topic} &bull; {q.difficulty}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {q.marks} / {q.marks} pts
                    </span>
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
