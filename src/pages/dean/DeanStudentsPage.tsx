import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Download,
  Filter,
  ChevronRight,
  Plus,
  Trash2,
  X,
  ShieldAlert,
  Edit3,
  ShieldCheck,
  Copy,
  Check,
  Key,
} from 'lucide-react';
import { Student, DSALevel, StudentStatus } from '../../types';

export const DeanStudentsPage: React.FC = () => {
  const { students, teams, setSelectedStudent, addStudent, updateStudent, removeStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Enrollment & Edit Modal State
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [teamNumberInput, setTeamNumberInput] = useState(teams[0]?.teamNumber || 'Team 01');
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

  // Lock body scroll while modals are open
  React.useEffect(() => {
    if (isEnrollOpen || editingStudent || deleteConfirmStudent || createdCredentials) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEnrollOpen, editingStudent, deleteConfirmStudent, createdCredentials]);

  const openEnrollModal = () => {
    const nextRollNum = 100 + students.length + 1;
    setRollInput(`24F81A05${nextRollNum < 1000 ? nextRollNum : Math.floor(100 + Math.random() * 899)}`);
    setNameInput('');
    setEmailInput('');
    setTeamNumberInput(teams[0]?.teamNumber || 'Team 01');
    setDsaLevelInput('Beginner');
    setStatusInput('Active');
    setIsEnrollOpen(true);
  };

  const openEditModal = (student: Student, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingStudent(student);
    setNameInput(student.name);
    setRollInput(student.rollNo);
    setEmailInput(student.email);
    setTeamNumberInput(student.teamNumber);
    setDsaLevelInput(student.dsaLevel);
    setStatusInput(student.status);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === 'All' || s.teamNumber === selectedTeam;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesLevel = selectedLevel === 'All' || s.dsaLevel === selectedLevel;

    return matchesSearch && matchesTeam && matchesStatus && matchesLevel;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedStudents = filteredStudents.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !rollInput.trim()) return;

    setIsSubmitting(true);
    try {
      const studentRoll = rollInput.trim().toUpperCase();
      const studentName = nameInput.trim();
      const targetTeam = teamNumberInput || teams[0]?.teamNumber || 'Team 01';
      const studentEmail = emailInput.trim() || `${studentRoll.toLowerCase()}@gkce.edu.in`;
      const studentPassword = 'gkce@1234';

      await addStudent({
        name: studentName,
        rollNo: studentRoll,
        email: studentEmail,
        teamNumber: targetTeam,
        dsaLevel: dsaLevelInput,
        status: statusInput,
      });

      setIsEnrollOpen(false);
      setNameInput('');
      setRollInput('');
      setEmailInput('');

      // Show auto-generated login credentials modal
      setCreatedCredentials({
        name: studentName,
        rollNo: studentRoll,
        email: studentEmail,
        password: studentPassword,
        teamNumber: targetTeam,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to enroll student. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setIsSubmitting(true);
    try {
      const studentRoll = rollInput.trim().toUpperCase();
      const studentName = nameInput.trim();
      await updateStudent(editingStudent.id, {
        name: studentName,
        rollNo: studentRoll,
        email: emailInput.trim() || `${studentRoll.toLowerCase()}@gkce.edu.in`,
        teamNumber: teamNumberInput,
        dsaLevel: dsaLevelInput,
        status: statusInput,
      });
      setSuccessMessage(`Student ${studentName} (${studentRoll}) updated!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    try {
      await removeStudent(student.id);
      setDeleteConfirmStudent(null);
      setSuccessMessage(`Student ${student.name} (${student.rollNo}) de-enrolled.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Team', 'Mentor', 'DSA Progress %', 'Solved', 'Attempted', 'Streak', 'Status', 'Level'];
    const rows = filteredStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.email,
      s.teamNumber,
      `"${s.mentorName}"`,
      s.progress,
      s.solved,
      s.attempted,
      s.streak,
      s.status,
      s.dsaLevel,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GKCE_DSA_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Enrolled Students Master Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {students.length} Monitored Students
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Dean privileged controls: Enroll, manage, filter, and inspect individual student progress across all cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={openEnrollModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student, roll no (e.g. 24F81A0522)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 touch-scroll-x no-scrollbar flex-wrap sm:flex-nowrap">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden shrink-0"
            >
              <option value="All">All Teams ({teams.length})</option>
              {teams.map((t) => (
                <option key={t.id} value={t.teamNumber}>
                  {t.teamNumber} ({t.name})
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden shrink-0"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden shrink-0"
            >
              <option value="All">All DSA Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Mastery">Mastery</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 px-1">
          <span>
            Showing <strong>{filteredStudents.length > 0 ? (safeCurrentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
            <strong>{Math.min(safeCurrentPage * itemsPerPage, filteredStudents.length)}</strong> of{' '}
            <strong>{filteredStudents.length}</strong> students
          </span>
          {(searchQuery || selectedTeam !== 'All' || selectedStatus !== 'All' || selectedLevel !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTeam('All');
                setSelectedStatus('All');
                setSelectedLevel('All');
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile Card Roster (<md) */}
      <div className="md:hidden space-y-3">
        {paginatedStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            No students match your filter criteria.
          </div>
        ) : (
          paginatedStudents.map((s) => (
            <motion.div
              key={s.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedStudent(s)}
              className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3 cursor-pointer hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <UserAvatar src={s.avatar} name={s.name} id={s.rollNo} role="STUDENT" size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-sm truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-blue-700">{s.rollNo}</span>
                      <span>•</span>
                      <span>{s.teamNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={s.status} size="sm" />
                  <button
                    onClick={(e) => openEditModal(s, e)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Edit Student"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmStudent(s);
                    }}
                    className="p-1 text-slate-300 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="De-enroll Student"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Progress ({s.dsaLevel})</span>
                    <span className="font-bold text-slate-900">{s.progress}%</span>
                  </div>
                  <ProgressBar
                    percentage={s.progress}
                    height="xs"
                    color={s.progress >= 80 ? 'emerald' : s.progress >= 60 ? 'indigo' : 'amber'}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Solved: <strong className="text-slate-800">{s.solved}</strong>/34</span>
                  <StreakBadge streak={s.streak} size="sm" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Mentor: {s.mentorName}</span>
                <span className="text-blue-600 font-bold flex items-center gap-0.5">
                  <span>View Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View (>=md) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Team & Mentor</th>
                <th className="py-3.5 px-4">DSA Progress</th>
                <th className="py-3.5 px-4">Problems Solved</th>
                <th className="py-3.5 px-4">Streak</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={s.avatar}
                          name={s.name}
                          id={s.rollNo}
                          role="STUDENT"
                          size="sm"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {s.rollNo}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{s.teamNumber}</div>
                      <div className="text-[10px] text-slate-400">{s.mentorName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] text-slate-700 font-bold mb-1">
                          <span>{s.progress}%</span>
                          <span className="text-[10px] text-slate-400 font-normal">{s.dsaLevel}</span>
                        </div>
                        <ProgressBar
                          percentage={s.progress}
                          height="xs"
                          color={s.progress >= 80 ? 'emerald' : s.progress >= 60 ? 'indigo' : 'amber'}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <strong className="text-slate-900">{s.solved}</strong> / 100
                    </td>
                    <td className="py-3.5 px-4">
                      <StreakBadge streak={s.streak} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={s.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(s);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => openEditModal(s, e)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmStudent(s);
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="De-enroll Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-slate-500">
            Page <strong>{safeCurrentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex gap-1">
            <button
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  pg === safeCurrentPage
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal: Enroll Student */}
      <AnimatePresence>
        {isEnrollOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Enroll New Student</span>
                </div>
                <button
                  onClick={() => setIsEnrollOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollStudent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. S. PAVAN KUMAR"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GKCE Roll Number</label>
                  <input
                    type="text"
                    required
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    placeholder="e.g. 24F81A0589"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email (Optional)</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Auto-generated from Roll No if blank"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Team</label>
                    <select
                      value={teamNumberInput}
                      onChange={(e) => setTeamNumberInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.teamNumber}>
                          {t.teamNumber} ({t.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">DSA Level</label>
                    <select
                      value={dsaLevelInput}
                      onChange={(e) => setDsaLevelInput(e.target.value as DSALevel)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Mastery">Mastery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as StudentStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Auto-Generated Login Credentials Preview */}
                <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-1.5 text-xs text-blue-950">
                  <div className="font-bold flex items-center gap-1.5 text-blue-800 text-xs">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Auto-Generated Student Login Credentials</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 space-y-1 bg-white/80 p-2.5 rounded-xl border border-blue-100/60">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Login ID / Roll:</span>
                      <strong className="text-blue-700">{rollInput.trim().toUpperCase() || '24F81A05XX'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Institutional Email:</span>
                      <span className="text-slate-800 truncate max-w-[200px]">{emailInput.trim() || (rollInput.trim() ? `${rollInput.trim().toLowerCase()}@gkce.edu.in` : 'student@gkce.edu.in')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Default Password:</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">gkce@1234</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEnrollOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Student */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>Edit Student Profile</span>
                </div>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. S. PAVAN KUMAR"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GKCE Roll Number</label>
                  <input
                    type="text"
                    required
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    placeholder="e.g. 24F81A0589"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. rollno@gkce.edu.in"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Reassign Team</label>
                    <select
                      value={teamNumberInput}
                      onChange={(e) => setTeamNumberInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.teamNumber}>
                          {t.teamNumber} ({t.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">DSA Level</label>
                    <select
                      value={dsaLevelInput}
                      onChange={(e) => setDsaLevelInput(e.target.value as DSALevel)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Mastery">Mastery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as StudentStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium text-slate-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="pt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Delete Student Confirmation */}
      <AnimatePresence>
        {deleteConfirmStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">De-enroll {deleteConfirmStudent.name}?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Roll No: <strong>{deleteConfirmStudent.rollNo}</strong> ({deleteConfirmStudent.teamNumber}). This will permanently remove their profile and records.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteConfirmStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteStudent(deleteConfirmStudent)}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Confirm De-enroll
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Student Credentials Generated Success */}
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
                  Student <strong>{createdCredentials.name}</strong> has been enrolled and registered in the database. Their login credentials are ready:
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
                    <span className="text-slate-400">Institutional Email:</span>
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

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 leading-relaxed">
                  💡 The student can log in on any device using their <strong>Roll Number</strong> or <strong>Email</strong> with password <strong>{createdCredentials.password}</strong>.
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
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  {copiedCreds ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Login Credentials</span>
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

