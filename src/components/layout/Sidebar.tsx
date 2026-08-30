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
  ExternalLink,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../../config';

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
          ? Number((students.reduce((acc, s) => acc + s.progress, 0) / students.length).toFixed(1))
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
        const myAssignedTeams = teams.filter(
          t => t.mentorId === currentUser.id ||
               t.mentorEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
               t.mentorName?.toLowerCase() === currentUser.name?.toLowerCase() ||
               t.teamNumber === currentUser.teamNumber ||
               t.id === currentUser.teamId
        );
        const activeMentorTeams = myAssignedTeams.length > 0 ? myAssignedTeams : (teams.filter(t => t.teamNumber === 'Team 07') || [teams[0]]);
        const myTeamStudents = students.filter(
          s => activeMentorTeams.some(t => t.id === s.teamId || t.teamNumber === s.teamNumber)
        );
        const myTeamAvg = myTeamStudents.length > 0
          ? Number((myTeamStudents.reduce((acc, s) => acc + s.progress, 0) / myTeamStudents.length).toFixed(1))
          : 0;
        const teamBadge = activeMentorTeams.length > 1
          ? `${activeMentorTeams.length} Teams`
          : (activeMentorTeams[0]?.teamNumber || 'Team 07');

        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
          { id: 'exams', label: 'Weekly Exams', icon: Award, badge: undefined },
          { id: 'my-team', label: activeMentorTeams.length > 1 ? 'My Cohorts' : 'My Team', icon: Users, badge: teamBadge },
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
        {/* Role Identity Tag & RBAC Tier Badge */}
        <div className={`p-3.5 rounded-2xl border shadow-2xs transition-all ${
          role === 'DEAN'
            ? 'bg-blue-50/70 border-blue-200/80 text-blue-950'
            : role === 'MENTOR'
            ? 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950'
            : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              {role === 'DEAN' ? 'Tier 1 • Superuser' : role === 'MENTOR' ? 'Tier 2 • Mentor' : 'Tier 3 • Student'}
            </span>
            <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md uppercase border ${
              role === 'DEAN'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : role === 'MENTOR'
                ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              {role === 'DEAN' ? 'SUDO' : role === 'MENTOR' ? 'COHORT' : 'STUDENT'}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs font-extrabold truncate pr-2">
              {role === 'DEAN'
                ? 'Institutional Dean'
                : role === 'MENTOR'
                ? `${currentUser.teamNumber || 'Team 07'}`
                : `${currentUser.studentData?.rollNo || '24F81A0522'}`}
            </span>
            <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
              role === 'DEAN' ? 'bg-blue-600' : role === 'MENTOR' ? 'bg-indigo-600' : 'bg-emerald-500'
            }`} />
          </div>
          
          <div className="text-[10px] opacity-75 truncate mt-0.5 font-medium">
            {role === 'DEAN'
              ? 'Scope: All 8 Institutional Teams'
              : role === 'MENTOR'
              ? `Mentor: ${currentUser.name}`
              : `Student: ${currentUser.name}`}
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

        {/* Company Attribution */}
        <div className="text-center pt-1">
          <a
            href={COMPANY_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1 font-medium group"
          >
            <span>Engineered by</span>
            <span className="font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
              {COMPANY_CONFIG.name}
            </span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </aside>
  );
};
