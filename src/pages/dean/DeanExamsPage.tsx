import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WeeklyExam, ExamStatus, ExamQuestion } from '../../types';
import { BentoCard } from '../../components/ui/BentoCard';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Award,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  X,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Download,
} from 'lucide-react';

export const DeanExamsPage: React.FC = () => {
  const {
    exams,
    createWeeklyExam,
    updateWeeklyExam,
    deleteWeeklyExam,
    setExamStatus,
    students,
    teams,
  } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExamForResults, setSelectedExamForResults] = useState<WeeklyExam | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [weekNum, setWeekNum] = useState<number>(exams.length + 1);
  const [examTitle, setExamTitle] = useState('');
  const [topicFocus, setTopicFocus] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [durationMins, setDurationMins] = useState<number>(60);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [passMarks, setPassMarks] = useState<number>(50);

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
    ? Math.round(allCompletedSubmissions.reduce((sum, s) => sum + s.score, 0) / allCompletedSubmissions.length)
    : 78;

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    // Standard 5 questions template
    const standardQuestions: ExamQuestion[] = [
      {
        id: `q-${Date.now()}-1`,
        questionNumber: 1,
        title: `${examTitle}: Fundamental Algorithm`,
        topic: 'Arrays',
        difficulty: 'Easy',
        marks: 20,
        description: 'Implement an optimal solution satisfying edge constraints.',
      },
      {
        id: `q-${Date.now()}-2`,
        questionNumber: 2,
        title: `${examTitle}: Array & Two Pointer Traversal`,
        topic: 'Arrays',
        difficulty: 'Easy',
        marks: 20,
        description: 'Traverse and optimize sequence processing in O(N) time.',
      },
      {
        id: `q-${Date.now()}-3`,
        questionNumber: 3,
        title: `${examTitle}: Frequency & Boundary Search`,
        topic: 'Arrays',
        difficulty: 'Medium',
        marks: 20,
        description: 'Find required target elements in sorted/unsorted series.',
      },
      {
        id: `q-${Date.now()}-4`,
        questionNumber: 4,
        title: `${examTitle}: Sliding Window / Subarray Sum`,
        topic: 'Arrays',
        difficulty: 'Medium',
        marks: 20,
        description: 'Evaluate maximum or minimum sub-segment optimal bounds.',
      },
      {
        id: `q-${Date.now()}-5`,
        questionNumber: 5,
        title: `${examTitle}: Advanced Data Pattern Challenge`,
        topic: 'Arrays',
        difficulty: 'Medium',
        marks: 20,
        description: 'High-yield placement interview challenge with complex constraints.',
      },
    ];

    await createWeeklyExam({
      weekNumber: Number(weekNum),
      title: examTitle.trim(),
      topicFocus: topicFocus.trim() || 'DSA Placement Curriculum',
      description: examDesc.trim() || 'Standardized weekly coding examination scheduled by Dean of Academic Affairs.',
      scheduledDate,
      startTime,
      durationMinutes: Number(durationMins),
      totalMarks: Number(totalMarks),
      passMarks: Number(passMarks),
      status: 'SCHEDULED',
      questions: standardQuestions,
    });

    setIsCreateModalOpen(false);
    setExamTitle('');
    setTopicFocus('');
    setExamDesc('');
  };

  const handleExportCSV = (exam: WeeklyExam) => {
    const subs = exam.submissions || [];
    const headers = 'Student Name,Roll No,Team Number,Status,Score,Total Marks,Questions Solved,Time Spent (mins)\n';
    const rows = subs.map(s => `"${s.studentName}","${s.studentRollNo}","${s.teamNumber}","${s.status}",${s.score},${s.totalMarks},${s.questionsSolved},${s.timeSpentMinutes || 45}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GKCE_DSA_Exam_Week_${exam.weekNumber}_Results.csv`;
    link.click();
  };

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
            Institutional scheduling, live proctoring status, and cohort score governance across all 20 teams.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setWeekNum(exams.length + 1);
              setExamTitle(`Week ${exams.length + 1} Assessment: `);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Weekly Exam</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Weekly Exams</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalExamsCount} Weeks</div>
          <div className="text-xs text-slate-500 mt-1">Syllabus timeline</div>
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
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">{avgScore} / 100</div>
          <div className="text-xs text-blue-600 font-semibold mt-1">Institutional baseline</div>
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
          const isCompleted = exam.status === 'COMPLETED';
          const submissionCount = exam.submissions?.length || 0;

          return (
            <motion.div
              key={exam.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Header: Week Badge & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono font-extrabold border border-blue-100">
                      WEEK {exam.weekNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{exam.topicFocus}</span>
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
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Questions</div>
                    <div className="font-semibold text-slate-800">{exam.questions?.length || 5} Problems</div>
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

      {/* Create New Weekly Exam Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Dean Scheduling Desk</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Schedule New Weekly DSA Exam</h2>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateExam} className="space-y-3.5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Week #</label>
                    <input
                      type="number"
                      value={weekNum}
                      onChange={e => setWeekNum(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
                      min={1}
                      max={52}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Exam Title</label>
                    <input
                      type="text"
                      value={examTitle}
                      onChange={e => setExamTitle(e.target.value)}
                      placeholder="e.g. Week 05: Dynamic Programming Fundamentals"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic Focus</label>
                  <input
                    type="text"
                    value={topicFocus}
                    onChange={e => setTopicFocus(e.target.value)}
                    placeholder="e.g. Recursion, Memoization & 1D DP"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={e => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      placeholder="10:00 AM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Min)</label>
                    <input
                      type="number"
                      value={durationMins}
                      onChange={e => setDurationMins(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                      min={15}
                      max={180}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={e => setTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                      min={10}
                      max={500}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exam Description</label>
                  <textarea
                    value={examDesc}
                    onChange={e => setExamDesc(e.target.value)}
                    rows={2}
                    placeholder="Instructions and curriculum coverage for students..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>5 standardized placement coding questions will be auto-generated and assigned.</span>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                  >
                    Schedule Exam
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exam Results & Score Leaderboard Modal */}
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
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    WEEK {selectedExamForResults.weekNumber} RESULTS
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedExamForResults.title}
                  </h2>
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
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                {sub.score} / {sub.totalMarks}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono">{sub.questionsSolved} / 5</td>
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
