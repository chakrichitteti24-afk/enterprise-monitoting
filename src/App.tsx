import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { StudentDetailModal } from './components/modals/StudentDetailModal';
import { TeamDetailModal } from './components/modals/TeamDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProgressPage } from './pages/student/StudentProgressPage';
import { StudentProblemsPage } from './pages/student/StudentProblemsPage';
import { StudentActivityPage } from './pages/student/StudentActivityPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorStudentsPage } from './pages/mentor/MentorStudentsPage';
import { MentorProgressPage } from './pages/mentor/MentorProgressPage';

// Dean Pages
import { DeanDashboard } from './pages/dean/DeanDashboard';
import { DeanTeamsPage } from './pages/dean/DeanTeamsPage';
import { DeanStudentsPage } from './pages/dean/DeanStudentsPage';
import { DeanAnalyticsPage } from './pages/dean/DeanAnalyticsPage';
import { DeanReportsPage } from './pages/dean/DeanReportsPage';
import { DeanSettingsPage } from './pages/dean/DeanSettingsPage';

// Auth Page
import { LoginPage } from './pages/auth/LoginPage';

const MainLayout: React.FC = () => {
  const { role, activeTab, setActiveTab, isAuthenticated, isLoadingAuth } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically sanitize activeTab when role changes to prevent stuck tabs
  React.useEffect(() => {
    const validDeanTabs = ['dashboard', 'teams', 'students', 'progress', 'analytics', 'reports', 'settings'];
    const validMentorTabs = ['dashboard', 'my-team', 'students', 'progress'];
    const validStudentTabs = ['dashboard', 'my-progress', 'problems', 'activity', 'profile'];

    if (role === 'DEAN' && !validDeanTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (role === 'MENTOR' && !validMentorTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (role === 'STUDENT' && !validStudentTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [role, activeTab, setActiveTab]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium tracking-wider text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  const renderContent = () => {
    // STUDENT ROLE VIEWS
    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'my-progress':
          return <StudentProgressPage />;
        case 'problems':
          return <StudentProblemsPage />;
        case 'activity':
          return <StudentActivityPage />;
        case 'profile':
          return <StudentProfilePage />;
        default:
          return <StudentDashboard />;
      }
    }

    // MENTOR ROLE VIEWS
    if (role === 'MENTOR') {
      switch (activeTab) {
        case 'dashboard':
        case 'my-team':
          return <MentorDashboard />;
        case 'students':
          return <MentorStudentsPage />;
        case 'progress':
          return <MentorProgressPage />;
        default:
          return <MentorDashboard />;
      }
    }

    // DEAN ROLE VIEWS
    if (role === 'DEAN') {
      switch (activeTab) {
        case 'dashboard':
          return <DeanDashboard />;
        case 'teams':
          return <DeanTeamsPage />;
        case 'students':
          return <DeanStudentsPage />;
        case 'progress':
        case 'analytics':
          return <DeanAnalyticsPage />;
        case 'reports':
          return <DeanReportsPage />;
        case 'settings':
          return <DeanSettingsPage />;
        default:
          return <DeanDashboard />;
      }
    }

    return <DeanDashboard />;
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/70 text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Global Header */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto min-w-0">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile Slide-out Drawer with liquid spring */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-72 max-w-[85vw] bg-white h-full z-10 shadow-2xl flex flex-col justify-between"
              >
                <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area with fluid AnimatePresence transition */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 pb-24 sm:pb-28 md:pb-12 min-w-0 overflow-y-auto gpu-layer">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${activeTab}`}
              initial={{ opacity: 0, y: 8, scale: 0.994 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.994 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full min-w-0"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Floating Liquid Dock */}
      <MobileNav />

      {/* Global Interactive Modals */}
      <GlobalSearchModal />
      <StudentDetailModal />
      <TeamDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
