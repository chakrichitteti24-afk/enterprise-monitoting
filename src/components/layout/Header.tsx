import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QuickRoleSwitcher } from '../ui/QuickRoleSwitcher';
import { UserAvatar } from '../ui/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  ExternalLink,
  LogOut,
  User as UserIcon,
  Flame,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
}) => {
  const { currentUser, role, setIsSearchOpen, setActiveTab, setSelectedStudent, setSelectedTeam, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Weekly DSA Benchmark Updated',
      desc: 'Team 03 achieved 91% milestone completion.',
      time: '10m ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 2,
      title: 'Attention Required',
      desc: '3 students in Team 16 have not solved problems this week.',
      time: '1h ago',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 px-4 md:px-8 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Brand / Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-2xl bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>

          <div
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedStudent(null);
              setSelectedTeam(null);
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 tracking-tighter"
            >
              GK
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                  GKCE
                </span>
                <span className="text-slate-300 font-light hidden sm:inline">|</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100 hidden sm:inline-block">
                  DSA Monitor
                </span>
              </div>
              <div className="text-[10px] text-slate-400 leading-none truncate max-w-[160px] sm:max-w-none hidden md:block">
                Gokula Krishna College of Engineering
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Island Status Capsule for Mobile */}
        {role === 'STUDENT' && currentUser.studentData && (
          <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 border border-amber-200/70 text-amber-900 text-[11px] font-semibold shadow-2xs">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{currentUser.studentData.streak}d Streak</span>
          </div>
        )}

        {/* Center: Search Bar Button (Cmd+K) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100/70 hover:bg-slate-100 text-slate-500 text-xs font-normal border border-slate-200/50 transition-all text-left shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="text-slate-500 truncate">Search students, teams, topics...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-md text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </motion.button>
        </div>

        {/* Right: Quick Switcher & User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Role Switcher */}
          <QuickRoleSwitcher />

          {/* Search Trigger for Mobile */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-2xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-colors"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-2xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 p-3.5 z-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-900">Notifications</span>
                      <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">
                        Mark all read
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-2xl hover:bg-slate-50 flex items-start gap-3 transition-colors cursor-pointer"
                        >
                          <div className={`p-1.5 rounded-xl shrink-0 ${n.color}`}>
                            <n.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900">{n.title}</div>
                            <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{n.desc}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors border border-slate-200/50"
            >
              <UserAvatar
                src={currentUser.avatar}
                name={currentUser.name}
                role={role}
                size="sm"
                showBadge
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-none">
                  {role === 'DEAN' ? 'Dean' : role === 'MENTOR' ? `Mentor • ${currentUser.teamNumber}` : `Student • ${currentUser.studentData?.rollNo}`}
                </div>
              </div>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 p-2 z-50"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-semibold border border-blue-100">
                        Active Role: <strong>{role}</strong>
                      </div>
                    </div>
                    <div className="py-1">
                      {role === 'STUDENT' && (
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                          My Profile & Badges
                        </button>
                      )}
                      <a
                        href="https://gkce.edu.in"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        GKCE Portal
                      </a>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
