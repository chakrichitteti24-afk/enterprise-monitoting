import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  X,
  Mail,
  Building,
  Phone,
  Clock,
  Key,
  Layers,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CreateMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMentorModal: React.FC<CreateMentorModalProps> = ({ isOpen, onClose }) => {
  const { teams, mentors, addMentor, switchRole } = useAuth();

  const [name, setName] = useState('');
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engg');
  const [phone, setPhone] = useState(`+91 98480 ${10000 + (mentors.length + 1)}`);
  const [experienceYears, setExperienceYears] = useState(8);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [password, setPassword] = useState('Mentor@GKCE2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Success view state
  const [createdCredentials, setCreatedCredentials] = useState<{
    mentorId: string;
    name: string;
    email: string;
    password: string;
    teamNumber: string;
  } | null>(null);

  // Generate clean email prefix dynamically from name
  const autoEmailPrefix = React.useMemo(() => {
    const clean = name.replace(/^(dr|prof|mrs|mr|ms)\.?\s+/i, '').replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'mentor.faculty';
    return parts.join('').toLowerCase().slice(0, 18);
  }, [name]);

  const effectiveEmail = useCustomEmail && customEmail.trim()
    ? customEmail.trim()
    : `${autoEmailPrefix}@gkce.edu.in`;

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleReset = () => {
    setName('');
    setUseCustomEmail(false);
    setCustomEmail('');
    setDepartment('Computer Science & Engg');
    setPhone(`+91 98480 ${10000 + (mentors.length + 1)}`);
    setExperienceYears(8);
    setSelectedTeamId('');
    setPassword('Mentor@GKCE2026');
    setCreatedCredentials(null);
    setCopiedCreds(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const chosenTeam = teams.find(t => t.id === selectedTeamId);
      const res = await addMentor({
        name: name.trim(),
        email: effectiveEmail,
        department: department.trim(),
        phone: phone.trim(),
        experienceYears: Number(experienceYears) || 8,
        assignedTeamId: chosenTeam?.id || '',
        assignedTeamNumber: chosenTeam?.teamNumber || 'Unassigned',
        password: password.trim() || 'Mentor@GKCE2026',
      });

      setCreatedCredentials({
        mentorId: res.mentor.id,
        name: res.credentials.name,
        email: res.credentials.email,
        password: res.credentials.password,
        teamNumber: res.credentials.teamNumber || 'Unassigned',
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create mentor. Please check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <AnimatePresence mode="wait">
        {!createdCredentials ? (
          <motion.div
            key="create-form"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-lg shadow-2xl border border-slate-100 my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">Create Faculty Mentor</h3>
                  <p className="text-xs text-slate-500 font-medium">Root Administration • Automatic Credentials Generation</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mentor Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mentor Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. P. Ramesh, Mrs. S. Anitha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Institutional Email with Live Auto-Generation Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Institutional Email</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomEmail(!useCustomEmail)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {useCustomEmail ? 'Use Auto-Generated' : 'Custom Override'}
                  </button>
                </div>

                {!useCustomEmail ? (
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800">
                    <span className="truncate">{effectiveEmail}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60 shrink-0 ml-2 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Auto-Generated
                    </span>
                  </div>
                ) : (
                  <input
                    type="email"
                    required
                    placeholder="custom.mentor@gkce.edu.in"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                )}
                <p className="text-[10px] text-slate-500">
                  Default domain: <code>@gkce.edu.in</code>. Used for faculty sign-in and mentor portal dashboard.
                </p>
              </div>

              {/* Department & Experience Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Phone Number & Assigned Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone Contact
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-400" /> Assigned Cohort
                  </label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Unassigned / General Faculty</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamNumber} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Default Password Policy */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Key className="w-3 h-3 text-slate-400" /> Initial Password
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Strict institutional mentor standard: <code>Mentor@GKCE2026</code>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Mentor & Generate Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Credentials Generated Success Modal */
          <motion.div
            key="success-card"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 my-auto"
          >
            {/* Success Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Faculty Credentials Generated!</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Authentication record registered in GKCE platform</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Faculty mentor <strong>{createdCredentials.name}</strong> has been created. Their login credentials are ready for use:
            </p>

            {/* Terminal Style Credentials Card */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-2.5 font-mono text-xs shadow-inner">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400 font-sans">Faculty Name:</span>
                <span className="font-bold text-white truncate max-w-[200px]">{createdCredentials.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400 font-sans">Institutional Email:</span>
                <span className="font-bold text-indigo-300 truncate max-w-[200px]">{createdCredentials.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400 font-sans">Strict Password:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                  {createdCredentials.password}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400 font-sans">Assigned Cohort:</span>
                <span className="text-amber-300 font-bold">{createdCredentials.teamNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Role Permission:</span>
                <span className="text-purple-300 font-bold">FACULTY MENTOR (Tier 2)</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 leading-relaxed">
              💡 The faculty member can now log in on any device using their <strong>Institutional Email</strong> with password <strong>{createdCredentials.password}</strong>.
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  const text = `🏛️ GKCE Faculty Mentor Login Credentials\n\nMentor Name: ${createdCredentials.name}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nAssigned Cohort: ${createdCredentials.teamNumber}\nRole: Faculty Mentor\nPortal URL: ${window.location.origin}`;
                  navigator.clipboard.writeText(text);
                  setCopiedCreds(true);
                  setTimeout(() => setCopiedCreds(false), 3000);
                }}
                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                {copiedCreds ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied Credentials to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Login Credentials</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    switchRole('MENTOR', createdCredentials.mentorId);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Test Login as Mentor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
