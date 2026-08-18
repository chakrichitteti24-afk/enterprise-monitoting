import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrentUser, Mentor, Student, Team, UserRole } from '../types';
import {
  ALL_MENTORS,
  ALL_STUDENTS,
  ALL_TEAMS,
  DEAN_USER,
  DEFAULT_MENTOR_USER,
  DEFAULT_STUDENT_USER,
} from '../data/mockData';
import { getStoredToken, setStoredToken, clearStoredToken, loginApi, getMeApi } from '../lib/api';

interface AuthContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  role: UserRole;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  switchRole: (newRole: UserRole, targetId?: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  login: (role: UserRole, targetId?: string) => void;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  students: Student[];
  teams: Team[];
  mentors: Mentor[];
  addMentorFeedback: (studentId: string, note: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(DEAN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getStoredToken());
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [students, setStudents] = useState<Student[]>(ALL_STUDENTS);
  const [teams] = useState<Team[]>(ALL_TEAMS);
  const [mentors] = useState<Mentor[]>(ALL_MENTORS);

  // Restore session from token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }

      try {
        const me = await getMeApi();
        if (me && me.role) {
          mapAndSetUser(me.role, me);
          setIsAuthenticated(true);
        } else {
          clearStoredToken();
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Could not restore auth token, requiring login', err);
        clearStoredToken();
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const mapAndSetUser = (role: UserRole, userPayload?: any) => {
    setSelectedStudent(null);
    setSelectedTeam(null);
    setActiveTab('dashboard');

    if (role === 'DEAN') {
      setCurrentUser(DEAN_USER);
    } else if (role === 'MENTOR') {
      const teamNum = userPayload?.team_number || 'Team 07';
      const foundMentor = mentors.find(
        m => m.assignedTeamNumber === teamNum || m.email === userPayload?.email
      ) || DEFAULT_MENTOR_USER.mentorData!;

      setCurrentUser({
        id: foundMentor.id,
        name: userPayload?.name || foundMentor.name,
        email: userPayload?.email || foundMentor.email,
        role: 'MENTOR',
        title: 'Faculty Mentor, GKCE',
        avatar: userPayload?.avatar_url || foundMentor.avatar,
        mentorData: foundMentor,
        teamId: foundMentor.assignedTeamId,
        teamNumber: foundMentor.assignedTeamNumber,
      });
    } else if (role === 'STUDENT') {
      const rollNo = userPayload?.roll_number || '22CSE031';
      const foundStudent = students.find(
        s => s.rollNo === rollNo || s.email === userPayload?.email
      ) || DEFAULT_STUDENT_USER.studentData!;

      setCurrentUser({
        id: foundStudent.id,
        name: userPayload?.name || foundStudent.name,
        email: userPayload?.email || foundStudent.email,
        role: 'STUDENT',
        title: 'B.Tech Student, GKCE',
        avatar: userPayload?.avatar_url || foundStudent.avatar,
        studentData: foundStudent,
        teamId: foundStudent.teamId,
        teamNumber: foundStudent.teamNumber,
      });
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    const role = res.user.role as UserRole;
    mapAndSetUser(role, res.user);
    setIsAuthenticated(true);
  };

  const switchRole = (newRole: UserRole, targetId?: string) => {
    mapAndSetUser(newRole, { role: newRole });
  };

  const login = (role: UserRole, targetId?: string) => {
    mapAndSetUser(role, { role });
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearStoredToken();
    setIsAuthenticated(false);
    setSelectedStudent(null);
    setSelectedTeam(null);
    setActiveTab('dashboard');
    setCurrentUser(DEAN_USER);
  };

  const addMentorFeedback = (studentId: string, note: string) => {
    setStudents(prev =>
      prev.map(st => {
        if (st.id === studentId) {
          const notes = st.mentorFeedbackNotes || [];
          return {
            ...st,
            mentorFeedbackNotes: [
              {
                id: `note-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                author: currentUser.name,
                note,
              },
              ...notes,
            ],
          };
        }
        return st;
      })
    );
  };

  // Keyboard shortcut for Cmd/Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        role: currentUser.role,
        isAuthenticated,
        isLoadingAuth,
        switchRole,
        loginWithCredentials,
        login,
        logout,
        activeTab,
        setActiveTab,
        isSearchOpen,
        setIsSearchOpen,
        selectedStudent,
        setSelectedStudent,
        selectedTeam,
        setSelectedTeam,
        students,
        teams,
        mentors,
        addMentorFeedback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
