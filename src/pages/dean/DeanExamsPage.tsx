import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WeeklyExam, ExamQuestion, Problem } from '../../types';
import { PROBLEMS_BANK_100 } from '../../data/dsaCurriculum100';
import { convertProblemToExamQuestion, getExamTier } from '../../data/mockExams';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Play,
  CheckCircle2,
  Users,
  ShieldCheck,
  X,
  Trash2,
  Search,
  CheckSquare,
  Square,
  Eye,
  Shuffle,
  Download,
} from 'lucide-react';

export const DeanExamsPage: React.FC = () => {
  const {
    exams,
    createWeeklyExam,
    deleteWeeklyExam,
    setExamStatus,
  } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExamForResults, setSelectedExamForResults] = useState<WeeklyExam | null>(null);
  const [inspectQuestionsExam, setInspectQuestionsExam] = useState<WeeklyExam | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Exam Form State
  const [weekNum, setWeekNum] = useState<number>(exams.length + 1);
  const [examTitle, setExamTitle] = useState('');
  const [topicFocus, setTopicFocus] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [durationMins, setDurationMins] = useState<number>(90);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [passMarks, setPassMarks] = useState<number>(50);

  // Selected Problem IDs for the new exam (chosen from 100 questions bank)
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>(() => {
    return PROBLEMS_BANK_100.slice(0, 20).map(p => p.id);
  });

  // Problem Bank Filtering within the Modal
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [dayFilter, setDayFilter] = useState<string>('ALL');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Lock body scroll while modals are open
  React.useEffect(() => {
    if (isCreateModalOpen || selectedExamForResults || inspectQuestionsExam || deleteConfirmId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCreateModalOpen, selectedExamForResults, inspectQuestionsExam, deleteConfirmId]);

  const currentTierInfo = useMemo(() => getExamTier(weekNum), [weekNum]);

  const filteredExams = exams.filter(ex => {
    if (selectedFilter === 'ALL') return true;
    return ex.status === selectedFilter;
  });

  const totalExamsCount = exams.length;
  const liveExamsCount = exams.filter(e => e.status === 'LIVE').length;
  const completedExamsCount = exams.filter(e => e.status === 'COMPLETED').length;

  // Aggregate student score across completed exams
  const completedExams = exams.filter(e => e.status === 'COMPLETED' && e.submissions && e.submissions.length > 0);
  const allCompletedSubmissions = completedExams.flatMap(e => e.submissions || []);
  const avgScore = allCompletedSubmissions.length > 0
    ? Number((allCompletedSubmissions.reduce((sum, s) => sum + s.score, 0) / allCompletedSubmissions.length).toFixed(1))
    : 0;

  // Filter 100 Questions in the modal
  const filteredProblemsBank = useMemo(() => {
    return PROBLEMS_BANK_100.filter(prob => {
      if (showSelectedOnly && !selectedProblemIds.includes(prob.id)) return false;
      if (topicFilter !== 'ALL' && prob.topic !== topicFilter && prob.dayTopic !== topicFilter) return false;
      if (difficultyFilter !== 'ALL' && prob.difficulty !== difficultyFilter) return false;
      if (dayFilter !== 'ALL' && String(prob.dayNumber) !== dayFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prob.title.toLowerCase().includes(q);
        const matchDesc = prob.description.toLowerCase().includes(q);
        const matchDay = `day ${prob.dayNumber}`.includes(q);
        const matchTopic = (prob.dayTopic || prob.topic).toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchDay && !matchTopic) return false;
      }
      return true;
    });
  }, [showSelectedOnly, selectedProblemIds, topicFilter, difficultyFilter, dayFilter, searchQuery]);

  // Quick preset selections matching Root 20 & 3-tier difficulty model
  const handleSelectPreset = (preset: 'ROOT_20_STANDARDIZED' | 'TIER1_EASY' | 'TIER2_MEDIUM' | 'TIER3_HARD' | 'CURATED_20' | 'CLEAR') => {
    if (preset === 'CLEAR') {
      setSelectedProblemIds([]);
      return;
    }
    if (preset === 'ROOT_20_STANDARDIZED') {
      const rootIds = ['1', '6', '7', '10', '21', '22', '26', '31', '34', '36', '40', '41', '46', '47', '52', '61', '62', '71', '81', '91'];
      setSelectedProblemIds(rootIds);
      setTopicFocus('Root Official 20 Standardized DSA Challenges');
      setDurationMins(90);
      return;
    }
    if (preset === 'TIER1_EASY') {
      const easy = PROBLEMS_BANK_100.filter(p => p.difficulty === 'Easy').slice(0, 20);
      setSelectedProblemIds(easy.map(p => p.id));
      setTopicFocus('Tier 1: Easy Math & Loop Foundations (Weeks 1–3)');
      setDurationMins(90);
      return;
    }
    if (preset === 'TIER2_MEDIUM') {
      const med = PROBLEMS_BANK_100.filter(p => p.difficulty === 'Medium').slice(0, 20);
      setSelectedProblemIds(med.map(p => p.id));
      setTopicFocus('Tier 2: Medium Subarrays, Strings & Linear DS (Weeks 4–6)');
      setDurationMins(90);
      return;
    }
    if (preset === 'TIER3_HARD') {
      const hard = PROBLEMS_BANK_100.filter(p => p.difficulty === 'Hard' || p.topic === 'Hashing' || p.topic === 'Two Pointers').slice(0, 20);
      setSelectedProblemIds(hard.map(p => p.id));
      setTopicFocus('Tier 3: Hard Trees, Graphs & Dynamic Programming (Weeks 7+)');
      setDurationMins(120);
      return;
    }
    if (preset === 'CURATED_20') {
      const easy = PROBLEMS_BANK_100.filter(p => p.difficulty === 'Easy').slice(0, 8);
      const med = PROBLEMS_BANK_100.filter(p => p.difficulty === 'Medium').slice(0, 8);
      const hard = PROBLEMS_BANK_100.filter(p => p.difficulty === 'Hard').slice(0, 4);
      setSelectedProblemIds([...easy, ...med, ...hard].map(p => p.id));
      setTopicFocus('Comprehensive 20-Problem Mix');
      return;
    }
  };

  const toggleProblemSelection = (id: string) => {
    setSelectedProblemIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;
    if (selectedProblemIds.length === 0) {
      alert('Please select at least 1 question for the examination from the 100 problems bank.');
      return;
    }

    const marksPerQuestion = Math.max(1, Number((totalMarks / selectedProblemIds.length).toFixed(1)));

    // Convert selected problem IDs from the 100 curriculum bank into ExamQuestion objects with week-tier test cases
    const selectedProblems = selectedProblemIds
      .map(id => PROBLEMS_BANK_100.find(p => p.id === id))
      .filter((p): p is Problem => p !== undefined);

    const generatedExamQuestions: ExamQuestion[] = selectedProblems.map((prob, idx) =>
      convertProblemToExamQuestion(prob, idx + 1, marksPerQuestion, Number(weekNum))
    );

    await createWeeklyExam({
      weekNumber: Number(weekNum),
      tier: currentTierInfo.tier,
      tierBadge: currentTierInfo.tierBadge,
      title: examTitle.trim(),
      topicFocus: topicFocus.trim() || `${selectedProblemIds.length} Curriculum Problems (${currentTierInfo.tier} Tier)`,
      description: examDesc.trim() || `Official weekly examination (${currentTierInfo.tier} Tier) consisting of ${selectedProblemIds.length} selected DSA questions with dynamic anti-cheating shuffling.`,
      scheduledDate,
      startTime,
      durationMinutes: Number(durationMins),
      totalMarks: Number(totalMarks),
      passMarks: Number(passMarks),
      status: 'SCHEDULED',
      questions: generatedExamQuestions,
    });

    setIsCreateModalOpen(false);
    setExamTitle('');
    setTopicFocus('');
    setExamDesc('');
  };

  const handleExportCSV = (exam: WeeklyExam) => {
    const subs = exam.submissions || [];
    const totalQ = exam.questions?.length || 20;
    const tier = exam.tier || getExamTier(exam.weekNumber).tier;
    const headers = 'Rank,Student Name,Roll No,Team Number,Tier,Randomized Set Code,Status,Score,Total Marks,Questions Solved,Total Questions,Time Spent (mins)\n';
    const rows = subs
      .sort((a, b) => b.score - a.score)
      .map((s, idx) => `"#${idx + 1}","${s.studentName}","${s.studentRollNo}","${s.teamNumber}","${tier}","${s.randomizedSetCode || 'SET-A'}","${s.status}",${s.score},${s.totalMarks},${s.questionsSolved},${totalQ},${s.timeSpentMinutes || 45}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GKCE_DSA_Exam_Week_${exam.weekNumber}_${tier}_Tier_Report.csv`;
    link.click();
  };

  const allTopics = Array.from(new Set(PROBLEMS_BANK_100.map(p => p.dayTopic || p.topic)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1.5 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Dean / Root Exclusive Authority</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Weekly DSA Examinations Control Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Progressive 3-Tier Exam Architecture &bull; <strong className="text-emerald-700">Weeks 1–3: Easy</strong> &bull; <strong className="text-amber-700">Weeks 4–6: Medium</strong> &bull; <strong className="text-rose-700">Weeks 7+: Hard</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              const nextWeek = exams.length + 1;
              const nextTier = getExamTier(nextWeek);
              setWeekNum(nextWeek);
              setExamTitle(`Week ${String(nextWeek).padStart(2, '0')} Assessment (${nextTier.tier} Tier)`);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam (From 100 Bank)</span>
          </button>
        </div>
      </div>

      {/* 3-Tier Difficulty Progression Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase font-mono">
              Weeks 1–3
            </span>
            <span className="text-xs font-extrabold text-emerald-700">🟢 Tier 1: Easy</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Foundational Logic & Basic Math</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Elementary positive inputs, small arrays (N ≤ 100), basic loop checks, and straightforward single-pass algorithms.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase font-mono">
              Weeks 4–6
            </span>
            <span className="text-xs font-extrabold text-amber-700">🟡 Tier 2: Medium</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Subarrays, Strings & Linear DS</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Intermediate test cases: negative numbers, duplicate values, two pointers, sliding window, and monotonic stacks.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50 to-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase font-mono">
              Weeks 7+
            </span>
            <span className="text-xs font-extrabold text-rose-700">🔴 Tier 3: Hard</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Trees, Graphs & 2D DP</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tier-1 product benchmark cases: deep tree recursions, cyclic graphs, 2D DP matrices, and 10⁵ constraint stress vectors.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Weekly Exams</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalExamsCount} Weeks</div>
          <div className="text-xs text-slate-500 mt-1">3 Progressive Tiers</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Live Exams</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 flex items-center gap-2">
            <span>{liveExamsCount}</span>
            {liveExamsCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">Currently open for students</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Exam Score</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
            {allCompletedSubmissions.length > 0 ? `${avgScore} / 100` : 'N/A'}
          </div>
          <div className="text-xs text-blue-600 font-semibold mt-1">
            {allCompletedSubmissions.length > 0 ? 'Across completed exams' : 'No evaluations yet'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Assessments</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-1">{completedExamsCount}</div>
          <div className="text-xs text-slate-500 mt-1">Evaluated & archived</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(
          [
            { id: 'ALL', label: `All Exams (${exams.length})` },
            { id: 'LIVE', label: `⚡ Live Now (${liveExamsCount})` },
            { id: 'SCHEDULED', label: `📅 Scheduled (${exams.filter(e => e.status === 'SCHEDULED').length})` },
            { id: 'COMPLETED', label: `✅ Completed (${completedExamsCount})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Weekly Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => {
          const isLive = exam.status === 'LIVE';
          const isScheduled = exam.status === 'SCHEDULED';
          const submissionCount = exam.submissions?.length || 0;
          const questionCount = exam.questions?.length || 20;
          const tierInfo = getExamTier(exam.weekNumber);

          return (
            <motion.div
              key={exam.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Header: Week Badge, Tier Badge & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono font-extrabold border border-blue-100">
                      WEEK {String(exam.weekNumber).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        tierInfo.tier === 'EASY'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : tierInfo.tier === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {tierInfo.tier} TIER
                    </span>
                    <span className="text-xs text-slate-500 font-semibold truncate max-w-[180px]">{exam.topicFocus}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                      isLive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-pulse'
                        : isScheduled
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isLive && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Date</div>
                    <div className="font-semibold text-slate-800 truncate">{exam.scheduledDate}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                    <div className="font-semibold text-slate-800">{exam.durationMinutes} Mins</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Questions Pool</div>
                    <div className="font-bold text-blue-700">{questionCount} Qs</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Total Marks</div>
                    <div className="font-semibold text-slate-800">{exam.totalMarks} Marks</div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar (Root Privileges) */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong>{submissionCount}</strong> submissions
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Toggles */}
                  {isScheduled && (
                    <button
                      onClick={() => setExamStatus(exam.id, 'LIVE')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Make LIVE</span>
                    </button>
                  )}

                  {isLive && (
                    <button
                      onClick={() => setExamStatus(exam.id, 'COMPLETED')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>End / Complete</span>
                    </button>
                  )}

                  {/* Inspect Questions Button */}
                  <button
                    onClick={() => setInspectQuestionsExam(exam)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View {questionCount} Qs</span>
                  </button>

                  {/* View Results Button */}
                  <button
                    onClick={() => setSelectedExamForResults(exam)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Results ({submissionCount})
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(exam.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Root / Dean 100-Problem Exam Builder Modal                    */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Dean / Root Institutional Exam Builder</span>
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        currentTierInfo.tier === 'EASY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentTierInfo.tier === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {currentTierInfo.tierBadge}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Schedule Weekly Exam from 100 DSA Curriculum Bank
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentTierInfo.description}
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form & Question Selector Scrollable Body */}
              <form onSubmit={handleCreateExam} className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Basic Exam Metadata */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>1. Examination Specifications</span>
                    <span className="text-[11px] font-bold text-blue-700 font-mono">
                      Week {weekNum} &bull; {currentTierInfo.tier} Tier Test Bench
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Week #</label>
                      <input
                        type="number"
                        value={weekNum}
                        onChange={e => setWeekNum(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                        min={1}
                        max={52}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Exam Title</label>
                      <input
                        type="text"
                        value={examTitle}
                        onChange={e => setExamTitle(e.target.value)}
                        placeholder="e.g. Week 04 Assessment: Two Pointers & Subarrays (Medium Tier)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Topic Focus</label>
                      <input
                        type="text"
                        value={topicFocus}
                        onChange={e => setTopicFocus(e.target.value)}
                        placeholder="e.g. Array Fundamentals, Two Pointers & Subarrays"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Date & Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={e => setScheduledDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          required
                        />
                        <input
                          type="text"
                          value={startTime}
                          onChange={e => setStartTime(e.target.value)}
                          placeholder="10:00 AM"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration (Mins)</label>
                      <input
                        type="number"
                        value={durationMins}
                        onChange={e => setDurationMins(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        min={15}
                        max={240}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Marks</label>
                      <input
                        type="number"
                        value={totalMarks}
                        onChange={e => setTotalMarks(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        min={10}
                        max={500}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Pass Marks</label>
                      <input
                        type="number"
                        value={passMarks}
                        onChange={e => setPassMarks(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        min={1}
                        max={500}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Question Selection Section with 3-Tier Presets */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span>2. Select Questions from 100 Curriculum Bank</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[11px] font-bold">
                          {selectedProblemIds.length} Selected ({selectedProblemIds.length > 0 ? Number((totalMarks / selectedProblemIds.length).toFixed(1)) : 0} pts/ea)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Test cases will automatically apply <strong className="text-blue-700">{currentTierInfo.tier} tier benchmarks</strong> for Week {weekNum}.
                      </p>
                    </div>

                    {/* Quick Selection Tier Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleSelectPreset('ROOT_20_STANDARDIZED')}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-bold shadow-xs transition-colors"
                      >
                        ⚡ Root Curated 20
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset('TIER1_EASY')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 transition-colors"
                      >
                        🟢 Weeks 1–3 (Easy)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset('TIER2_MEDIUM')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold border border-amber-200 transition-colors"
                      >
                        🟡 Weeks 4–6 (Medium)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset('TIER3_HARD')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 text-[11px] font-bold border border-rose-200 transition-colors"
                      >
                        🔴 Weeks 7+ (Hard)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset('CLEAR')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px] font-bold transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Filter Toolbar within Modal */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                    <div className="relative col-span-1 sm:col-span-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search 100 questions..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <select
                        value={topicFilter}
                        onChange={e => setTopicFilter(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="ALL">All Topics (100 Qs)</option>
                        {allTopics.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        value={dayFilter}
                        onChange={e => setDayFilter(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="ALL">All Days (1-20)</option>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={String(d)}>Day {d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={difficultyFilter}
                        onChange={e => setDifficultyFilter(e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="ALL">All Diff</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setShowSelectedOnly(prev => !prev)}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                          showSelectedOnly ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {showSelectedOnly ? 'Selected' : 'All'}
                      </button>
                    </div>
                  </div>

                  {/* Questions Checklist Grid */}
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white">
                    {filteredProblemsBank.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No questions match the current filters.
                      </div>
                    ) : (
                      filteredProblemsBank.map((prob) => {
                        const isChecked = selectedProblemIds.includes(prob.id);
                        return (
                          <div
                            key={prob.id}
                            onClick={() => toggleProblemSelection(prob.id)}
                            className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer select-none transition-colors ${
                              isChecked ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-blue-600 shrink-0">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-bold text-slate-400">
                                    Day {prob.dayNumber} &bull; #{prob.dayQuestionNumber}
                                  </span>
                                  <span className="font-bold text-slate-900">{prob.title}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                  {prob.description}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                {prob.dayTopic || prob.topic}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  prob.difficulty === 'Easy'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : prob.difficulty === 'Medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {prob.difficulty}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 shrink-0">
                  <div className="text-xs text-slate-600 font-semibold">
                    Total: <strong className="text-blue-700">{selectedProblemIds.length} Questions</strong> ({totalMarks} Marks &bull; {currentTierInfo.tier} Tier)
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={selectedProblemIds.length === 0}
                      className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      Schedule Exam ({selectedProblemIds.length} Qs &bull; {currentTierInfo.tier})
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inspect Chosen Exam Questions Modal */}
      <AnimatePresence>
        {inspectQuestionsExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectQuestionsExam(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      WEEK {inspectQuestionsExam.weekNumber} QUESTION MATRIX
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {inspectQuestionsExam.tier || getExamTier(inspectQuestionsExam.weekNumber).tier} TIER
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {inspectQuestionsExam.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {inspectQuestionsExam.questions?.length || 20} Questions Selected &bull; Total {inspectQuestionsExam.totalMarks} Marks ({inspectQuestionsExam.durationMinutes} Mins)
                  </p>
                </div>

                <button
                  onClick={() => setInspectQuestionsExam(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Anti-Cheating Note */}
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2.5">
                <Shuffle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Anti-Cheating Randomization:</strong> When any student takes this exam, these questions are scrambled in a distinct sequence using their student ID salt hash.
                </span>
              </div>

              {/* Questions List */}
              <div className="overflow-y-auto flex-1 border border-slate-100 rounded-2xl divide-y divide-slate-100">
                {(inspectQuestionsExam.questions || []).map((q, idx) => (
                  <div key={q.id} className="p-3.5 hover:bg-slate-50/80 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900">{q.title}</div>
                        <div className="text-slate-500 text-[11px] line-clamp-2">{q.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {q.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {q.marks} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exam Results Modal */}
      <AnimatePresence>
        {selectedExamForResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExamForResults(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    WEEK {String(selectedExamForResults.weekNumber).padStart(2, '0')} RESULTS ({selectedExamForResults.tier || getExamTier(selectedExamForResults.weekNumber).tier} TIER)
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedExamForResults.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedExamForResults.submissions?.length || 0} Submissions Evaluated &bull; {selectedExamForResults.questions?.length || 20} Questions Total
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCSV(selectedExamForResults)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setSelectedExamForResults(null)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="overflow-y-auto flex-1 border border-slate-100 rounded-2xl">
                {(selectedExamForResults.submissions || []).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No submissions recorded yet for this exam.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-4">Rank & Student</th>
                        <th className="py-2.5 px-3">Roll No</th>
                        <th className="py-2.5 px-3">Team</th>
                        <th className="py-2.5 px-3 text-center">Randomized Set</th>
                        <th className="py-2.5 px-3 text-center">Score</th>
                        <th className="py-2.5 px-3 text-center">Solved</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...(selectedExamForResults.submissions || [])]
                        .sort((a, b) => b.score - a.score)
                        .map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                              <span className={`w-5 text-center font-bold font-mono text-[11px] ${idx === 0 ? 'text-amber-600' : idx === 1 ? 'text-slate-500' : idx === 2 ? 'text-amber-800' : 'text-slate-400'}`}>
                                #{idx + 1}
                              </span>
                              <span>{sub.studentName}</span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{sub.studentRollNo}</td>
                            <td className="py-2.5 px-3 text-slate-600 font-semibold">{sub.teamNumber}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[11px] font-bold text-indigo-700">
                              <span className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                {sub.randomizedSetCode || 'SET-A'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                {sub.score} / {sub.totalMarks}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-semibold">
                              {sub.questionsSolved} / {sub.totalQuestionCount || selectedExamForResults.questions?.length || 20}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-5 z-10 space-y-4 shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Weekly Exam?</h3>
                <p className="text-xs text-slate-500 mt-1">This will permanently remove the exam and student submission history.</p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteWeeklyExam(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
