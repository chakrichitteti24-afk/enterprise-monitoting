import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  UserCheck,
  GraduationCap,
  LogOut,
  Lock,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuickRoleSwitcher: React.FC = () => {
  const { currentUser, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-2xl text-xs font-semibold transition-all shadow-2xs border shrink-0 cursor-pointer select-none active:scale-97 ${
          role === 'DEAN'
            ? 'bg-slate-900 text-white border-blue-500/40 hover:bg-slate-800'
            : role === 'MENTOR'
            ? 'bg-indigo-950 text-indigo-100 border-indigo-500/40 hover:bg-indigo-900'
            : 'bg-emerald-950 text-emerald-100 border-emerald-500/40 hover:bg-emerald-900'
        }`}
        title="Authenticated RBAC Session — Click for security status"
        aria-label="View current session role and security permissions"
      >
        {role === 'DEAN' ? (
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline-block px-1 py-0.5 rounded bg-blue-500/25 text-blue-300 text-[9px] font-extrabold uppercase tracking-wider border border-blue-400/30">
              ROOT
            </span>
          </div>
        ) : role === 'MENTOR' ? (
          <div className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline-block px-1 py-0.5 rounded bg-indigo-500/25 text-indigo-300 text-[9px] font-extrabold uppercase tracking-wider border border-indigo-400/30">
              COHORT
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline-block px-1 py-0.5 rounded bg-emerald-500/25 text-emerald-300 text-[9px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
              STUDENT
            </span>
          </div>
        )}

        <span className="font-bold truncate max-w-[70px] xs:max-w-[100px] sm:max-w-[140px] leading-none">
          {role === 'DEAN'
            ? 'Dean (Root)'
            : role === 'MENTOR'
            ? `${currentUser.teamNumber || 'Mentor'}`
            : `${currentUser.studentData?.rollNo || 'Student'}`}
        </span>
        
        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-2xs"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Modal Container — perfectly centered on mobile, docked below on desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed left-3 right-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 overscroll-contain space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Authenticated Session
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    STRICT RBAC
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Profile Info */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 text-white ${
                      role === 'DEAN'
                        ? 'bg-blue-600'
                        : role === 'MENTOR'
                        ? 'bg-indigo-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {role === 'DEAN' ? (
                      <Shield className="w-5 h-5" />
                    ) : role === 'MENTOR' ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate font-mono">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Role Tier:</span>
                    <strong className="text-slate-800">
                      {role === 'DEAN'
                        ? 'Tier 1 • Institutional Dean'
                        : role === 'MENTOR'
                        ? 'Tier 2 • Faculty Mentor'
                        : 'Tier 3 • Enrolled Student'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Permission Scope:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[160px] text-right">
                      {role === 'DEAN'
                        ? 'Global (All 8 Teams)'
                        : role === 'MENTOR'
                        ? `${currentUser.teamNumber || 'Assigned Cohort'}`
                        : `Roll: ${currentUser.studentData?.rollNo}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Strict Security Policy Notice */}
              <div className="p-2.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <strong>Strict Security Policy Enforced:</strong> Unauthenticated role switching is disabled. You must authenticate with valid credentials to change accounts.
                </div>
              </div>

              {/* Secure Sign Out Action */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out & Switch Account</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
