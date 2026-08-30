import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Search, ChevronRight, LayoutGrid, List, Plus, Trash2, X, ShieldAlert } from 'lucide-react';
import { Team } from '../../types';

export const DeanTeamsPage: React.FC = () => {
  const { teams, mentors, setSelectedTeam, addTeam, removeTeam, updateTeam } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'progress' | 'solved' | 'streak' | 'team'>('progress');

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [teamNumberInput, setTeamNumberInput] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmTeam, setDeleteConfirmTeam] = useState<Team | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    const nextNum = teams.length + 1;
    setTeamNumberInput(`Team ${nextNum < 10 ? '0' : ''}${nextNum}`);
    setTeamNameInput('');
    setSelectedMentorId(mentors[0]?.id || '');
    setIsCreateOpen(true);
  };

  // Lock body scroll while modals are open
  React.useEffect(() => {
    if (isCreateOpen || deleteConfirmTeam) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCreateOpen, deleteConfirmTeam]);

  const filteredTeams = teams
    .filter((t) => {
      const matchesSearch =
        t.teamNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return b.avgProgress - a.avgProgress;
      if (sortBy === 'solved') return b.totalSolved - a.totalSolved;
      if (sortBy === 'streak') return b.avgStreak - a.avgStreak;
      return a.teamNumber.localeCompare(b.teamNumber);
    });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTeamNum = teamNumberInput.trim() || `Team ${teams.length + 1 < 10 ? '0' : ''}${teams.length + 1}`;
    const finalTeamName = teamNameInput.trim() || `Cohort ${teams.length + 1}`;

    setIsSubmitting(true);
    try {
      const matchedMentor = mentors.find(m => m.id === selectedMentorId) || mentors[0];
      await addTeam({
        teamNumber: finalTeamNum,
        name: finalTeamName,
        mentorId: matchedMentor?.id,
        mentorName: matchedMentor?.name,
        mentorEmail: matchedMentor?.email,
        mentorDepartment: matchedMentor?.department,
      });
      setIsCreateOpen(false);
      setSuccessMessage(`Cohort "${finalTeamNum} - ${finalTeamName}" created successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setTeamNumberInput('');
      setTeamNameInput('');
      setSelectedMentorId('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create team. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (team: Team) => {
    try {
      await removeTeam(team.id);
      setDeleteConfirmTeam(null);
      setSuccessMessage(`Team ${team.teamNumber} removed.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Success Notification Banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <span>✅ {successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <Layers className="w-4 h-4 shrink-0" />
            <span>Institutional Cohort Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All {teams.length} Teams
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Dean privileged controls: Create, inspect, evaluate, and manage institutional teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </button>


          {/* View mode toggle */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team or mentor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 touch-scroll-x no-scrollbar flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Statuses ({teams.length})</option>
              <option value="Active">Active</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="progress">Average Progress (High to Low)</option>
              <option value="solved">Problems Solved</option>
              <option value="streak">Average Streak</option>
              <option value="team">Team Number</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredTeams.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedTeam(t)}
              className="p-4 sm:p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group gpu-layer relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                      {t.teamNumber}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0">
                      #{t.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={t.status} size="sm" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmTeam(t);
                      }}
                      className="p-1 text-slate-300 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-700">{t.name}</div>
                <div className="flex items-center justify-between gap-1 mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserAvatar name={t.mentorName} role="MENTOR" size="xs" showBadge />
                    <div className="text-[11px] text-slate-600 truncate">
                      Mentor: <strong className="text-slate-800">{t.mentorName}</strong>
                    </div>
                  </div>
                  {teams.filter(tm => tm.mentorName === t.mentorName || tm.mentorId === t.mentorId).length > 1 && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 shrink-0">
                      {teams.filter(tm => tm.mentorName === t.mentorName || tm.mentorId === t.mentorId).length} Teams
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Avg Progress</span>
                    <span className="font-bold text-slate-900">{t.avgProgress}%</span>
                  </div>
                  <ProgressBar
                    percentage={t.avgProgress}
                    height="xs"
                    color={t.avgProgress >= 80 ? 'emerald' : t.avgProgress >= 70 ? 'indigo' : 'amber'}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Solved: <strong className="text-slate-800">{t.totalSolved}</strong></span>
                    <StreakBadge streak={Number((t.avgStreak).toFixed(1))} size="sm" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                <span>View Students</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Team</th>
                  <th className="py-3.5 px-4">Cohort Name</th>
                  <th className="py-3.5 px-4">Faculty Mentor</th>
                  <th className="py-3.5 px-4">Average Progress</th>
                  <th className="py-3.5 px-4">Total Solved</th>
                  <th className="py-3.5 px-4">Avg Streak</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTeams.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTeam(t)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{t.teamNumber}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">#{t.rank}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{t.name}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={t.mentorName} role="MENTOR" size="xs" showBadge />
                        <div>
                          <div className="font-bold">{t.mentorName}</div>
                          <div className="text-[10px] text-slate-400">{t.mentorDepartment}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] text-slate-700 font-bold mb-1">
                          <span>{t.avgProgress}%</span>
                        </div>
                        <ProgressBar
                          percentage={t.avgProgress}
                          height="xs"
                          color={t.avgProgress >= 80 ? 'emerald' : t.avgProgress >= 70 ? 'indigo' : 'amber'}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.totalSolved}</td>
                    <td className="py-3.5 px-4">
                      <StreakBadge streak={Number((t.avgStreak).toFixed(1))} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeam(t);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmTeam(t);
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Team */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Create New Team Cohort</span>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Team Identifier</label>
                  <input
                    type="text"
                    required
                    value={teamNumberInput}
                    onChange={(e) => setTeamNumberInput(e.target.value)}
                    placeholder="e.g. Team 11"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cohort Name</label>
                  <input
                    type="text"
                    required
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="e.g. Logic Knights"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Faculty Mentor</label>
                  <select
                    value={selectedMentorId}
                    onChange={(e) => setSelectedMentorId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                  >
                    <option value="">Select Faculty Mentor...</option>
                    {mentors.map((m) => {
                      const currentAssigned = teams.filter(t => t.mentorId === m.id || t.mentorName === m.name);
                      const assignedStr = currentAssigned.length > 0
                        ? ` (Mentoring: ${currentAssigned.map(t => t.teamNumber).join(', ')} — ${currentAssigned.length} Teams)`
                        : ' (Available)';
                      return (
                        <option key={m.id} value={m.id}>
                          {m.name} — {m.department}{assignedStr}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="pt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Delete Team Confirmation */}
      <AnimatePresence>
        {deleteConfirmTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete {deleteConfirmTeam.teamNumber}?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove <strong>{deleteConfirmTeam.name}</strong>? This action is permanent.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteConfirmTeam(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeam(deleteConfirmTeam)}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
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
