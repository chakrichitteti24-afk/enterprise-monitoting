import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WeeklyExam, ExamQuestion, StudentExamSubmission } from '../../types';
import { getShuffledQuestionsForStudent, getExamTier, calculateExamRemainingSeconds } from '../../data/mockExams';
import { executeRealCode } from '../../utils/realCodeRunner';
import { CodeEditorWithSyntax } from '../../components/coding/CodeEditorWithSyntax';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  Clock,
  Code2,
  Play,
  Pause,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  CheckCheck,
  Trophy,
  Shuffle,
  FileText,
  Loader2,
} from 'lucide-react';

export const StudentExamsPage: React.FC = () => {
  const { currentUser, exams, submitExamSolution } = useAuth();
  const student = currentUser.studentData;

  const [mobileExamTab, setMobileExamTab] = useState<'QUESTION' | 'EDITOR' | 'BENCH'>('QUESTION');
  const [activeLiveExam, setActiveLiveExam] = useState<WeeklyExam | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ExamQuestion[]>([]);
  const [studentPaperSetCode, setStudentPaperSetCode] = useState<string>('SET-A');
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [codeAnswers, setCodeAnswers] = useState<Record<string, Record<'java' | 'cpp' | 'python', string>>>({});
  const [questionLanguages, setQuestionLanguages] = useState<Record<string, 'java' | 'cpp' | 'python'>>({});
  const [testedQuestions, setTestedQuestions] = useState<Record<string, boolean>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<'java' | 'cpp' | 'python'>('java');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(5400); // 90 mins
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [completedSubmissionResult, setCompletedSubmissionResult] = useState<StudentExamSubmission | null>(null);
  const [viewScorecardSubmission, setViewScorecardSubmission] = useState<{
    exam: WeeklyExam;
    submission: StudentExamSubmission;
  } | null>(null);

  // 1-second interval ticker for student UI
  useEffect(() => {
    const ticker = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const liveExamInContext = activeLiveExam
    ? exams.find(e => e.id === activeLiveExam.id) || activeLiveExam
    : null;
  const isExamPaused = liveExamInContext?.status === 'PAUSED';

  const getStarterCode = useCallback((q: ExamQuestion, lang: 'java' | 'cpp' | 'python'): string => {
    if (q.starterCode && q.starterCode[lang]) {
      return q.starterCode[lang]!;
    }
    if (lang === 'java') {
      return `// Solution for ${q.title} (${q.topic})\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Read input from sc and print output\n        System.out.println(0);\n    }\n}`;
    } else if (lang === 'cpp') {
      return `// Solution for ${q.title} (${q.topic})\n#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    // TODO: Read input from cin and print output\n    cout << 0 << endl;\n    return 0;\n}`;
    } else {
      return `# Solution for ${q.title} (${q.topic})\nimport sys\n\ndef main():\n    # TODO: Read input from sys.stdin and print output\n    # data = sys.stdin.read().split()\n    print(0)\n\nif __name__ == '__main__':\n    main()`;
    }
  }, []);

  const executeFinalSubmit = useCallback(async () => {
    if (!activeLiveExam) return;
    setIsSubmitting(true);
    try {
      const flatAnswers: Record<string, string> = {};
      shuffledQuestions.forEach(q => {
        const lang = questionLanguages[q.id] || selectedLanguage;
        flatAnswers[q.id] = codeAnswers[q.id]?.[lang] || getStarterCode(q, lang);
      });
      const result = await submitExamSolution(activeLiveExam.id, flatAnswers);
      setCompletedSubmissionResult(result);
      setActiveLiveExam(null);
      setShowSubmitConfirmModal(false);
    } catch (err: any) {
      alert(err.message || 'Error submitting exam.');
    } finally {
      setIsSubmitting(false);
    }
  }, [activeLiveExam, codeAnswers, questionLanguages, selectedLanguage, shuffledQuestions, submitExamSolution, getStarterCode]);

  // Lock body scroll while live exam or scorecard is open
  useEffect(() => {
    if (activeLiveExam || viewScorecardSubmission || completedSubmissionResult) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeLiveExam, viewScorecardSubmission, completedSubmissionResult]);

  // Countdown timer for active exam synchronized with 90-min official launch timeline
  useEffect(() => {
    if (!activeLiveExam) return;

    const latest = exams.find(e => e.id === activeLiveExam.id) || activeLiveExam;
    if (latest.status === 'COMPLETED') {
      executeFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      const currentSync = exams.find(e => e.id === activeLiveExam.id) || activeLiveExam;
      if (currentSync.status === 'COMPLETED') {
        clearInterval(timer);
        executeFinalSubmit();
        return;
      }
      const remaining = calculateExamRemainingSeconds(currentSync);
      setTimeLeftSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        executeFinalSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeLiveExam, exams, executeFinalSubmit]);

  // Start a live exam with Anti-Cheating Random Shuffling per student
  const handleStartExam = (exam: WeeklyExam) => {
    const remaining = calculateExamRemainingSeconds(exam);
    if (remaining <= 0 || exam.status === 'COMPLETED') {
      alert('The 90-minute examination period has already concluded.');
      return;
    }
    if (exam.status === 'PAUSED') {
      alert('This examination is currently paused by Root (Dean). Please wait for resumption.');
      return;
    }

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
    setTimeLeftSeconds(remaining);
    setTestOutput(null);
    setTestedQuestions({});

    // Populate initial starter code for each language across all shuffled questions
    const initialCode: Record<string, Record<'java' | 'cpp' | 'python', string>> = {};
    const initialLangs: Record<string, 'java' | 'cpp' | 'python'> = {};
    randomizedQs.forEach(q => {
      initialCode[q.id] = {
        java: getStarterCode(q, 'java'),
        cpp: getStarterCode(q, 'cpp'),
        python: getStarterCode(q, 'python'),
      };
      initialLangs[q.id] = 'java';
    });
    setCodeAnswers(initialCode);
    setQuestionLanguages(initialLangs);
    setSelectedLanguage('java');
  };

  const currentQuestion = shuffledQuestions[selectedQuestionIdx];

  const handleLanguageChange = (newLang: 'java' | 'cpp' | 'python') => {
    setSelectedLanguage(newLang);
    if (currentQuestion) {
      setQuestionLanguages(prev => ({
        ...prev,
        [currentQuestion.id]: newLang,
      }));
      setCodeAnswers(prev => {
        const qAnswers = prev[currentQuestion.id] || {
          java: getStarterCode(currentQuestion, 'java'),
          cpp: getStarterCode(currentQuestion, 'cpp'),
          python: getStarterCode(currentQuestion, 'python'),
        };
        return {
          ...prev,
          [currentQuestion.id]: {
            ...qAnswers,
            [newLang]: qAnswers[newLang] || getStarterCode(currentQuestion, newLang),
          },
        };
      });
    }
  };

  const handleSelectQuestion = (idx: number) => {
    setTestOutput(null);
    setSelectedQuestionIdx(idx);
    const targetQ = shuffledQuestions[idx];
    if (targetQ) {
      const qLang = questionLanguages[targetQ.id] || selectedLanguage;
      setSelectedLanguage(qLang);
    }
  };

  const handleRunTest = async () => {
    if (!currentQuestion || isExamPaused) return;
    setIsRunningTest(true);
    const activeLang = questionLanguages[currentQuestion.id] || selectedLanguage;
    const currentCode = (codeAnswers[currentQuestion.id]?.[activeLang] || getStarterCode(currentQuestion, activeLang)).trim();

    const firstCase = currentQuestion.testCases?.[0] || { input: '5', output: '15' };
    const testCasesToRun = [
      {
        id: 1,
        input: firstCase.input || '5',
        expectedOutput: firstCase.output || '15',
        isHidden: false,
      },
    ];

    const result = await executeRealCode(currentCode, activeLang, testCasesToRun);
    setIsRunningTest(false);

    if (result.status === 'ACCEPTED') {
      setTestedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));
    }

    setTestOutput(result.logs);
  };

  const answeredCount = useMemo(() => {
    return shuffledQuestions.filter(q => {
      const lang = questionLanguages[q.id] || selectedLanguage;
      const code = (codeAnswers[q.id]?.[lang] || '').trim();
      const starter = getStarterCode(q, lang).trim();
      return code.length > 25 && code !== starter;
    }).length;
  }, [shuffledQuestions, codeAnswers, questionLanguages, selectedLanguage, getStarterCode]);

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
      {exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-white/85 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-1">No Exams Scheduled Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            No weekly assessments have been published by the Dean yet.
            You will be notified here when an exam is scheduled.
          </p>
          <div className="mt-4 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-[11px] font-semibold">
            📋 Awaiting Dean (Root) to schedule first assessment
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {exams.map(exam => {
            const isLive = exam.status === 'LIVE';
            const isPaused = exam.status === 'PAUSED';
            const isCompleted = exam.status === 'COMPLETED';
            const totalQ = exam.questions?.length || 20;
            const studentSubmission = (exam.submissions || []).find(
              s => s.studentId === student?.id || s.studentRollNo === student?.rollNo
            );

            const remainingSecs = calculateExamRemainingSeconds(exam, currentTime);
            const totalDurationSecs = (exam.durationMinutes || 90) * 60;
            const elapsedSecs = Math.max(0, totalDurationSecs - remainingSecs);
            const progressPercent = Math.min(100, Math.max(0, (elapsedSecs / totalDurationSecs) * 100));
            const isExpired = (isLive || isPaused) && remainingSecs <= 0;

            return (
              <motion.div
                key={exam.id}
                whileHover={{ y: -2 }}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full ${
                  isLive && !studentSubmission && !isExpired
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                    : isPaused && !studentSubmission && !isExpired
                    ? 'border-amber-300 ring-2 ring-amber-500/20'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  {/* Header: Root Assessment badge & status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono font-extrabold border border-blue-100 shrink-0">
                        OFFICIAL ASSESSMENT {String(exam.weekNumber || 1).padStart(2, '0')}
                      </span>
                      {(() => {
                        const tier = getExamTier(exam.weekNumber || 1);
                        return (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
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
                      <span className="text-xs font-semibold text-slate-500 truncate max-w-[150px]">{exam.topicFocus}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                        isLive && !isExpired
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-pulse'
                          : isPaused && !isExpired
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : isCompleted || isExpired
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {isLive && !isExpired && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                      {isPaused && !isExpired && <Pause className="w-3 h-3 text-amber-600 fill-amber-500" />}
                      <span>{isExpired ? 'COMPLETED' : exam.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold bg-blue-50/70 px-2.5 py-1 rounded-xl border border-blue-100/80 w-fit">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Curated & Authorized by: <strong className="text-slate-800">{exam.createdBy || 'Root (Dean / Sudo Admin)'}</strong></span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1 min-h-[26px]">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[36px]">
                    {exam.description}
                  </p>

                  {/* 90-Minute Live / Paused Timeline Strip */}
                  {(isLive || isPaused) && !isExpired && (
                    <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-1.5 border border-slate-800 shadow-inner">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Clock className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
                          <span className={isLive ? 'text-emerald-400' : 'text-amber-400'}>
                            {isLive ? '90-MIN TIMELINE ACTIVE' : 'EXAM PAUSED BY ROOT'}
                          </span>
                        </span>
                        <span className="font-mono font-extrabold text-xs tracking-wider text-white">
                          {formatTimer(remainingSecs)} remaining
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Duration: {exam.durationMinutes || 90} mins</span>
                        <span>Auto-ends at 00:00</span>
                      </div>
                    </div>
                  )}

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
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between min-h-[48px]">
                  {studentSubmission ? (
                    <div className="flex items-center justify-between w-full flex-wrap gap-2">
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
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Scorecard
                      </button>
                    </div>
                  ) : isPaused && !isExpired ? (
                    <div className="flex items-center justify-between w-full flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                        <Pause className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                        <span>Paused by Root ({formatTimer(remainingSecs)} left)</span>
                      </div>
                      <button
                        disabled
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed border border-slate-200"
                      >
                        <Pause className="w-3 h-3 fill-slate-400" />
                        <span>Exam Paused by Root</span>
                      </button>
                    </div>
                  ) : isLive && !isExpired ? (
                    <div className="flex items-center justify-between w-full flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Exam Live &bull; {formatTimer(remainingSecs)} left</span>
                      </div>
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Exam (Shuffled Paper)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full text-xs text-slate-500">
                      <span>{isCompleted || isExpired ? '90-minute examination period concluded' : `Scheduled for ${exam.scheduledDate} at ${exam.startTime}`}</span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-semibold text-[11px]">
                        {isCompleted || isExpired ? 'Closed' : 'Locked'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

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
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative w-full max-w-[1550px] h-[94vh] max-h-[94vh] bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 z-10 flex flex-col overflow-hidden text-white"
            >
              {/* Full Arena Pause Overlay if Root has paused the exam */}
              {isExamPaused && (
                <div className="absolute inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
                    <Pause className="w-8 h-8 fill-amber-400" />
                  </div>
                  <div className="max-w-md space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Examination Paused by Root (Dean)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      The official examination timeline has been paused by the Dean.
                      The countdown timer is frozen at <strong className="text-amber-400 font-mono text-base">{formatTimer(timeLeftSeconds)}</strong>.
                    </p>
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5 shadow-inner">
                      <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>All your written code is securely preserved.</span>
                      </p>
                      <p>• Code editor and test runner are locked until Root resumes.</p>
                      <p>• The 90-minute timeline will resume once Root unpauses.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-mono animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Waiting for Dean / Root to resume session...</span>
                  </div>
                </div>
              )}

              {/* Top Arena Header */}
              <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/90 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-md shadow-blue-600/30">
                    W{String(activeLiveExam.weekNumber).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-[450px] md:max-w-none">
                        {activeLiveExam.title}
                      </h2>
                      {/* Paper Set Badge */}
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                        <Shuffle className="w-3 h-3 text-indigo-400" />
                        <span>Paper: {studentPaperSetCode}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      Candidate: <strong className="text-slate-200">{student?.name}</strong> &bull; Roll: <strong className="text-blue-400 font-mono">{student?.rollNo}</strong> &bull; <span className="text-emerald-400 font-mono font-bold">{answeredCount} of {shuffledQuestions.length}</span> Answered
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Timer Pill */}
                  <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-2xl font-mono font-bold text-xs sm:text-sm shrink-0 ${
                    isExamPaused
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                  }`}>
                    {isExamPaused ? (
                      <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                    )}
                    <span>{formatTimer(timeLeftSeconds)} {isExamPaused ? '(PAUSED)' : ''}</span>
                  </div>

                  <button
                    onClick={() => setShowSubmitConfirmModal(true)}
                    disabled={isSubmitting || isExamPaused}
                    className="px-3.5 sm:px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-500/30 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Submit Exam</span>
                  </button>
                </div>
              </div>

              {/* Anti-Cheating Shuffling Info Strip */}
              <div className="h-8 shrink-0 bg-indigo-950/40 border-b border-slate-800 px-4 sm:px-6 text-xs flex items-center justify-between text-indigo-200">
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">
                    <strong>Anti-Cheating Sequence ({studentPaperSetCode}):</strong> Questions are sequenced uniquely for roll no ({student?.rollNo}).
                  </span>
                </div>
                <span className="font-mono text-[10px] text-indigo-300 hidden sm:inline shrink-0 ml-2">
                  {shuffledQuestions.length} Questions Pool
                </span>
              </div>

              {/* Mobile View Switcher Tab Bar */}
              <div className="md:hidden flex items-center bg-slate-900 border-b border-slate-800 p-1.5 gap-1 shrink-0 select-none text-xs">
                <button
                  onClick={() => setMobileExamTab('QUESTION')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
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
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                    mobileExamTab === 'EDITOR' || mobileExamTab === 'BENCH'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Editor & Test Bench</span>
                  {testOutput && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              </div>

              {/* Main Workspace Body */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                {/* Left Column: Problem & Question Palette */}
                <div
                  className={`w-full md:w-1/2 flex flex-col h-full min-h-0 border-r border-slate-800 bg-slate-950/20 overflow-hidden ${
                    mobileExamTab === 'QUESTION' ? 'flex flex-1' : 'hidden md:flex'
                  }`}
                >
                  {/* Left Column Top Sub-Header (Mirrors Right Column Language Header) */}
                  <div className="h-11 shrink-0 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-white font-bold">
                        Problem {selectedQuestionIdx + 1} of {shuffledQuestions.length}
                      </span>
                      {currentQuestion && (
                        <>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold hidden sm:inline">
                            {currentQuestion.topic}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              currentQuestion.difficulty === 'Easy'
                                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                                : currentQuestion.difficulty === 'Medium'
                                ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-900/60 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {currentQuestion.difficulty}
                          </span>
                        </>
                      )}
                    </div>
                    {currentQuestion && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-900/40 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-bold shrink-0">
                        {currentQuestion.marks} Marks
                      </span>
                    )}
                  </div>

                  {/* Pinned Question Palette Ribbon (Always visible, doesn't scroll away) */}
                  <div className="shrink-0 px-3 sm:px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0">
                      Palette:
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {shuffledQuestions.map((q, idx) => {
                        const isCurrent = selectedQuestionIdx === idx;
                        const qLang = questionLanguages[q.id] || selectedLanguage;
                        const ansCode = (codeAnswers[q.id]?.[qLang] || '').trim();
                        const starter = getStarterCode(q, qLang).trim();
                        const isAnswered = ansCode.length > 25 && ansCode !== starter;
                        const isTested = testedQuestions[q.id];

                        return (
                          <button
                            key={q.id}
                            onClick={() => handleSelectQuestion(idx)}
                            className={`h-7 px-2.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 shrink-0 relative cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105'
                                : isTested
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-900/80'
                                : isAnswered
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900/80'
                                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <span>Q{idx + 1}</span>
                            {isTested && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scrollable Problem Statement & Test Case Benchmark */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
                    {currentQuestion ? (
                      <>
                        <div>
                          <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                            DSA Assessment &bull; {currentQuestion.topic}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                            {currentQuestion.title}
                          </h3>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            <span>Problem Statement</span>
                          </div>
                          <p className="whitespace-pre-line">{currentQuestion.description}</p>
                        </div>

                        {/* Single Evaluation Benchmark */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Evaluation Benchmark (1 Test Case):
                          </div>
                          {currentQuestion.testCases?.slice(0, 1).map((tc, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2 shadow-inner">
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Standard Input:</div>
                                <div className="text-emerald-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg mt-1 border border-slate-800">
                                  {tc.input}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Expected Output:</div>
                                <div className="text-blue-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg mt-1 border border-slate-800">
                                  {tc.output}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-xs">
                        Select a question from the palette above to view its details.
                      </div>
                    )}
                  </div>

                  {/* Left Column Bottom Sub-Footer (Mirrors Right Column Footer) */}
                  <div className="h-14 shrink-0 px-4 py-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-xs z-20">
                    <button
                      onClick={() => handleSelectQuestion(Math.max(0, selectedQuestionIdx - 1))}
                      disabled={selectedQuestionIdx === 0}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors"
                    >
                      &larr; Prev Question
                    </button>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {selectedQuestionIdx + 1} of {shuffledQuestions.length}
                    </span>
                    <button
                      onClick={() => handleSelectQuestion(Math.min(shuffledQuestions.length - 1, selectedQuestionIdx + 1))}
                      disabled={selectedQuestionIdx === shuffledQuestions.length - 1}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 cursor-pointer transition-colors"
                    >
                      Next Question &rarr;
                    </button>
                  </div>
                </div>

                {/* Right Column: Code Editor & Live Test Bench */}
                <div
                  className={`w-full md:w-1/2 flex flex-col h-full min-h-0 overflow-hidden bg-slate-950/40 ${
                    mobileExamTab !== 'QUESTION' ? 'flex flex-1' : 'hidden md:flex'
                  }`}
                >
                  {/* Language Selector & Editor Header (Mirrors Left Column Top Sub-Header) */}
                  <div className="h-11 shrink-0 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Code Solution (Q{selectedQuestionIdx + 1})</span>
                    </span>
                    <div className="flex gap-1.5">
                      {(['java', 'cpp', 'python'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                            (questionLanguages[currentQuestion?.id || ''] || selectedLanguage) === lang
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Middle Scrollable Area: Code Editor & Live Test Bench */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0 custom-scrollbar">
                    {/* Code Editor */}
                    <div className="shrink-0">
                      <CodeEditorWithSyntax
                        value={
                          currentQuestion
                            ? (codeAnswers[currentQuestion.id]?.[questionLanguages[currentQuestion.id] || selectedLanguage] ??
                               getStarterCode(currentQuestion, questionLanguages[currentQuestion.id] || selectedLanguage))
                            : ''
                        }
                        onChange={val => {
                          if (!currentQuestion) return;
                          const activeLang = questionLanguages[currentQuestion.id] || selectedLanguage;
                          setCodeAnswers(prev => ({
                            ...prev,
                            [currentQuestion.id]: {
                              ...(prev[currentQuestion.id] || {
                                java: getStarterCode(currentQuestion, 'java'),
                                cpp: getStarterCode(currentQuestion, 'cpp'),
                                python: getStarterCode(currentQuestion, 'python'),
                              }),
                              [activeLang]: val,
                            },
                          }));
                        }}
                        language={(questionLanguages[currentQuestion?.id || ''] || selectedLanguage) as any}
                        fontSize={13}
                        placeholder="// Implement optimal logic for this problem..."
                        minHeight="320px"
                      />
                    </div>

                    {/* Test Bench Output */}
                    <div className="space-y-1.5 shrink-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Evaluation Test Bench Logs</span>
                        {testOutput && (
                          <button
                            onClick={() => setTestOutput(null)}
                            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {testOutput ? (
                        <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-slate-800 text-xs font-mono max-h-44 overflow-y-auto space-y-1 custom-scrollbar shadow-inner">
                          {testOutput.split('\n').map((tLine, tIdx) => {
                            const isPass = tLine.includes('PASSED') || tLine.includes('passed') || tLine.includes('✅') || tLine.includes('SUCCESS');
                            const isFail = tLine.includes('FAILED') || tLine.includes('Error') || tLine.includes('ERROR') || tLine.includes('❌');
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
                          Click "Run Test Bench" below to evaluate your solution against test cases.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column Bottom Sub-Footer (Mirrors Left Column Footer) */}
                  <div className="h-14 shrink-0 px-4 py-3 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex items-center justify-between gap-2 z-20">
                    <button
                      onClick={handleRunTest}
                      disabled={isRunningTest}
                      className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 disabled:opacity-60 cursor-pointer"
                    >
                      {isRunningTest ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Compiling & Testing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Run Test Bench</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {testedQuestions[currentQuestion?.id || ''] ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Passed Benchmark</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Q{selectedQuestionIdx + 1} not tested yet
                        </span>
                      )}
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
