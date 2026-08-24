import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PROBLEMS_BANK, DSA_TOPICS } from '../../data/mockData';
import { DAILY_TOPIC_THEMES, TOTAL_CURRICULUM_DAYS } from '../../data/dsaCurriculum100';
import { Problem } from '../../types';
import { HackerRankArena } from '../../components/coding/HackerRankArena';
import {
  Search,
  Code2,
  Play,
  X,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Terminal,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentProblemsPage: React.FC = () => {
  const { solveProblem, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  const verifiedProblemIds = new Set(currentUser.studentData?.verifiedProblemIds || []);

  const filteredProblems = useMemo(() => {
    return PROBLEMS_BANK.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDay = selectedDay === 'All' || p.dayNumber === selectedDay;
      const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic || p.dayTopic === selectedTopic;
      const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      return matchesSearch && matchesDay && matchesTopic && matchesDifficulty;
    });
  }, [searchQuery, selectedDay, selectedTopic, selectedDifficulty]);

  const verifiedCount = PROBLEMS_BANK.filter((p) => verifiedProblemIds.has(p.id)).length;
  const overallProgressPct = Math.round((verifiedCount / PROBLEMS_BANK.length) * 100);

  // Navigation indices for active problem in IDE
  const currentIdx = activeProblem ? filteredProblems.findIndex(p => p.id === activeProblem.id) : -1;
  const hasNext = currentIdx !== -1 && currentIdx < filteredProblems.length - 1;
  const hasPrev = currentIdx > 0;

  const handleNextProblem = () => {
    if (hasNext) {
      setActiveProblem(filteredProblems[currentIdx + 1]);
    }
  };

  const handlePrevProblem = () => {
    if (hasPrev) {
      setActiveProblem(filteredProblems[currentIdx - 1]);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                <Terminal className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>GKCE Forge IDE &bull; Practice Arena</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>🟢 Easy Practice Test Cases (Beginner Friendly)</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              100 Placement DSA Practice Challenges
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Solve problems in the full split-pane IDE with beginner-friendly easy test cases, live compiler, custom stdin, and step-by-step hints.
            </p>
          </div>

          {/* Student Progress Badge */}
          <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Curriculum Solved</div>
              <div className="text-sm font-extrabold text-slate-900 font-mono">
                {verifiedCount} / {PROBLEMS_BANK.length} <span className="text-xs text-blue-600 font-bold">({overallProgressPct}%)</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs font-mono">
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
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all ${
                selectedDay === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
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
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-[1.02]'
                      : isDayComplete
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span>Day {theme.day}</span>
                  <span className="text-[10px] opacity-80 font-mono">({dayDone}/5)</span>
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

      {/* Problem Cards Grid — 1-col on mobile, 2-col on sm/lg, 3-col on 2xl+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-3.5 md:gap-4">
        {filteredProblems.map((prob) => {
          const isVerified = verifiedProblemIds.has(prob.id);

          return (
            <motion.div
              key={prob.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveProblem(prob)}
              className="p-3.5 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white active:border-blue-300 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              style={{ minHeight: 100 }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">
                      Day {prob.dayNumber} &bull; Q{prob.dayQuestionNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors truncate">
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
                      <span>Solved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Solve in IDE &rarr;</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* HackerRank Fullscreen / Split-Pane IDE Coding Arena            */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {activeProblem && (
          <HackerRankArena
            problem={activeProblem}
            onClose={() => setActiveProblem(null)}
            onSolve={async (prob) => {
              await solveProblem(prob);
            }}
            onNextProblem={handleNextProblem}
            onPrevProblem={handlePrevProblem}
            hasNext={hasNext}
            hasPrev={hasPrev}
            isVerified={verifiedProblemIds.has(activeProblem.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
