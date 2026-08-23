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
  User,
  Layers,
  Award,
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
          { id: 'exams', label: 'Exams', icon: Award },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'MENTOR':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'my-team', label: 'Team', icon: Users },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'exams', label: 'Exams', icon: Award },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
        ];
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'problems', label: 'Practice', icon: Code2 },
          { id: 'exams', label: 'Exams', icon: Award },
          { id: 'my-progress', label: 'Progress', icon: TrendingUp },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const items = getMobileNavItems();
  if (!items.length) return null;

  return (
    <div
      className="md:hidden fixed left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ bottom: 0, paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
    >
      <nav
        className="glass-dock w-full mx-3 max-w-sm pointer-events-auto"
        style={{ borderRadius: '24px', padding: '6px 4px' }}
      >
        <div className="flex items-stretch justify-around gap-0.5">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileTap={{ scale: 0.88 }}
                // 44px minimum touch target
                className="relative flex flex-col items-center justify-center flex-1 select-none rounded-2xl outline-none"
                style={{ minHeight: '52px', padding: '6px 2px' }}
                aria-label={item.label}
              >
                {/* Animated background pill for active state */}
                {isActive && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-1 bg-blue-600/10 rounded-xl border border-blue-500/25"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <Icon
                  className="z-10 shrink-0 transition-all duration-200"
                  style={{
                    width: 20,
                    height: 20,
                    color: isActive ? '#2563eb' : '#64748b',
                    strokeWidth: isActive ? 2.5 : 1.75,
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
                <span
                  className="z-10 mt-0.5 leading-none text-center"
                  style={{
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1d4ed8' : '#64748b',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
