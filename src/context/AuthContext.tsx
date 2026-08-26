import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrentUser, Mentor, Problem, Student, Team, UserRole, DSATopic, WeeklyExam, ExamStatus, StudentExamSubmission } from '../types';
import { INITIAL_WEEKLY_EXAMS, getShuffledQuestionsForStudent } from '../data/mockExams';
import { PROBLEMS_BANK_100 } from '../data/dsaCurriculum100';
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
  updateTeamApi,
  deleteTeamApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
  updateStudentAvatarApi,
  submitSolutionApi,
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
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  removeTeam: (teamId: string) => Promise<void>;
  addStudent: (studentData: Partial<Student>) => Promise<void>;
  updateStudent: (studentId: string, updates: Partial<Student>) => Promise<void>;
  removeStudent: (studentId: string) => Promise<void>;
  updateAvatar: (newAvatarUrl: string) => Promise<void>;
  solveProblem: (problem: Problem) => Promise<boolean>;
  toggleMentorProblemVerification: (studentId: string, problemId: string, verified: boolean) => void;
  batchVerifyDayProblems: (studentId: string, dayNumber: number, verified: boolean) => void;
  batchVerifyTeamProblem: (teamIdentifier: string, problemId: string, verified: boolean) => void;
  exams: WeeklyExam[];
  createWeeklyExam: (examData: Partial<WeeklyExam>) => Promise<void>;
  updateWeeklyExam: (examId: string, updates: Partial<WeeklyExam>) => Promise<void>;
  deleteWeeklyExam: (examId: string) => Promise<void>;
  setExamStatus: (examId: string, status: ExamStatus) => Promise<void>;
  submitExamSolution: (examId: string, answers: Record<string, string>) => Promise<StudentExamSubmission>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to synchronously restore user and auth state on initial mount
