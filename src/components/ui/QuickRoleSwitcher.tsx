import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, Shield, UserCheck, GraduationCap, CheckCircle2, Lock } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { currentUser, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs border border-slate-700/60"
        title="Authenticated Session Scope"
      >
        {role === 'DEAN' ? (
          <Shield className="w-3.5 h-3.5 text-blue-400" />
        ) : role === 'MENTOR' ? (
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
        )}

        <span className="text-slate-400 font-normal">Role:</span>
        <span className="font-semibold text-white">
          {role === 'DEAN' ? 'Dean (Macro View)' : role === 'MENTOR' ? `Mentor (${currentUser.teamNumber || 'Team 07'})` : `Student (${currentUser.studentData?.rollNo || '22CSE031'})`}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3.5 py-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Session
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Authenticated
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1 truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentUser.email}
              </div>
            </div>

            <div className="p-3 space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  RBAC Permission Scope
                </div>
                <div className="text-slate-700 leading-snug font-medium">
                  {role === 'DEAN'
                    ? 'Privileged Dean: Full access across all 20 teams, 100 students, and macro analytics.'
                    : role === 'MENTOR'
                    ? `Assigned Mentor: Restricted strictly to ${currentUser.teamNumber || 'Team 07'} (5 students). Other teams are 403 Forbidden.`
                    : `Enrolled Student: Private record only (${currentUser.studentData?.rollNo || '22CSE031'}). Cross-student access is 403 Forbidden.`}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  JWT Token Signed
                </span>
                <span className="font-semibold text-slate-700">HS256</span>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full mt-1 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-semibold transition-colors text-center"
              >
                Switch Account / Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
