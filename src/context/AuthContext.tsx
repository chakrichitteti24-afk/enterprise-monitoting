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
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  loginApi,
  getMeApi,
  createTeamApi,
  deleteTeamApi,
  createStudentApi,
  deleteStudentApi,
  updateStudentAvatarApi,
} from '../lib/api';

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
  addTeam: (teamData: Partial<Team>) => Promise<void>;
  removeTeam: (teamId: string) => Promise<void>;
  addStudent: (studentData: Partial<Student>) => Promise<void>;
  removeStudent: (studentId: string) => Promise<void>;
  updateAvatar: (newAvatarUrl: string) => Promise<void>;
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
  const [teams, setTeams] = useState<Team[]>(ALL_TEAMS);
  const [mentors] = useState<Mentor[]>(ALL_MENTORS);

  const addTeam = async (teamData: Partial<Team>) => {
    try {
      const teamNum = teamData.teamNumber || `Team ${teams.length + 1 < 10 ? '0' : ''}${teams.length + 1}`;
      const name = teamData.name || `Cohort ${teams.length + 1}`;
      
      // Try backend if token exists
      try {
        await createTeamApi({ team_number: teamNum, name });
      } catch (err) {
        console.warn('Backend createTeam not reachable, updating local state', err);
      }

      const newT: Team = {
        id: `team-${Date.now()}`,
        teamNumber: teamNum,
        name: name,
        mentorId: teamData.mentorId || 'mentor-1',
        mentorName: teamData.mentorName || 'Dr. K. Suresh Kumar',
        mentorEmail: teamData.mentorEmail || 'suresh.kumar@gkce.edu.in',
        mentorDepartment: teamData.mentorDepartment || 'Computer Science & Engg',
        studentIds: [],
        avgProgress: 0,
        totalSolved: 0,
        totalAttempted: 0,
        avgStreak: 0,
        status: 'Active',
        topicPerformance: {
          Arrays: 0,
          Strings: 0,
          'Linked Lists': 0,
          Stack: 0,
          Queue: 0,
          Trees: 0,
          Graphs: 0,
          'Dynamic Programming': 0,
        },
        rank: teams.length + 1,
      };

      setTeams(prev => [...prev, newT]);
    } catch (err) {
      console.error('Error adding team:', err);
      throw err;
    }
  };

  const removeTeam = async (teamId: string) => {
    try {
      const numId = parseInt(teamId.replace('team-', ''), 10);
      if (!isNaN(numId)) {
        try {
          await deleteTeamApi(numId);
        } catch (err) {
          console.warn('Backend deleteTeam not reachable, updating local state', err);
        }
      }
      setTeams(prev => prev.filter(t => t.id !== teamId));
    } catch (err) {
      console.error('Error removing team:', err);
      throw err;
    }
  };

  const addStudent = async (studentData: Partial<Student>) => {
    try {
      const roll = studentData.rollNo || `24F81A05${Math.floor(100 + Math.random() * 900)}`;
      const name = studentData.name || 'New Student';
      const email = studentData.email || `${roll.toLowerCase()}@gkce.edu.in`;
      const tNum = studentData.teamNumber || 'Team 01';
      const matchedTeam = teams.find(t => t.teamNumber === tNum) || teams[0];

      try {
        const teamNumId = parseInt(matchedTeam.id.replace('team-', ''), 10) || 1;
        await createStudentApi({
          name,
          roll_number: roll,
          email,
          team_id: teamNumId,
          dsa_level: (studentData.dsaLevel as any) || 'BEGINNER',
          status: 'ACTIVE',
        });
      } catch (err) {
        console.warn('Backend createStudent not reachable, updating local state', err);
      }

      const newS: Student = {
        id: `student-${Date.now()}`,
        rollNo: roll,
        name: name,
        email: email,
        avatar: `https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80`,
        teamId: matchedTeam.id,
        teamNumber: matchedTeam.teamNumber,
        mentorId: matchedTeam.mentorId,
        mentorName: matchedTeam.mentorName,
        dsaLevel: studentData.dsaLevel || 'Beginner',
        progress: 0,
        solved: 0,
        attempted: 0,
        pending: 34,
        streak: 0,
        longestStreak: 0,
        status: 'Active',
        topicProgress: {
          Arrays: { solved: 0, total: 5, percentage: 0 },
          Strings: { solved: 0, total: 4, percentage: 0 },
          'Linked Lists': { solved: 0, total: 4, percentage: 0 },
          Stack: { solved: 0, total: 4, percentage: 0 },
          Queue: { solved: 0, total: 2, percentage: 0 },
          Trees: { solved: 0, total: 5, percentage: 0 },
          Graphs: { solved: 0, total: 4, percentage: 0 },
          'Dynamic Programming': { solved: 0, total: 6, percentage: 0 },
        },
        difficultyStats: {
          easy: { solved: 0, total: 11 },
          medium: { solved: 0, total: 14 },
          hard: { solved: 0, total: 9 },
        },
        recentActivities: [],
        submissionsHistory: [],
        mentorFeedbackNotes: [],
      };

      setStudents(prev => [newS, ...prev]);
    } catch (err) {
      console.error('Error adding student:', err);
      throw err;
    }
  };

  const removeStudent = async (studentId: string) => {
    try {
      const numId = parseInt(studentId.replace('student-', ''), 10);
      if (!isNaN(numId)) {
        try {
          await deleteStudentApi(numId);
        } catch (err) {
          console.warn('Backend deleteStudent not reachable, updating local state', err);
        }
      }
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (err) {
      console.error('Error removing student:', err);
      throw err;
    }
  };

  const updateAvatar = async (newAvatarUrl: string) => {
    try {
      if (currentUser.role === 'STUDENT') {
        try {
          await updateStudentAvatarApi(newAvatarUrl);
        } catch (err) {
          console.warn('Backend updateStudentAvatarApi failed, updating local state', err);
        }
      }

      setCurrentUser(prev => {
        const updated = { ...prev, avatar: newAvatarUrl };
        if (updated.studentData) {
          updated.studentData = { ...updated.studentData, avatar: newAvatarUrl };
        }
        return updated;
      });

      if (currentUser.studentData) {
        const sId = currentUser.studentData.id;
        setStudents(prev =>
          prev.map(s => (s.id === sId || s.rollNo === currentUser.studentData?.rollNo ? { ...s, avatar: newAvatarUrl } : s))
        );
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      throw err;
    }
  };

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
        addTeam,
        removeTeam,
        addStudent,
        removeStudent,
        updateAvatar,
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