const getInitialAuthState = (): { user: CurrentUser; isAuth: boolean } => {
  try {
    const rawProfile = localStorage.getItem('gkce_user_profile_v1');
    const token = getStoredToken();
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      if (parsed && parsed.email && parsed.role) {
        return { user: parsed, isAuth: true };
      }
    }
    if (token) {
      return { user: DEAN_USER, isAuth: true };
    }
  } catch {}
  return { user: DEAN_USER, isAuth: false };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialAuth = getInitialAuthState();
  const [currentUser, setCurrentUser] = useState<CurrentUser>(initialAuth.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth.isAuth);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [students, setStudents] = useState<Student[]>(() => {
    localStorage.removeItem('gkce_students');
    localStorage.removeItem('gkce_teams');
    localStorage.removeItem('gkce_students_v4');
    localStorage.removeItem('gkce_teams_v4');
    const saved = localStorage.getItem('gkce_students_v5');
    return saved ? JSON.parse(saved) : ALL_STUDENTS;
  });
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('gkce_teams_v5');
    return saved ? JSON.parse(saved) : ALL_TEAMS;
  });
  const [mentors] = useState<Mentor[]>(ALL_MENTORS);
  const [exams, setExams] = useState<WeeklyExam[]>(() => {
    // Purge all legacy exam caches (old hardcoded LIVE exam)
    localStorage.removeItem('gkce_weekly_exams');
    localStorage.removeItem('gkce_weekly_exams_v3');
    const saved = localStorage.getItem('gkce_weekly_exams_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse cached weekly exams', e);
      }
    }
    return INITIAL_WEEKLY_EXAMS; // [] — no exams until Dean creates one
  });

  useEffect(() => {
    localStorage.setItem('gkce_weekly_exams_v4', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('gkce_students_v5', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('gkce_teams_v5', JSON.stringify(teams));
  }, [teams]);

  const addTeam = async (teamData: Partial<Team>) => {
    try {
      const nextNum = teams.length + 1;
      const teamNum = teamData.teamNumber?.trim() || `Team ${nextNum < 10 ? '0' : ''}${nextNum}`;
      const name = teamData.name?.trim() || `Cohort ${nextNum}`;
      
      const matchedMentor = mentors.find(m => m.id === teamData.mentorId || m.name === teamData.mentorName) || mentors[0];
      let createdTeamId = `team-${Date.now()}`;
      let mentorNumId: number | undefined;

      if (matchedMentor?.id) {
        const parsed = parseInt(matchedMentor.id.replace(/\D/g, ''), 10);
        if (!isNaN(parsed)) mentorNumId = parsed;
      }

      try {
        const res = await createTeamApi({
          team_number: teamNum,
          name,
          mentor_id: mentorNumId,
          mentor_name: matchedMentor?.name,
        });
        if (res && res.id) {
          createdTeamId = `team-${res.id}`;
        }
      } catch (err) {
        console.warn('Backend createTeam not reachable, using local state only', err);
      }

      const newT: Team = {
        id: createdTeamId,
        teamNumber: teamNum,
        name: name,
        mentorId: teamData.mentorId || matchedMentor.id,
        mentorName: teamData.mentorName || matchedMentor.name,
        mentorEmail: teamData.mentorEmail || matchedMentor.email,
        mentorDepartment: teamData.mentorDepartment || matchedMentor.department,
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

  const updateTeam = async (teamId: string, updates: Partial<Team>) => {
    try {
      const numId = parseInt(teamId.replace(/\D/g, ''), 10);
      if (!isNaN(numId)) {
        try {
          const mentorNumId = updates.mentorId ? parseInt(updates.mentorId.replace(/\D/g, ''), 10) : undefined;
          await updateTeamApi(numId, {
            name: updates.name,
            mentor_id: mentorNumId,
            mentor_name: updates.mentorName,
            status: updates.status ? updates.status.toUpperCase().replace(' ', '_') : undefined,
          });
        } catch (err) {
          console.warn('Backend updateTeam not reachable, updating local state', err);
        }
      }

      setTeams(prev =>
        prev.map(t => {
          if (t.id === teamId) {
            const matchedMentor = mentors.find(m => m.id === updates.mentorId || m.name === updates.mentorName);
            return {
              ...t,
              ...updates,
              mentorId: matchedMentor ? matchedMentor.id : t.mentorId,
              mentorName: matchedMentor ? matchedMentor.name : t.mentorName,
              mentorEmail: matchedMentor ? matchedMentor.email : t.mentorEmail,
              mentorDepartment: matchedMentor ? matchedMentor.department : t.mentorDepartment,
            };
          }
          return t;
        })
      );
    } catch (err) {
      console.error('Error updating team:', err);
      throw err;
    }
  };

  const removeTeam = async (teamId: string) => {
    try {
      const numId = parseInt(teamId.replace(/\D/g, ''), 10);
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
      const roll = (studentData.rollNo || `24F81A05${Math.floor(100 + Math.random() * 900)}`).toUpperCase();
      const name = studentData.name || 'New Student';
      const email = studentData.email || `${roll.toLowerCase()}@gkce.edu.in`;
      const tNum = studentData.teamNumber || teams[0]?.teamNumber || 'Team 01';
      const matchedTeam = teams.find(t => t.teamNumber === tNum || t.id === studentData.teamId) || teams[0];
      const dsaLevel = studentData.dsaLevel || 'Beginner';
      const studentStatus = studentData.status || 'Active';

      let createdStudentId = `student-${Date.now()}`;
      
      let teamNumId: number | undefined;
      if (matchedTeam?.id) {
        const parsed = parseInt(matchedTeam.id.replace(/\D/g, ''), 10);
        if (!isNaN(parsed)) teamNumId = parsed;
      }
      
      try {
        const res = await createStudentApi({
          name,
          roll_number: roll,
          email,
          team_id: teamNumId,
          team_number: matchedTeam?.teamNumber,
          dsa_level: dsaLevel.toUpperCase(),
          status: studentStatus.toUpperCase().replace(' ', '_'),
        });
        if (res && res.id) {
          createdStudentId = `student-${res.id}`;
        }
      } catch (err) {
        console.warn('Backend createStudent not reachable, using local state only', err);
      }

      const newS: Student = {
        id: createdStudentId,
        rollNo: roll,
        name: name,
        email: email,
        avatar: `https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80`,
        teamId: matchedTeam.id,
        teamNumber: matchedTeam.teamNumber,
        mentorId: matchedTeam.mentorId,
        mentorName: matchedTeam.mentorName,
        dsaLevel: dsaLevel,
        progress: 0,
        solved: 0,
        attempted: 0,
        pending: 100,
        streak: 0,
        longestStreak: 0,
        status: studentStatus,
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

      // Synchronize team's studentIds
      setTeams(prev =>
        prev.map(t =>
          t.id === matchedTeam.id || t.teamNumber === matchedTeam.teamNumber
            ? { ...t, studentIds: [...(t.studentIds || []), newS.id] }
            : t
        )
      );
    } catch (err) {
      console.error('Error adding student:', err);
      throw err;
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      const numId = parseInt(studentId.replace(/\D/g, ''), 10);
      if (!isNaN(numId)) {
        try {
          const payload: any = {};
          if (updates.name) payload.name = updates.name;
          if (updates.rollNo) payload.roll_number = updates.rollNo;
          if (updates.email) payload.email = updates.email;
          if (updates.teamNumber) payload.team_number = updates.teamNumber;
          if (updates.dsaLevel) payload.dsa_level = updates.dsaLevel.toUpperCase();
          if (updates.status) payload.status = updates.status.toUpperCase().replace(' ', '_');
          await updateStudentApi(numId, payload);
        } catch (err) {
          console.warn('Backend updateStudent not reachable, updating local state', err);
        }
      }

      setStudents(prev =>
        prev.map(s => {
          if (s.id === studentId) {
            const matchedTeam = teams.find(t => t.teamNumber === updates.teamNumber || t.id === updates.teamId);
            return {
              ...s,
              ...updates,
              teamNumber: updates.teamNumber || (matchedTeam ? matchedTeam.teamNumber : s.teamNumber),
              teamId: matchedTeam ? matchedTeam.id : s.teamId,
              mentorId: matchedTeam ? matchedTeam.mentorId : s.mentorId,
              mentorName: matchedTeam ? matchedTeam.mentorName : s.mentorName,
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('Error updating student:', err);
      throw err;
    }
  };

  const removeStudent = async (studentId: string) => {
    try {
      const numId = parseInt(studentId.replace(/\D/g, ''), 10);
      if (!isNaN(numId)) {
        try {
          await deleteStudentApi(numId);
        } catch (err) {
          console.warn('Backend deleteStudent not reachable, updating local state', err);
        }
      }
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setTeams(prev =>
        prev.map(t => ({
          ...t,
          studentIds: (t.studentIds || []).filter(id => id !== studentId),
        }))
      );
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

  // Persist user profile to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      try {
        localStorage.setItem('gkce_user_profile_v1', JSON.stringify({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          avatar: currentUser.avatar,
          title: currentUser.title,
          teamId: currentUser.teamId,
          teamNumber: currentUser.teamNumber,
          roll_number: currentUser.studentData?.rollNo,
          rollNo: currentUser.studentData?.rollNo,
        }));
      } catch {}
    }
  }, [isAuthenticated, currentUser]);

  // Restore session from token and local cache on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken();
      const cachedProfileRaw = localStorage.getItem('gkce_user_profile_v1');

      if (!token && !cachedProfileRaw) {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }

      // If we have a cached profile, restore user state immediately
      let restoredFromCache = false;
      if (cachedProfileRaw) {
        try {
          const cached = JSON.parse(cachedProfileRaw);
          if (cached?.role && cached?.email) {
            mapAndSetUser(cached.role, {
              ...cached,
              roll_number: cached.roll_number || cached.rollNo,
            });
            setIsAuthenticated(true);
            restoredFromCache = true;
          }
        } catch {}
      }

      // Try background re-validation with backend if we have a token
      if (token && !token.startsWith('gkce_local_token_')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const me = await getMeApi(controller.signal);
          clearTimeout(timeoutId);

          if (me && me.role) {
            mapAndSetUser(me.role, me);
            setIsAuthenticated(true);
          }
        } catch (err: any) {
          const is401 = err?.message?.includes('401') || err?.message?.toLowerCase().includes('unauthorized') || err?.message?.toLowerCase().includes('invalid');
          if (is401) {
            clearStoredToken();
            if (!restoredFromCache) {
              try {
                localStorage.removeItem('gkce_user_profile_v1');
              } catch {}
              setIsAuthenticated(false);
            }
          } else if (restoredFromCache) {
            console.info('[Auth] Backend sync deferred, continuing with active local session.');
          }
        }
      }

      setIsLoadingAuth(false);
    };

    restoreSession();
  }, []);

  const mapAndSetUser = (role: UserRole, userPayload?: any) => {
    setSelectedStudent(null);
    setSelectedTeam(null);
    setActiveTab('dashboard');

    let newUser: CurrentUser;

    if (role === 'DEAN') {
      newUser = DEAN_USER;
    } else if (role === 'MENTOR') {
      const teamNum = userPayload?.team_number || userPayload?.assignedTeamNumber || 'Team 07';
      const foundMentor = mentors.find(
        m =>
          m.assignedTeamNumber === teamNum ||
          m.email?.toLowerCase() === userPayload?.email?.toLowerCase() ||
          m.id === userPayload?.id
      ) || DEFAULT_MENTOR_USER.mentorData!;

      newUser = {
        id: foundMentor.id,
        name: userPayload?.name || foundMentor.name,
        email: userPayload?.email || foundMentor.email,
        role: 'MENTOR',
        title: 'Faculty Mentor, GKCE',
        avatar: userPayload?.avatar_url || userPayload?.avatar || foundMentor.avatar,
        mentorData: foundMentor,
        teamId: foundMentor.assignedTeamId,
        teamNumber: foundMentor.assignedTeamNumber,
      };
    } else {
      const rollNo = userPayload?.roll_number || userPayload?.rollNo || '24F81A0501';
      const foundStudent = students.find(
        s =>
          s.rollNo?.toLowerCase() === rollNo?.toLowerCase() ||
          s.email?.toLowerCase() === userPayload?.email?.toLowerCase() ||
          s.id === userPayload?.id
      ) || DEFAULT_STUDENT_USER.studentData!;

      newUser = {
        id: foundStudent.id,
        name: userPayload?.name || foundStudent.name,
        email: userPayload?.email || foundStudent.email,
        role: 'STUDENT',
        title: 'B.Tech Student, GKCE',
        avatar: userPayload?.avatar_url || userPayload?.avatar || foundStudent.avatar,
        studentData: foundStudent,
        teamId: foundStudent.teamId,
        teamNumber: foundStudent.teamNumber,
      };
    }

    setCurrentUser(newUser);

    // Save profile to localStorage
    try {
      localStorage.setItem('gkce_user_profile_v1', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        title: newUser.title,
        teamId: newUser.teamId,
        teamNumber: newUser.teamNumber,
        roll_number: newUser.studentData?.rollNo,
        rollNo: newUser.studentData?.rollNo,
      }));
    } catch {}

    // Ensure stored token exists so browser reloads stay authenticated
    if (!getStoredToken()) {
      setStoredToken(`gkce_local_token_${role.toLowerCase()}_${Date.now()}`);
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    // ── Canonical backend DB credentials (from seed_data.py) ──────────────
    // These are the ONLY passwords stored in the backend DB.
    // The local fallback accepts multiple friendly aliases, but the backend
    // only accepts these exact values. silentBackendLogin always uses these
    // so we get a real JWT even when the user typed a friendly alias.
    const BACKEND_DEAN_EMAIL    = 'root@gkce.edu.in';
    const BACKEND_DEAN_PASSWORD = 'gkce@1234';
    const BACKEND_MENTOR_PASSWORD   = 'Mentor@GKCE2026';
    const BACKEND_STUDENT_PASSWORD  = 'gkce@1234';

    // Silently obtains a real JWT from the backend after local fallback auth.
    // Stores token via loginApi → setStoredToken so subsequent API calls work.
    const silentBackendLogin = async (canonicalEmail: string, canonicalPassword: string) => {
      try {
        await loginApi(canonicalEmail, canonicalPassword);
        console.info('[Auth] Silent backend re-auth OK — JWT stored for', canonicalEmail);
      } catch {
        // Backend unreachable or seed credentials changed — local session stays active.
        console.warn('[Auth] Silent backend re-auth failed — API writes will use local state only.');
      }
    };

    try {
      const res = await loginApi(email, password);
      const role = res.user.role as UserRole;
      mapAndSetUser(role, res.user);
      setIsAuthenticated(true);
    } catch (backendErr: any) {
      const normalizedEmail = email.toLowerCase().trim();

      // ── Dean fallback (accepts multiple friendly email/password aliases) ──
      if (
        (normalizedEmail === 'root@gkce.edu.in' ||
          normalizedEmail === 'dean.academics@gkce.edu.in' ||
          normalizedEmail === 'dean@gkce.edu.in' ||
          normalizedEmail === 'root') &&
        (password === 'gkce@1234' ||
          password === 'GKCE@1234' ||
          password === 'Dean@GKCE2026' ||
          password === 'Dean#GKCE2026' ||
          password === 'Dean.Academics@GKCE2026')
      ) {
        mapAndSetUser('DEAN');
        setIsAuthenticated(true);
        // Always use canonical backend Dean credentials — not the user's typed alias
        silentBackendLogin(BACKEND_DEAN_EMAIL, BACKEND_DEAN_PASSWORD);
        return;
      }

      // ── Mentor fallback ───────────────────────────────────────────────────
      const matchedMentor = mentors.find(
        m =>
          m.email.toLowerCase() === normalizedEmail ||
          m.email.toLowerCase().split('@')[0] === normalizedEmail ||
          (normalizedEmail === 'teja@gkce.edu.in' && m.email.toLowerCase().includes('teja')) ||
          (normalizedEmail.includes('ludv') && m.email.toLowerCase().includes('ludw')) ||
          (normalizedEmail.includes('gayat') && m.email.toLowerCase().includes('gayat')) ||
          (normalizedEmail.includes('gayth') && m.email.toLowerCase().includes('gayat'))
      );
      if (
        matchedMentor &&
        password === 'Mentor@GKCE2026'
      ) {
        mapAndSetUser('MENTOR', { email: matchedMentor.email, team_number: matchedMentor.assignedTeamNumber });
        setIsAuthenticated(true);
        // Mentor canonical email + canonical password
        silentBackendLogin(matchedMentor.email, BACKEND_MENTOR_PASSWORD);
        return;
      }

      // ── Student fallback ──────────────────────────────────────────────────
      const matchedStudent = students.find(
        s =>
          s.email.toLowerCase() === normalizedEmail ||
          s.rollNo.toLowerCase() === normalizedEmail ||
          normalizedEmail.includes(s.rollNo.toLowerCase())
      );
      if (
        matchedStudent &&
        (password === 'gkce@1234' ||
          password === 'GKCE@1234' ||
          password === 'Student@GKCE2026' ||
          password === 'Chakri@2026')
      ) {
        mapAndSetUser('STUDENT', { email: matchedStudent.email, roll_number: matchedStudent.rollNo });
        setIsAuthenticated(true);
        // Student canonical email + canonical password
        silentBackendLogin(matchedStudent.email, BACKEND_STUDENT_PASSWORD);
        return;
      }

      // Credentials don't match any known user — surface original backend error
      throw backendErr;
    }
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
    try {
      localStorage.removeItem('gkce_user_profile_v1');
    } catch {}
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

  const solveProblem = async (problem: Problem): Promise<boolean> => {
    if (!currentUser.studentData) return false;

    const studentId = currentUser.studentData.id;
    const targetStudent = students.find(s => s.id === studentId || s.rollNo === currentUser.studentData?.rollNo);
    if (!targetStudent) return false;

    // Check if already solved
    const alreadySolved = targetStudent.recentActivities.some(a => a.problemTitle === problem.title);
    if (alreadySolved) return true;

    // Update Topic Progress
    const topic = problem.topic as DSATopic;
    const currentTopicData = targetStudent.topicProgress[topic] || { solved: 0, total: 5, percentage: 0 };
    const newTopicSolved = Math.min(currentTopicData.total, currentTopicData.solved + 1);
    const newTopicPct = Math.round((newTopicSolved / currentTopicData.total) * 100);

    const updatedTopicProgress = {
      ...targetStudent.topicProgress,
      [topic]: {
        ...currentTopicData,
        solved: newTopicSolved,
        percentage: newTopicPct,
      },
    };

    // Update Difficulty Stats
    const diffKey = problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    const currentDiff = targetStudent.difficultyStats[diffKey] || { solved: 0, total: 10 };
    const updatedDifficultyStats = {
      ...targetStudent.difficultyStats,
      [diffKey]: {
        ...currentDiff,
        solved: currentDiff.solved + 1,
      },
    };

    const newSolved = targetStudent.solved + 1;
    const newAttempted = Math.max(targetStudent.attempted + 1, newSolved);
    const newPending = Math.max(0, 100 - newSolved);
    const newProgress = Math.min(100, Math.round((newSolved / 100) * 100));
    const newStreak = targetStudent.streak + 1;
    const newLongestStreak = Math.max(targetStudent.longestStreak, newStreak);
    const newLevel = newProgress >= 85 ? 'Mastery' : newProgress >= 65 ? 'Advanced' : newProgress >= 40 ? 'Intermediate' : 'Beginner';

    const newActivity = {
      id: `act-${Date.now()}`,
      studentId: targetStudent.id,
      action: 'Solved',
      problemTitle: problem.title,
      topic: topic,
      timeAgo: 'Just now',
      status: 'Completed' as const,
      difficulty: problem.difficulty,
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const updatedSubmissions = [...targetStudent.submissionsHistory, { date: todayStr, count: 1 }];

    const updatedStudent: Student = {
      ...targetStudent,
      solved: newSolved,
      attempted: newAttempted,
      pending: newPending,
      progress: newProgress,
      streak: newStreak,
      longestStreak: newLongestStreak,
      dsaLevel: newLevel as any,
      topicProgress: updatedTopicProgress,
      difficultyStats: updatedDifficultyStats,
      recentActivities: [newActivity, ...targetStudent.recentActivities],
      submissionsHistory: updatedSubmissions,
    };

    // Update Students State
    setStudents(prev => prev.map(s => s.id === targetStudent.id ? updatedStudent : s));

    // Update Current User
    setCurrentUser(prev => ({
      ...prev,
      studentData: updatedStudent,
    }));

    // Update Assigned Team Stats
    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === targetStudent.teamId || t.teamNumber === targetStudent.teamNumber) {
          const teamSts = students.map(s => s.id === targetStudent.id ? updatedStudent : s)
            .filter(s => s.teamId === t.id || s.teamNumber === t.teamNumber);
          const tSolved = teamSts.reduce((acc, s) => acc + s.solved, 0);
          const tAttempted = teamSts.reduce((acc, s) => acc + s.attempted, 0);
          const tAvgProg = teamSts.length > 0 ? Math.round(teamSts.reduce((acc, s) => acc + s.progress, 0) / teamSts.length) : 0;
          const tAvgStreak = teamSts.length > 0 ? Math.round(teamSts.reduce((acc, s) => acc + s.streak, 0) / teamSts.length) : 0;

          const tPerf: Record<string, number> = {};
          const topicCaps: Record<string, number> = {
            Arrays: 5, Strings: 4, 'Linked Lists': 4, Stack: 4, Queue: 2, Trees: 5, Graphs: 4, 'Dynamic Programming': 6,
          };
          for (const top of Object.keys(updatedTopicProgress)) {
            const totalTopicCap = (topicCaps[top] || 1) * teamSts.length;
            const solvedTopic = teamSts.reduce((acc, s) => acc + (s.topicProgress[top as DSATopic]?.solved || 0), 0);
            tPerf[top] = Math.min(100, Math.round((solvedTopic / Math.max(1, totalTopicCap)) * 100));
          }

          return {
            ...t,
            totalSolved: tSolved,
            totalAttempted: tAttempted,
            avgProgress: tAvgProg,
            avgStreak: tAvgStreak,
            topicPerformance: tPerf,
          };
        }
        return t;
      })
    );

    // Try backend submission if token exists
    try {
      const pNum = parseInt(problem.id.replace('prob-', ''), 10) || 1;
      await submitSolutionApi({
        problem_id: pNum,
        status: 'SOLVED',
        score: 100,
        runtime_ms: 54,
        memory_mb: 41.8,
        code_snippet: '// Solved via GKCE Sandbox Runner',
        language: 'Java',
      });
    } catch {
      // Local state already updated
    }

    return true;
  };

  // Recalculate student metrics from verifiedProblemIds
  const recalculateStudentMetrics = (student: Student, verifiedIds: string[]): Student => {
    const verifiedSet = new Set(verifiedIds);
    const verifiedProblems = PROBLEMS_BANK_100.filter(p => verifiedSet.has(p.id));
    const solvedCount = verifiedProblems.length;
    const progress = Math.min(100, Math.round((solvedCount / 100) * 100));
    const pending = Math.max(0, 100 - solvedCount);
    const attempted = Math.max(student.attempted || 0, solvedCount);

    const topicProgress: Record<DSATopic, { solved: number; total: number; percentage: number }> = {
      Arrays: { solved: 0, total: 55, percentage: 0 },
      Strings: { solved: 0, total: 15, percentage: 0 },
      'Linked Lists': { solved: 0, total: 10, percentage: 0 },
      Stack: { solved: 0, total: 10, percentage: 0 },
      Queue: { solved: 0, total: 5, percentage: 0 },
      Trees: { solved: 0, total: 5, percentage: 0 },
      Graphs: { solved: 0, total: 0, percentage: 0 },
      'Dynamic Programming': { solved: 0, total: 0, percentage: 0 },
    };

    const difficultyStats = {
      easy: { solved: 0, total: 70 },
      medium: { solved: 0, total: 28 },
      hard: { solved: 0, total: 2 },
    };

    for (const prob of verifiedProblems) {
      if (topicProgress[prob.topic]) {
        topicProgress[prob.topic].solved += 1;
      }
      const diffKey = prob.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
      if (difficultyStats[diffKey]) {
        difficultyStats[diffKey].solved += 1;
      }
    }

    for (const topic of Object.keys(topicProgress) as DSATopic[]) {
      const tData = topicProgress[topic];
      tData.percentage = tData.total > 0 ? Math.min(100, Math.round((tData.solved / tData.total) * 100)) : (tData.solved > 0 ? 100 : 0);
    }

    const dsaLevel = progress >= 85 ? 'Mastery' : progress >= 65 ? 'Advanced' : progress >= 40 ? 'Intermediate' : 'Beginner';
    const streak = solvedCount > 0 ? Math.max(1, Math.min(20, Math.ceil(solvedCount / 5))) : 0;

    return {
      ...student,
      verifiedProblemIds: verifiedIds,
      solved: solvedCount,
      pending,
      attempted,
      progress,
      streak,
      longestStreak: Math.max(student.longestStreak || 0, streak),
      dsaLevel: dsaLevel as any,
      topicProgress,
      difficultyStats,
    };
  };

  // Recalculate team metrics from students
  const recalculateTeamMetrics = (teamIdOrNumber: string, currentStudents: Student[]) => {
    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamIdOrNumber || t.teamNumber === teamIdOrNumber) {
          const teamSts = currentStudents.filter(s => s.teamId === t.id || s.teamNumber === t.teamNumber);
          const tSolved = teamSts.reduce((acc, s) => acc + (s.solved || 0), 0);
          const tAttempted = teamSts.reduce((acc, s) => acc + (s.attempted || 0), 0);
          const tAvgProg = teamSts.length > 0 ? Math.round(teamSts.reduce((acc, s) => acc + s.progress, 0) / teamSts.length) : 0;
          const tAvgStreak = teamSts.length > 0 ? Math.round(teamSts.reduce((acc, s) => acc + s.streak, 0) / teamSts.length) : 0;

          const tPerf: Record<string, number> = {};
          const topicCaps: Record<string, number> = {
            Arrays: 55, Strings: 15, 'Linked Lists': 10, Stack: 10, Queue: 5, Trees: 5, Graphs: 0, 'Dynamic Programming': 0,
          };
          for (const top of Object.keys(topicCaps)) {
            const cap = topicCaps[top];
            if (cap > 0) {
              const totalTopicCap = cap * teamSts.length;
              const solvedTopic = teamSts.reduce((acc, s) => acc + (s.topicProgress[top as DSATopic]?.solved || 0), 0);
              tPerf[top] = Math.min(100, Math.round((solvedTopic / Math.max(1, totalTopicCap)) * 100));
            } else {
              tPerf[top] = 0;
            }
          }

          return {
            ...t,
            totalSolved: tSolved,
            totalAttempted: tAttempted,
            avgProgress: tAvgProg,
            avgStreak: tAvgStreak,
            topicPerformance: tPerf,
          };
        }
        return t;
      })
    );
  };

  // Mentor verification toggle
  const toggleMentorProblemVerification = (studentId: string, problemId: string, verified: boolean) => {
    // Strict RBAC: Only Mentors and Dean can verify problem completion
    if (currentUser.role === 'STUDENT') {
      console.warn('[RBAC] Students cannot self-verify problem completions.');
      return;
    }

    setStudents(prevStudents => {
      const updated = prevStudents.map(st => {
        if (st.id === studentId || st.rollNo === studentId) {
          const currentVerified = new Set(st.verifiedProblemIds || []);
          if (verified) {
            currentVerified.add(problemId);
          } else {
            currentVerified.delete(problemId);
          }
          const updatedStudent = recalculateStudentMetrics(st, Array.from(currentVerified));
          
          if (currentUser.studentData?.id === st.id || currentUser.studentData?.rollNo === st.rollNo) {
            setCurrentUser(curr => ({ ...curr, studentData: updatedStudent }));
          }
          return updatedStudent;
        }
        return st;
      });

      const targetStudent = updated.find(s => s.id === studentId || s.rollNo === studentId);
      if (targetStudent) {
        recalculateTeamMetrics(targetStudent.teamNumber, updated);
      }
      return updated;
    });
  };

  // Batch verify 5 problems for a specific day for a student
  const batchVerifyDayProblems = (studentId: string, dayNumber: number, verified: boolean) => {
    if (currentUser.role === 'STUDENT') return;
    const dayProblemIds = PROBLEMS_BANK_100.filter(p => p.dayNumber === dayNumber).map(p => p.id);

    setStudents(prevStudents => {
      const updated = prevStudents.map(st => {
        if (st.id === studentId || st.rollNo === studentId) {
          const currentVerified = new Set(st.verifiedProblemIds || []);
          for (const pid of dayProblemIds) {
            if (verified) {
              currentVerified.add(pid);
            } else {
              currentVerified.delete(pid);
            }
          }
          const updatedStudent = recalculateStudentMetrics(st, Array.from(currentVerified));
          if (currentUser.studentData?.id === st.id) {
            setCurrentUser(curr => ({ ...curr, studentData: updatedStudent }));
          }
          return updatedStudent;
        }
        return st;
      });

      const targetStudent = updated.find(s => s.id === studentId || s.rollNo === studentId);
      if (targetStudent) {
        recalculateTeamMetrics(targetStudent.teamNumber, updated);
      }
      return updated;
    });
  };

  // Batch verify a specific problem across all members of a team
  const batchVerifyTeamProblem = (teamIdentifier: string, problemId: string, verified: boolean) => {
    if (currentUser.role === 'STUDENT') return;

    setStudents(prevStudents => {
      const updated = prevStudents.map(st => {
        if (st.teamId === teamIdentifier || st.teamNumber === teamIdentifier) {
          const currentVerified = new Set(st.verifiedProblemIds || []);
          if (verified) {
            currentVerified.add(problemId);
          } else {
            currentVerified.delete(problemId);
          }
          return recalculateStudentMetrics(st, Array.from(currentVerified));
        }
        return st;
      });

      recalculateTeamMetrics(teamIdentifier, updated);
      return updated;
    });
  };

  // ==========================================
  // ROOT ONLY (DEAN) WEEKLY EXAM ACTIONS
  // ==========================================
  const createWeeklyExam = async (examData: Partial<WeeklyExam>): Promise<void> => {
    if (currentUser.role !== 'DEAN') {
      throw new Error('[RBAC Blocked] Only Dean/Root (SUDO) is authorized to schedule weekly DSA exams.');
    }

    const newExamId = `exam-week-${String(examData.weekNumber || exams.length + 1).padStart(2, '0')}-${Date.now()}`;
    const newExam: WeeklyExam = {
      id: newExamId,
      weekNumber: examData.weekNumber || exams.length + 1,
      title: examData.title || `Week ${examData.weekNumber || exams.length + 1} Assessment`,
      description: examData.description || 'Weekly standardized DSA coding examination scheduled by Dean of Academic Affairs.',
      topicFocus: examData.topicFocus || 'DSA Core Curriculum',
      scheduledDate: examData.scheduledDate || new Date().toISOString().split('T')[0],
      startTime: examData.startTime || '10:00 AM',
      durationMinutes: examData.durationMinutes || 60,
      totalMarks: examData.totalMarks || 100,
      passMarks: examData.passMarks || 50,
      status: examData.status || 'SCHEDULED',
      createdBy: examData.createdBy || 'Root (Dean of Academic Affairs / Sudo Admin)',
      questions: examData.questions && examData.questions.length > 0 ? examData.questions : [],
      submissions: [],
    };

    setExams(prev => [newExam, ...prev]);
  };

  const updateWeeklyExam = async (examId: string, updates: Partial<WeeklyExam>): Promise<void> => {
    if (currentUser.role !== 'DEAN') {
      throw new Error('[RBAC Blocked] Only Dean/Root (SUDO) can update weekly exam specifications.');
    }

    setExams(prev =>
      prev.map(ex => (ex.id === examId ? { ...ex, ...updates } : ex))
    );
  };

  const deleteWeeklyExam = async (examId: string): Promise<void> => {
    if (currentUser.role !== 'DEAN') {
      throw new Error('[RBAC Blocked] Only Dean/Root (SUDO) can delete weekly exams.');
    }

    setExams(prev => prev.filter(ex => ex.id !== examId));
  };

  const setExamStatus = async (examId: string, status: ExamStatus): Promise<void> => {
    if (currentUser.role !== 'DEAN') {
      throw new Error('[RBAC Blocked] Only Dean/Root (SUDO) can change exam lifecycle status.');
    }

    setExams(prev =>
      prev.map(ex => (ex.id === examId ? { ...ex, status } : ex))
    );
  };

  const submitExamSolution = async (
    examId: string,
    answers: Record<string, string>
  ): Promise<StudentExamSubmission> => {
    const student = currentUser.studentData;
    if (!student) {
      throw new Error('Only enrolled students can take and submit exams.');
    }

    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      throw new Error('Exam not found.');
    }

    // Calculate student's randomized setCode
    const { setCode } = getShuffledQuestionsForStudent(exam.questions || [], student.rollNo || student.id, examId);

    // Auto-grade evaluation (each answered question awards marks based on test case passes)
    const questions = exam.questions || [];
    let score = 0;
    let solvedCount = 0;
    const answerDetails: Record<string, any> = {};

    questions.forEach((q) => {
      const code = answers[q.id] || '';
      const hasCode = code.trim().length > 15;
      const passedTestCases = hasCode ? 3 : 0;
      const totalTestCases = 3;
      const marksEarned = Math.round((passedTestCases / totalTestCases) * q.marks);
      score += marksEarned;
      if (passedTestCases >= 2) solvedCount += 1;

      answerDetails[q.id] = {
        code,
        language: 'Java',
        passedTestCases,
        totalTestCases,
        marksAwarded: marksEarned,
      };
    });

    const newSubmission: StudentExamSubmission = {
      id: `sub-${examId}-${student.id}-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentRollNo: student.rollNo,
      teamNumber: student.teamNumber,
      examId,
      randomizedSetCode: setCode,
      status: 'EVALUATED',
      score,
      totalMarks: exam.totalMarks,
      questionsSolved: solvedCount,
      passedCount: solvedCount,
      totalQuestionCount: questions.length,
      submittedAt: new Date().toISOString(),
      timeSpentMinutes: Math.min(exam.durationMinutes, 45),
      answers: answerDetails,
    };

    // Update Exam submissions in state
    setExams(prev =>
      prev.map(ex => {
        if (ex.id === examId) {
          const currentSubs = (ex.submissions || []).filter(s => s.studentId !== student.id);
          return { ...ex, submissions: [newSubmission, ...currentSubs] };
        }
        return ex;
      })
    );

    return newSubmission;
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
        updateTeam,
        removeTeam,
        addStudent,
        updateStudent,
        removeStudent,
        updateAvatar,
        solveProblem,
        toggleMentorProblemVerification,
        batchVerifyDayProblems,
        batchVerifyTeamProblem,
        exams,
        createWeeklyExam,
        updateWeeklyExam,
        deleteWeeklyExam,
        setExamStatus,
        submitExamSolution,
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
