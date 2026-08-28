import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { UserAvatar } from '../../components/ui/UserAvatar';
import {
  Users,
  Search,
  ChevronRight,
  UserPlus,
  Trash2,
  X,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Key,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, DSALevel, StudentStatus } from '../../types';

export const MentorStudentsPage: React.FC = () => {
  const { currentUser, students, teams, setSelectedStudent, addStudent, removeStudent } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('ALL');

  // Identify ALL assigned teams for this mentor
  const myTeams = teams.filter(
    (t) =>
      t.mentorId === currentUser.id ||
      t.mentorEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      t.mentorName?.toLowerCase() === currentUser.name?.toLowerCase() ||
      t.teamNumber === currentUser.teamNumber ||
      t.id === currentUser.teamId
  );
  const activeTeams = myTeams.length > 0 ? myTeams : (teams.filter(t => t.teamNumber === 'Team 07') || [teams[0]]);

  // Modal State for Enrollment & Deletion
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedTeamForEnroll, setSelectedTeamForEnroll] = useState<string>(activeTeams[0]?.teamNumber || 'Team 07');
  const [dsaLevelInput, setDsaLevelInput] = useState<DSALevel>('Beginner');
  const [statusInput, setStatusInput] = useState<StudentStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    rollNo: string;
    email: string;
    password: string;
    teamNumber: string;
  } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Strictly filter to all assigned teams
  const allMyStudents = students.filter(s =>
    activeTeams.some(t => t.id === s.teamId || t.teamNumber === s.teamNumber)
  );

  const teamStudents = selectedTeamFilter === 'ALL'
    ? allMyStudents
    : allMyStudents.filter(s => s.teamId === selectedTeamFilter || s.teamNumber === selectedTeamFilter);

  const filtered = teamStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Lock background body scroll while modals are open
  useEffect(() => {
    if (isEnrollOpen || deleteConfirmStudent || createdCredentials) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEnrollOpen, deleteConfirmStudent, createdCredentials]);

  const openEnrollModal = () => {
    const nextRoll = 100 + allMyStudents.length + 1;
    setRollInput(`24F81A05${nextRoll < 1000 ? nextRoll : Math.floor(100 + Math.random() * 899)}`);
    setNameInput('');
    setEmailInput('');
    setSelectedTeamForEnroll(activeTeams[0]?.teamNumber || 'Team 07');
    setDsaLevelInput('Beginner');
    setStatusInput('Active');
    setIsEnrollOpen(true);
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !rollInput.trim()) return;

    setIsSubmitting(true);
    try {
      const studentRoll = rollInput.trim().toUpperCase();
      const studentName = nameInput.trim();
      const targetTeam = selectedTeamForEnroll || activeTeams[0]?.teamNumber || 'Team 07';
      const cleanEmail = emailInput.trim() || `${studentRoll.toLowerCase()}@gkce.edu.in`;
      const cleanPassword = 'gkce@1234';

      await addStudent({
        name: studentName,
        rollNo: studentRoll,
        email: cleanEmail,
        teamNumber: targetTeam,
        dsaLevel: dsaLevelInput,
        status: statusInput,
      });

      setIsEnrollOpen(false);
      setNameInput('');
      setRollInput('');
      setEmailInput('');

      // Show auto-generated credentials card
      setCreatedCredentials({
        name: studentName,
        rollNo: studentRoll,
        email: cleanEmail,
        password: cleanPassword,
        teamNumber: targetTeam,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to enroll student. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    // Security check: Only allow deleting students from mentor's assigned teams
    const isMyStudent = activeTeams.some(t => t.id === student.teamId || t.teamNumber === student.teamNumber);
    if (!isMyStudent) {
      alert('Unauthorized: You can only manage students enrolled in your own assigned cohorts.');
      return;
    }

    setIsSubmitting(true);
    try {
      await removeStudent(student.id);
      setDeleteConfirmStudent(null);
      setSuccessMessage(`Student ${student.name} (${student.rollNo}) removed from ${student.teamNumber}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to remove student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Mentor Enroll Action */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1 flex-wrap">
            <Users className="w-4 h-4" />
            <span>Assigned Cohort Directory</span>
            {activeTeams.length > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                {activeTeams.length} Cohorts Assigned
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {selectedTeamFilter === 'ALL'
              ? (activeTeams.length > 1 ? `All Cohort Students (${allMyStudents.length})` : `${activeTeams[0]?.teamNumber} Students (${teamStudents.length})`)
              : `${selectedTeamFilter} Students (${teamStudents.length})`}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Faculty Mentor privileged controls: Enroll, remove, verify progress, and view student dossiers across {activeTeams.map(t => t.teamNumber).join(', ')}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={openEnrollModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Multi-Cohort Filter Tabs if Mentor has > 1 Team */}
      {activeTeams.length > 1 && (
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 px-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filter Cohort:</span>
          </span>
          <button
            onClick={() => setSelectedTeamFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTeamFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Teams ({allMyStudents.length})
          </button>
          {activeTeams.map((t) => {
            const count = allMyStudents.filter(s => s.teamId === t.id || s.teamNumber === t.teamNumber).length;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTeamFilter(t.teamNumber)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTeamFilter === t.teamNumber
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.teamNumber} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Card Roster (<md) */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            No students found in {selectedTeamFilter === 'ALL' ? 'assigned cohorts' : selectedTeamFilter}.
          </div>
        ) : (
          filtered.map((st) => (
            <motion.div
              key={st.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedStudent(st)}
              className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3 cursor-pointer hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <UserAvatar src={st.avatar} name={st.name} id={st.rollNo} role="STUDENT" size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-sm truncate">{st.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-blue-700">{st.rollNo}</span>
                      <span>•</span>
                      <span>{st.dsaLevel}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={st.status} size="sm" />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>DSA Progress</span>
                    <span className="font-bold text-slate-900">{st.progress}%</span>
                  </div>
                  <ProgressBar
                    percentage={st.progress}
                    height="xs"
                    color={st.progress >= 80 ? 'emerald' : st.progress >= 70 ? 'indigo' : 'amber'}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Solved: <strong className="text-slate-800">{st.solved}</strong> / {st.attempted}</span>
                  <StreakBadge streak={st.streak} size="sm" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmStudent(st);
                  }}
                  className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                  <span>View Full Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Cohort Table (>=md) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Student Details</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">DSA Progress</th>
                <th className="py-3.5 px-4">Problems Solved</th>
                <th className="py-3.5 px-4">Current Streak</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={st.avatar}
                        name={st.name}
                        id={st.rollNo}
                        role="STUDENT"
                        size="sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {st.rollNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-28">
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>{st.progress}%</span>
                        <span className="text-[10px] text-slate-400 font-mono">{st.dsaLevel}</span>
                      </div>
                      <ProgressBar
                        percentage={st.progress}
                        height="xs"
                        color={st.progress >= 80 ? 'emerald' : st.progress >= 70 ? 'indigo' : 'amber'}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <span className="font-bold">{st.solved}</span>
                    <span className="text-slate-400 text-[11px]"> / {st.attempted}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StreakBadge streak={st.streak} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={st.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmStudent(st)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                        title={`Delete ${st.name} from ${st.teamNumber}`}
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

      {/* ------------------------------------------------------------- */}
      {/* 1. Mentor Enroll Student Modal                                */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isEnrollOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsEnrollOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-700">
                  <UserPlus className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-base">Enroll Student</h3>
                </div>
                <button onClick={() => setIsEnrollOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEnrollStudent} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assign to Cohort</label>
                  {activeTeams.length > 1 ? (
                    <select
                      value={selectedTeamForEnroll}
                      onChange={(e) => setSelectedTeamForEnroll(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600/20"
                    >
                      {activeTeams.map((t) => (
                        <option key={t.id} value={t.teamNumber}>
                          {t.teamNumber} ({t.name})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={`${activeTeams[0]?.teamNumber || 'Team 07'} (Mentor: ${currentUser.name})`}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 cursor-not-allowed"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. CH. CHAKRI"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University Roll Number</label>
                  <input
                    type="text"
                    required
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value.toUpperCase())}
                    placeholder="e.g. 24F81A0522"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email (Optional)</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. student@gkce.edu.in"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">DSA Level</label>
                    <select
                      value={dsaLevelInput}
                      onChange={(e) => setDsaLevelInput(e.target.value as DSALevel)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Mastery">Mastery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as StudentStatus)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Needs Attention">Needs Attention</option>
                    </select>
                  </div>
                </div>

                {/* Auto Credentials Box Preview */}
                <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl space-y-1 text-xs text-indigo-950">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-800 text-[11px]">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Auto-Generated Student Login</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-700 space-y-0.5 bg-white/80 p-2 rounded-xl border border-indigo-100/60">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Login ID:</span>
                      <strong className="text-indigo-700">{rollInput.trim().toUpperCase() || '24F81A05XX'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Password:</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">gkce@1234</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enrolling...' : 'Confirm Enrollment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 2. Mentor Delete Confirmation Modal                           */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {deleteConfirmStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmStudent(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Remove from {deleteConfirmStudent.teamNumber}?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove <strong className="text-slate-800">{deleteConfirmStudent.name}</strong> ({deleteConfirmStudent.rollNo}) from your mentored cohort?
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmStudent(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteStudent(deleteConfirmStudent)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Removing...' : 'Yes, Remove'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 3. Credentials Generated Modal Popup                          */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {createdCredentials && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span>Student Credentials Generated!</span>
                </div>
                <button
                  onClick={() => {
                    setCreatedCredentials(null);
                    setCopiedCreds(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Student <strong>{createdCredentials.name}</strong> has been enrolled into <strong>{createdCredentials.teamNumber}</strong>. Login credentials:
                </p>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Student:</span>
                    <span className="font-bold text-white">{createdCredentials.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Roll No (Login ID):</span>
                    <span className="font-bold text-blue-400">{createdCredentials.rollNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{createdCredentials.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Default Password:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">{createdCredentials.password}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Cohort:</span>
                    <span className="text-indigo-300 font-bold">{createdCredentials.teamNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `🏛️ GKCE Student Portal Login Credentials\n\nStudent: ${createdCredentials.name}\nRoll Number: ${createdCredentials.rollNo}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nTeam: ${createdCredentials.teamNumber}\nRole: Student\nPortal URL: ${window.location.origin}`;
                    navigator.clipboard.writeText(text);
                    setCopiedCreds(true);
                    setTimeout(() => setCopiedCreds(false), 3000);
                  }}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  {copiedCreds ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Login Details</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedCredentials(null);
                    setCopiedCreds(false);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
