import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  Code2,
  Activity,
  User,
  Layers,
  Award,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onItemClick }) => {
  const { role, activeTab, setActiveTab, setSelectedStudent, setSelectedTeam, currentUser, students, teams } = useAuth();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedStudent(null);
    setSelectedTeam(null);
    onItemClick?.();
  };

  // Role-specific navigation items
  const getNavItems = () => {
    switch (role) {
      case 'DEAN': {
        const deanAvgProgress = students.length > 0
          ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
          : 0;
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
          { id: 'exams', label: 'Weekly Exams', icon: Award, badge: 'Root' },
          { id: 'teams', label: 'Teams', icon: Layers, badge: String(teams.length) },
          { id: 'students', label: 'Students', icon: GraduationCap, badge: String(students.length) },
          { id: 'progress', label: 'Progress', icon: TrendingUp, badge: `${deanAvgProgress}%` },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: undefined },
          { id: 'reports', label: 'Reports', icon: FileText, badge: undefined },
          { id: 'settings', label: 'Settings', icon: Settings, badge: undefined },
        ];
      }
      case 'MENTOR': {
        const myTeamStudents = students.filter(
          s => s.teamId === currentUser.teamId || s.teamNumber === currentUser.teamNumber
        );
        const myTeamAvg = myTeamStudents.length > 0
          ? Math.round(myTeamStudents.reduce((acc, s) => acc + s.progress, 0) / myTeamStudents.length)
          : 0;
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
          { id: 'exams', label: 'Weekly Exams', icon: Award, badge: undefined },
          { id: 'my-team', label: 'My Team', icon: Users, badge: currentUser.teamNumber || 'Team 07' },
          { id: 'students', label: 'Students', icon: GraduationCap, badge: String(myTeamStudents.length) },
          { id: 'progress', label: 'Progress', icon: TrendingUp, badge: `${myTeamAvg}%` },
        ];
      }
      case 'STUDENT': {
        const studentProg = currentUser.studentData?.progress ?? 0;
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
          { id: 'exams', label: 'Weekly Exams', icon: Award, badge: 'Live' },
          { id: 'my-progress', label: 'My Progress', icon: TrendingUp, badge: `${studentProg}%` },
          { id: 'problems', label: 'Problems', icon: Code2, badge: undefined },
          { id: 'activity', label: 'Activity', icon: Activity, badge: undefined },
          { id: 'profile', label: 'Profile', icon: User, badge: undefined },
        ];
      }
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`w-64 glass-panel border-r border-slate-200/60 flex flex-col justify-between p-4 shrink-0 select-none ${className}`}>
      <div className="space-y-6">
        {/* Role Identity Tag */}
        <div className="px-3.5 py-3 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Active Workspace
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-bold text-slate-900 truncate pr-2">
              {role === 'DEAN' ? 'Dean Overview' : role === 'MENTOR' ? `Mentor • ${currentUser.teamNumber || 'Team 07'}` : `Student • ${currentUser.studentData?.rollNo || '22CSE101'}`}
            </span>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${role === 'DEAN' ? 'bg-blue-600 shadow-xs shadow-blue-500/50' : role === 'MENTOR' ? 'bg-indigo-600 shadow-xs shadow-indigo-500/50' : 'bg-emerald-500 shadow-xs shadow-emerald-500/50'}`} />
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </div>
          <nav className="space-y-1 relative">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs transition-colors z-10 ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute inset-0 bg-slate-900 rounded-2xl shadow-md z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}

                  <div className="flex items-center gap-3 z-10">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-lg font-mono z-10 ${
                        isActive
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200/50 space-y-2">
        <div className="px-3.5 py-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
            <span>Academic Cycle</span>
            <span className="text-blue-700 font-mono">2025-26</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Dept. of Computer Science & Engg
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>GKCE v2.4</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
