import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GithubIcon, LinkedinIcon } from '../../components/ui/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GitBranch,
  Code,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Send,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Globe,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
];

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateAvatar, updateSocialProfiles } = useAuth();
  const student = currentUser.studentData;

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Social profiles state
  const [githubInput, setGithubInput] = useState('');
  const [linkedinInput, setLinkedinInput] = useState('');
  const [isSavingProfiles, setIsSavingProfiles] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileErrorMessage, setProfileErrorMessage] = useState('');

  if (!student) return null;

  // Pre-fill githubInput and linkedinInput from student data or localStorage
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const storedGh = localStorage.getItem(`gkce_student_github_${student.rollNo}`) || localStorage.getItem(`gkce_github_link_${student.rollNo}`);
    const storedLi = localStorage.getItem(`gkce_student_linkedin_${student.rollNo}`);

    const existingGh = student.githubUrl || student.githubRepoLink || (student.githubUsername ? `https://github.com/${student.githubUsername}` : '') || storedGh || '';
    const existingLi = student.linkedinUrl || storedLi || '';

    setGithubInput(existingGh);
    setLinkedinInput(existingLi);
  }, [student.rollNo, student.githubUrl, student.githubRepoLink, student.githubUsername, student.linkedinUrl]);

  // Lock background body scroll while photo modal is open
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (isPhotoModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isPhotoModalOpen]);

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    const targetUrl = previewUrl || customUrl.trim();
    if (!targetUrl) return;

    setIsSaving(true);
    try {
      await updateAvatar(targetUrl);
      setIsPhotoModalOpen(false);
      setCustomUrl('');
      setPreviewUrl('');
    } catch (err) {
      console.error('Failed to update avatar', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitProfiles = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let cleanGithub = githubInput.trim();
    let cleanLinkedin = linkedinInput.trim();

    // Smart auto-formatting for GitHub
    if (cleanGithub) {
      if (cleanGithub.startsWith('@')) cleanGithub = cleanGithub.slice(1);
      if (!cleanGithub.startsWith('http://') && !cleanGithub.startsWith('https://')) {
        if (!cleanGithub.includes('github.com')) {
          cleanGithub = `https://github.com/${cleanGithub}`;
        } else {
          cleanGithub = `https://${cleanGithub}`;
        }
      }
    }

    // Smart auto-formatting for LinkedIn
    if (cleanLinkedin) {
      if (!cleanLinkedin.startsWith('http://') && !cleanLinkedin.startsWith('https://')) {
        if (!cleanLinkedin.includes('linkedin.com')) {
          cleanLinkedin = `https://linkedin.com/in/${cleanLinkedin.replace(/^in\//, '')}`;
        } else {
          cleanLinkedin = `https://${cleanLinkedin}`;
        }
      }
    }

    setIsSavingProfiles(true);
    try {
      await updateSocialProfiles({
        githubUrl: cleanGithub,
        linkedinUrl: cleanLinkedin,
      });
      setGithubInput(cleanGithub);
      setLinkedinInput(cleanLinkedin);
      setProfileSaveStatus('success');
      setTimeout(() => setProfileSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setProfileErrorMessage(err.message || 'Failed to save profiles. Please try again.');
      setProfileSaveStatus('error');
      setTimeout(() => setProfileSaveStatus('idle'), 3500);
    } finally {
      setIsSavingProfiles(false);
    }
  };

  const handleClearGithub = async () => {
    setGithubInput('');
    await updateSocialProfiles({ githubUrl: '' });
  };

  const handleClearLinkedin = async () => {
    setLinkedinInput('');
    await updateSocialProfiles({ linkedinUrl: '' });
  };

  const activeGithubUrl = student.githubUrl || student.githubRepoLink || (student.githubUsername ? `https://github.com/${student.githubUsername}` : '') ||
    (() => { try { return localStorage.getItem(`gkce_student_github_${student.rollNo}`) || localStorage.getItem(`gkce_github_link_${student.rollNo}`) || ''; } catch { return ''; } })();

  const activeLinkedinUrl = student.linkedinUrl ||
    (() => { try { return localStorage.getItem(`gkce_student_linkedin_${student.rollNo}`) || ''; } catch { return ''; } })();

  const hasAllProfiles = Boolean(activeGithubUrl && activeLinkedinUrl);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <User className="w-4 h-4" />
            <span>Student Academic Record</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Student Profile & Accounts</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Official enrollment record, academic credentials, and mandatory coding/professional profiles.
          </p>
        </div>

        <button
          onClick={() => {
            setPreviewUrl(student.avatar);
            setIsPhotoModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Change Profile Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Main Identity Bento */}
        <BentoCard title="Academic Identity" subtitle="Institution Record" className="col-span-1 md:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pb-4 sm:pb-5 border-b border-slate-100 pt-2">
            <div className="relative group shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border-2 border-white shadow-md object-cover"
              />
              <button
                onClick={() => {
                  setPreviewUrl(student.avatar);
                  setIsPhotoModalOpen(true);
                }}
                className="absolute inset-0 rounded-2xl bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-bold backdrop-blur-2xs cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
                <span>Change</span>
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{student.name}</h2>
                <StatusBadge status={student.status} size="sm" />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-blue-700 font-bold">
                  {student.rollNo}
                </span>
                <span>•</span>
                <span className="truncate">Computer Science &amp; Engineering</span>
                <span>•</span>
                <span className="text-blue-700 font-semibold">{student.dsaLevel}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Institutional Email</span>
              <div className="font-bold text-slate-800 truncate">{student.email}</div>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Assigned Cohort</span>
              <div className="font-bold text-slate-800">{student.teamNumber} (5 Students)</div>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Faculty Mentor</span>
              <div className="font-bold text-slate-800 truncate">{student.mentorName}</div>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Curriculum Track</span>
              <div className="font-bold text-slate-800 truncate">GKCE DSA Programme (Level-1)</div>
            </div>
          </div>
        </BentoCard>

        {/* Connected Profiles */}
        <BentoCard title="Verified Profiles" subtitle="Live Connected Portals" className="col-span-1">
          <div className="space-y-3 pt-2">
            {/* LeetCode */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <Code className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">LeetCode</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{student.leetcodeUsername || 'Not connected'}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold shrink-0">
                Connected
              </span>
            </div>

            {/* GitHub */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <GithubIcon className="w-4 h-4 text-slate-900 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">GitHub</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {activeGithubUrl ? (activeGithubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, '@') || activeGithubUrl) : 'Pending link'}
                  </div>
                </div>
              </div>
              {activeGithubUrl ? (
                <a
                  href={activeGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold shrink-0 hover:bg-emerald-200 flex items-center gap-1 transition-colors"
                >
                  <span>Linked</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold shrink-0">
                  Required
                </span>
              )}
            </div>

            {/* LinkedIn */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <LinkedinIcon className="w-4 h-4 text-[#0a66c2] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">LinkedIn</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {activeLinkedinUrl ? (activeLinkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, 'in/') || activeLinkedinUrl) : 'Pending link'}
                  </div>
                </div>
              </div>
              {activeLinkedinUrl ? (
                <a
                  href={activeLinkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold shrink-0 hover:bg-emerald-200 flex items-center gap-1 transition-colors"
                >
                  <span>Linked</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold shrink-0">
                  Required
                </span>
              )}
            </div>
          </div>
        </BentoCard>
      </div>

      {/* ── Mandatory GitHub & LinkedIn Profiles Section ── */}
      <BentoCard
        title="Mandatory Professional Accounts (GitHub & LinkedIn)"
        subtitle="Mandated by Faculty Mentor & Institutional Dean for placement verification and code auditing"
        icon={<ShieldCheck className="w-4 h-4 text-indigo-600" />}
        badge={
          hasAllProfiles ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Check className="w-3 h-3" /> Fully Connected
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Action Required
            </span>
          )
        }
      >
        <div className="space-y-5 pt-2">
          {/* Institutional Compliance Notice */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
            hasAllProfiles
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
          }`}>
            {hasAllProfiles ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold">
                {hasAllProfiles ? 'All Mandatory Accounts Linked:' : 'Institutional Verification Mandate:'}
              </span>{' '}
              {hasAllProfiles
                ? 'Your GitHub and LinkedIn profiles are verified and actively monitored by your Faculty Mentor and the Dean.'
                : 'All enrolled students must connect their GitHub and LinkedIn profiles. Your Faculty Mentor and Root (Dean) will review your code repositories and professional identity for term grading and placement sign-off.'}
            </div>
          </div>

          <form onSubmit={handleSubmitProfiles} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. GitHub Profile Input Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <GithubIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">GitHub Profile</div>
                      <div className="text-[10px] text-slate-500">Repositories &amp; solutions</div>
                    </div>
                  </div>
                  {activeGithubUrl ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      Pending
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    GitHub URL or Username
                  </label>
                  <div className="relative">
                    <GithubIcon className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={githubInput}
                      onChange={(e) => {
                        setGithubInput(e.target.value);
                        setProfileSaveStatus('idle');
                      }}
                      placeholder="https://github.com/your-username or username"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium transition-colors"
                    />
                  </div>
                </div>

                {/* Active Link Preview */}
                {activeGithubUrl && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 text-xs">
                    <a
                      href={activeGithubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold truncate flex items-center gap-1.5"
                    >
                      <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{activeGithubUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={handleClearGithub}
                      title="Clear GitHub link"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. LinkedIn Profile Input Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center shrink-0">
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">LinkedIn Profile</div>
                      <div className="text-[10px] text-slate-500">Placement &amp; professional dossier</div>
                    </div>
                  </div>
                  {activeLinkedinUrl ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      Pending
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    LinkedIn Profile URL or Handle
                  </label>
                  <div className="relative">
                    <LinkedinIcon className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={linkedinInput}
                      onChange={(e) => {
                        setLinkedinInput(e.target.value);
                        setProfileSaveStatus('idle');
                      }}
                      placeholder="https://linkedin.com/in/your-profile or profile-id"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium transition-colors"
                    />
                  </div>
                </div>

                {/* Active Link Preview */}
                {activeLinkedinUrl && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 text-xs">
                    <a
                      href={activeLinkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold truncate flex items-center gap-1.5"
                    >
                      <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{activeLinkedinUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={handleClearLinkedin}
                      title="Clear LinkedIn link"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="min-w-0">
                <AnimatePresence>
                  {profileSaveStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Profiles saved successfully! Your mentor and the Dean can now review them.</span>
                    </motion.div>
                  )}
                  {profileSaveStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-xs text-rose-600 font-bold"
                    >
                      <X className="w-4 h-4" />
                      <span>{profileErrorMessage || 'Please enter valid profile URLs.'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSavingProfiles || (!githubInput.trim() && !linkedinInput.trim())}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer shrink-0"
              >
                {isSavingProfiles ? (
                  <span>Saving Accounts...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Accounts</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </BentoCard>

      {/* Modal: Change Profile Photo */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Update Profile Photo</span>
                </div>
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="flex items-center justify-center py-2">
                <div className="relative">
                  <img
                    src={previewUrl || customUrl || student.avatar}
                    alt="Preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Preset Avatars */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Choose Avatar Preset</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                        previewUrl === preset
                          ? 'border-blue-600 ring-2 ring-blue-600/30 scale-105'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-16 sm:h-12 rounded-xl object-cover" />
                      {previewUrl === preset && (
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload or Custom URL */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Or Upload Custom Image</label>
                  <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50 transition-colors text-xs text-slate-600 font-semibold">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>Upload Image File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Or Paste Image URL</label>
                  <div className="relative">
                    <LinkIcon className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSaving || (!previewUrl && !customUrl.trim())}
                  onClick={handleSaveAvatar}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
