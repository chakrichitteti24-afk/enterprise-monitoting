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
import { StudentExamsPage } from './pages/student/StudentExamsPage';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorStudentsPage } from './pages/mentor/MentorStudentsPage';
import { MentorProgressPage } from './pages/mentor/MentorProgressPage';
import { MentorExamsPage } from './pages/mentor/MentorExamsPage';

// Dean Pages
import { DeanDashboard } from './pages/dean/DeanDashboard';
import { DeanTeamsPage } from './pages/dean/DeanTeamsPage';
import { DeanStudentsPage } from './pages/dean/DeanStudentsPage';
import { DeanAnalyticsPage } from './pages/dean/DeanAnalyticsPage';
import { DeanProgressPage } from './pages/dean/DeanProgressPage';
import { DeanReportsPage } from './pages/dean/DeanReportsPage';
import { DeanSettingsPage } from './pages/dean/DeanSettingsPage';
import { DeanExamsPage } from './pages/dean/DeanExamsPage';

// Auth Page
import { LoginPage } from './pages/auth/LoginPage';

// Skeleton fallback for page transitions
const PageSkeleton: React.FC = () => (
  <div className="space-y-4 sm:space-y-5 animate-pulse">
    <div className="bg-white/85 rounded-3xl border border-slate-200/80 p-5 sm:p-6 h-28 sm:h-32" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white/85 rounded-3xl border border-slate-200/80 h-24" />
      ))}
    </div>
    <div className="bg-white/85 rounded-3xl border border-slate-200/80 h-48" />
  </div>
);

const MainLayout: React.FC = () => {
  const { role, activeTab, setActiveTab, isAuthenticated, isLoadingAuth } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pageKey, setPageKey] = useState(0);

  // Automatically sanitize activeTab when role changes to prevent stuck tabs
  React.useEffect(() => {
    const validDeanTabs = ['dashboard', 'exams', 'teams', 'students', 'progress', 'analytics', 'reports', 'settings'];
    const validMentorTabs = ['dashboard', 'exams', 'my-team', 'students', 'progress'];
    const validStudentTabs = ['dashboard', 'exams', 'my-progress', 'problems', 'activity', 'profile'];

    if (role === 'DEAN' && !validDeanTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (role === 'MENTOR' && !validMentorTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (role === 'STUDENT' && !validStudentTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
    // Force re-mount on role change to clear any stale state
    setPageKey(prev => prev + 1);
  }, [role]);

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
        case 'exams':
          return <StudentExamsPage />;
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
        case 'exams':
          return <MentorExamsPage />;
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
        case 'exams':
          return <DeanExamsPage />;
        case 'teams':
          return <DeanTeamsPage />;
        case 'students':
          return <DeanStudentsPage />;
        case 'progress':
          return <DeanProgressPage />;
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

    // Fallback: role not yet determined — show loading instead of another role's dashboard
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading dashboard...</p>
        </div>
      </div>
    );
  };


  return (
    <div className="h-[100svh] bg-gradient-to-b from-slate-50 to-slate-100/70 text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Global Header — sticky at top */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace Body — flex row, fills remaining height with responsive wide container on PC */}
      <div className="flex-1 flex w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto min-w-0 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile Slide-out Drawer */}
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

        {/* Main Content Area — scrollable column with ample mobile bottom spacing */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 lg:p-8 pb-32 sm:pb-36 md:pb-8 touch-scroll-y">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${activeTab}-${pageKey}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-w-0"
            >
              <React.Suspense fallback={<PageSkeleton />}>
                {renderContent()}
              </React.Suspense>
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
