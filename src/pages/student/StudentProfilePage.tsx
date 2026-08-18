import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { User, Mail, GraduationCap, GitBranch, Code, Award, BookOpen, ShieldCheck } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser.studentData;

  if (!student) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
          <User className="w-4 h-4" />
          <span>Student Academic Record</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Official enrollment details and connected profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Identity Bento */}
        <BentoCard title="Academic Identity" subtitle="Institution Record" className="col-span-1 md:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-slate-100 pt-2">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <StatusBadge status={student.status} />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
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
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Email Address</span>
              <div className="font-medium text-slate-800">{student.email}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Assigned Cohort</span>
              <div className="font-medium text-slate-800">{student.teamNumber} (5 Students)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Assigned Mentor</span>
              <div className="font-medium text-slate-800">{student.mentorName}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Curriculum Track</span>
              <div className="font-medium text-slate-800">Autonomous 2026 Core DSA</div>
            </div>
          </div>
        </BentoCard>

        {/* Connected Profiles */}
        <BentoCard title="Integrations" subtitle="External Code Sync" className="col-span-1">
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">LeetCode</div>
                  <div className="text-[11px] text-slate-500 font-mono">{student.leetcodeUsername}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitBranch className="w-4 h-4 text-slate-800" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">GitHub</div>
                  <div className="text-[11px] text-slate-500 font-mono">{student.githubUsername}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center gap-2 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Submissions auto-verified with GKCE evaluation benchmark.</span>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
