import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, Shield, UserCheck, GraduationCap, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuickRoleSwitcher: React.FC = () => {
  const { currentUser, role, switchRole, logout, setActiveTab, setSelectedStudent, setSelectedTeam } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectRole = (newRole: 'DEAN' | 'MENTOR' | 'STUDENT') => {
    setSelectedStudent(null);
    setSelectedTeam(null);
    setActiveTab('dashboard');
    if (newRole === 'DEAN') {
      switchRole('DEAN');
    } else if (newRole === 'MENTOR') {
      switchRole('MENTOR', 'mentor-7');
    } else {
      switchRole('STUDENT', 'student-1');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs border border-slate-700/60 shrink-0 cursor-pointer"
        title="Click to switch role or view session scope"
      >
        {role === 'DEAN' ? (
          <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        ) : role === 'MENTOR' ? (
          <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        ) : (
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        )}

        <span className="hidden sm:inline text-slate-400 font-normal">Role:</span>
        <span className="font-semibold text-white truncate max-w-[90px] sm:max-w-[150px]">
          {role === 'DEAN' ? 'Dean' : role === 'MENTOR' ? (currentUser.teamNumber || 'Mentor') : (currentUser.studentData?.rollNo || 'Student')}
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-2xs"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 p-3.5 z-50 overscroll-contain"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current Session
                </span>
              </div>

              {/* Current Role Info */}
              <div className="py-2.5">
                <div className="w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all border bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl shrink-0 bg-blue-600 text-white">
                      {role === 'DEAN' ? <Shield className="w-4 h-4" /> : role === 'MENTOR' ? <UserCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{role === 'DEAN' ? 'Dean (Academics)' : role === 'MENTOR' ? 'Faculty Mentor' : 'Student'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {role === 'DEAN' ? 'Macro overview across all teams' : role === 'MENTOR' ? `Managing ${currentUser.teamNumber}` : `Viewing profile for ${currentUser.studentData?.rollNo}`}
                      </div>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-2.5 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Secure Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


