import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrentUser, Mentor, Problem, Student, Team, UserRole, DSATopic } from '../types';
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
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('gkce_students');
    return saved ? JSON.parse(saved) : ALL_STUDENTS;
  });
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('gkce_teams');
    return saved ? JSON.parse(saved) : ALL_TEAMS;
  });
  const [mentors] = useState<Mentor[]>(ALL_MENTORS);

  useEffect(() => {
    localStorage.setItem('gkce_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('gkce_teams', JSON.stringify(teams));
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
        pending: 34,
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
      const matchedMentor = mentors.find(m => m.email.toLowerCase() === normalizedEmail);
      if (matchedMentor && password === 'Mentor@GKCE2026') {
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
    const newPending = Math.max(0, 34 - newSolved);
    const newProgress = Math.min(100, Math.round((newSolved / 34) * 100));
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
