import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
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
  const { currentUser, updateAvatar } = useAuth();
  const student = currentUser.studentData;

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!student) return null;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <User className="w-4 h-4" />
            <span>Student Academic Record</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Official enrollment record, academic credentials, and connected coding handles.
          </p>
        </div>

        <button
          onClick={() => {
            setPreviewUrl(student.avatar);
            setIsPhotoModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-98"
        >
          <Camera className="w-4 h-4" />
          <span>Change Profile Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Identity Bento */}
        <BentoCard title="Academic Identity" subtitle="Institution Record" className="col-span-1 md:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-slate-100 pt-2">
            <div className="relative group">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-white shadow-md object-cover"
              />
              <button
                onClick={() => {
                  setPreviewUrl(student.avatar);
                  setIsPhotoModalOpen(true);
                }}
                className="absolute inset-0 rounded-2xl bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-bold backdrop-blur-2xs"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
                <span>Change</span>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <StatusBadge status={student.status} />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded-md text-blue-700 font-bold">
                  {student.rollNo}
                </span>
                <span>•</span>
                <span>Computer Science & Engineering</span>
                <span>•</span>
                <span className="text-blue-700 font-semibold">{student.dsaLevel}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Institutional Email</span>
              <div className="font-bold text-slate-800">{student.email}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Assigned Cohort</span>
              <div className="font-bold text-slate-800">{student.teamNumber} (5 Students)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Faculty Mentor</span>
              <div className="font-bold text-slate-800">{student.mentorName}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold">Curriculum Track</span>
              <div className="font-bold text-slate-800">In-House DSA Programme (Level-1)</div>
            </div>
          </div>
        </BentoCard>

        {/* Connected Profiles */}
        <BentoCard title="Integrations" subtitle="External Code Sync" className="col-span-1">
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">LeetCode</div>
                  <div className="text-[11px] text-slate-500 font-mono">{student.leetcodeUsername}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                Connected
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitBranch className="w-4 h-4 text-slate-800" />
                <div>
                  <div className="text-xs font-bold text-slate-900">GitHub</div>
                  <div className="text-[11px] text-slate-500 font-mono">{student.githubUsername}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                Connected
              </span>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Modal: Change Profile Photo */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4"
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
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Preset Avatars */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Choose Avatar Preset</label>
                <div className="grid grid-cols-4 gap-2.5">
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
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-12 rounded-xl object-cover" />
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
