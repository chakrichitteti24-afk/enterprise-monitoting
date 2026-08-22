import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PROBLEMS_BANK, DSA_TOPICS } from '../../data/mockData';
import { DAILY_TOPIC_THEMES, TOTAL_CURRICULUM_DAYS } from '../../data/dsaCurriculum100';
import { Problem } from '../../types';
import { Search, Code2, Play, X, CheckCircle2, Circle, ShieldCheck, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentProblemsPage: React.FC = () => {
  const { solveProblem, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);

  const verifiedProblemIds = new Set(currentUser.studentData?.verifiedProblemIds || []);

  const filteredProblems = PROBLEMS_BANK.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDay === 'All' || p.dayNumber === selectedDay;
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDay && matchesTopic && matchesDifficulty;
  });

  const verifiedCount = PROBLEMS_BANK.filter((p) => verifiedProblemIds.has(p.id)).length;
  const overallProgressPct = Math.round((verifiedCount / PROBLEMS_BANK.length) * 100);

  // Lock background body scroll while problem modal is open
  React.useEffect(() => {
    if (activeProblem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeProblem]);

  const handleRunCode = async () => {
    if (!activeProblem) return;
    setCodeOutput(
      `Running automated test suite for "${activeProblem.title}" (${activeProblem.topic} - ${activeProblem.difficulty})...\n` +
      `Test Case 1: Standard input validation... [PASSED] (18ms)\n` +
      `Test Case 2: Edge cases and constraints check... [PASSED] (22ms)\n` +
      `Test Case 3: Algorithmic complexity evaluation... [PASSED] (14ms)\n\n` +
      `✅ All test cases passed! (3/3)\n` +
      `Runtime: 54ms | Memory: 41.8 MB | Status: COMPILED & SUBMITTED\n` +
      `ℹ️ Note: Official curriculum completion tick is verified directly by your Faculty Mentor (${currentUser.studentData?.mentorName || 'Faculty Mentor'}).`
    );
    await solveProblem(activeProblem);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1.5 border border-blue-100">
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>DSA Level 1 — 100 Placement Coding Problems</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Curriculum Problem Bank (20 Days &times; 5 Problems/Day)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Your personalized curriculum progress. Completions are verified and signed off by your assigned Faculty Mentor.
            </p>
          </div>

          {/* Student Progress Badge */}
          <div className="bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Mentor Verified</div>
              <div className="text-sm font-extrabold text-slate-900 font-mono">
                {verifiedCount} / {PROBLEMS_BANK.length} <span className="text-xs text-blue-600 font-bold">({overallProgressPct}%)</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {overallProgressPct}%
            </div>
          </div>
        </div>

        {/* Day Selector Tabs (1 - 20) */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter by Curriculum Day (5 Problems Each):</span>
            </span>
            <button
              onClick={() => setSelectedDay('All')}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                selectedDay === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              View All 100
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
            {DAILY_TOPIC_THEMES.map((theme) => {
              const isSelected = selectedDay === theme.day;
              const dayProbs = PROBLEMS_BANK.filter((p) => p.dayNumber === theme.day);
              const dayDone = dayProbs.filter((p) => verifiedProblemIds.has(p.id)).length;
              const isDayComplete = dayDone === dayProbs.length && dayProbs.length > 0;

              return (
                <button
                  key={theme.day}
                  onClick={() => setSelectedDay(theme.day)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border select-none ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : isDayComplete
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span>Day {theme.day}</span>
                  <span className="text-[10px] opacity-80">({dayDone}/5)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Topic/Difficulty Filter Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100 placement problems by title or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden shrink-0 font-medium"
            >
              <option value="All">All Topics ({DSA_TOPICS.length})</option>
              {DSA_TOPICS.map((top) => (
                <option key={top} value={top}>{top}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden shrink-0 font-medium"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredProblems.map((prob) => {
          const isVerified = verifiedProblemIds.has(prob.id);

          return (
            <motion.div
              key={prob.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                setActiveProblem(prob);
                setCodeOutput(null);
              }}
              className="p-4 sm:p-5 rounded-3xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">
                      Day {prob.dayNumber} &bull; Q{prob.dayQuestionNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors truncate">
                      {prob.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-800 border border-rose-200/60'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {prob.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 text-[11px]">
                  {prob.topic}
                </span>

                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified by Mentor</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 text-slate-500 text-[11px] font-medium border border-slate-200">
                      <Circle className="w-3 h-3 text-slate-300" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Problem Modal Simulator */}
      <AnimatePresence>
        {activeProblem && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setActiveProblem(null)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setActiveProblem(null);
                }
              }}
              className="relative w-full max-w-2xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-6 z-10 space-y-4 max-h-[88vh] sm:max-h-[90vh] overflow-y-auto gpu-layer overscroll-contain"
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden -mt-1 pb-1 flex justify-center cursor-grab">
                <div className="w-12 h-1.5 rounded-full bg-slate-300" />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                      Day {activeProblem.dayNumber} &bull; Q{activeProblem.dayQuestionNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{activeProblem.topic}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 truncate">{activeProblem.title}</h2>
                  <div className="text-xs text-slate-500 mt-0.5">Difficulty: <strong>{activeProblem.difficulty}</strong></div>
                </div>
                <button
                  onClick={() => setActiveProblem(null)}
                  className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                <div className="font-bold text-slate-900 mb-1">Problem Statement:</div>
                {activeProblem.description}
                {activeProblem.url && (
                  <div className="mt-2">
                    <a
                      href={activeProblem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-700 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Practice on GeeksforGeeks / LeetCode &rarr;</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Code editor mock */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 p-4 font-mono text-xs space-y-2">
                <div className="text-slate-500 text-[11px]">// Java / C++ Solution Template</div>
                <div className="text-blue-400">class Solution &#123;</div>
                <div className="pl-4 text-emerald-400">public void {activeProblem.title.toLowerCase().replace(/[^a-z0-9]/g, '')}() &#123;</div>
                <div className="pl-8 text-slate-400">// Your optimal O(N) solution here</div>
                <div className="pl-4 text-emerald-400">&#125;</div>
                <div className="text-blue-400">&#125;</div>
              </div>

              {codeOutput && (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-line border border-slate-800">
                  {codeOutput}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Mentor Verified System</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveProblem(null)}
                    className="px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRunCode}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Test & Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

