import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Code2,
  Activity,
  User,
  Layers,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, activeTab, setActiveTab, setSelectedStudent, setSelectedTeam } = useAuth();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedStudent(null);
    setSelectedTeam(null);
  };

  const getMobileNavItems = () => {
    switch (role) {
      case 'DEAN':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'teams', label: 'Teams', icon: Layers },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'MENTOR':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'my-team', label: 'My Team', icon: Users },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
        ];
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'my-progress', label: 'Progress', icon: TrendingUp },
          { id: 'problems', label: 'Solve', icon: Code2 },
          { id: 'activity', label: 'Timeline', icon: Activity },
          { id: 'profile', label: 'Profile', icon: User },
        ];
    }
  };

  const items = getMobileNavItems();

  return (
    <div className="md:hidden fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none flex justify-center">
      <nav className="glass-dock rounded-full p-1.5 flex items-center gap-1 shadow-2xl pointer-events-auto max-w-md w-full justify-around border border-white/80">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              whileTap={{ scale: 0.88 }}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full flex-1 transition-colors select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-blue-600/10 rounded-full border border-blue-500/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-200 z-10 ${
                  isActive ? 'text-blue-600 stroke-[2.5px] scale-105' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight transition-colors z-10 mt-0.5 ${
                  isActive ? 'font-bold text-blue-700' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
