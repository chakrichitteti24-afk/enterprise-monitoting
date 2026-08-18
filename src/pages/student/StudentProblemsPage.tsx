import React, { useState } from 'react';
import { PROBLEMS_BANK, DSA_TOPICS } from '../../data/mockData';
import { Problem } from '../../types';
import { Search, Code2, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentProblemsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);

  const filteredProblems = PROBLEMS_BANK.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const handleRunCode = () => {
    setCodeOutput('Running test cases...\nTest Case 1: [2, 7, 11, 15], target = 9 -> Output: [0, 1] (PASSED)\nTest Case 2: [3, 2, 4], target = 6 -> Output: [1, 2] (PASSED)\n\nAll test cases passed! Runtime: 52ms | Memory: 42.1MB');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
          <Code2 className="w-4 h-4 shrink-0" />
          <span>Curriculum Practice Problems</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">DSA Problems Bank</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Standardized interview & coursework coding challenges with live automated test-bench.
        </p>

        {/* Filter Bar */}
        <div className="mt-4 sm:mt-5 flex flex-col md:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by name or concept..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Topics ({DSA_TOPICS.length})</option>
              {DSA_TOPICS.map((top) => (
                <option key={top} value={top}>{top}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredProblems.map((prob, idx) => (
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
                  <span className="text-xs font-mono text-slate-400 shrink-0">#{idx + 1}</span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors truncate">
                    {prob.title}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
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
              <div className="flex items-center gap-3">
                <span className="text-[11px]">Acceptance: <strong>{prob.acceptanceRate}</strong></span>
                <span className="font-bold text-blue-700 hover:underline">Solve →</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Problem Modal Simulator */}
      <AnimatePresence>
        {activeProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setActiveProblem(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                    {activeProblem.topic}
                  </span>
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
              </div>

              {/* Code editor mock */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 p-4 font-mono text-xs space-y-2">
                <div className="text-slate-500 text-[11px]">// Java / C++ Solution Template</div>
                <div className="text-blue-400">class Solution &#123;</div>
                <div className="pl-4 text-emerald-400">public int[] {activeProblem.title.toLowerCase().replace(/[^a-z0-9]/g, '')}(int[] nums, int target) &#123;</div>
                <div className="pl-8 text-slate-400">// Your optimal O(N) solution here</div>
                <div className="pl-8 text-indigo-300">Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();</div>
                <div className="pl-8 text-slate-300">return new int[]&#123;0, 1&#125;;</div>
                <div className="pl-4 text-emerald-400">&#125;</div>
                <div className="text-blue-400">&#125;</div>
              </div>

              {codeOutput && (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-line border border-slate-800">
                  {codeOutput}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">GKCE Sandbox Runner</span>
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
                    Run & Submit
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
