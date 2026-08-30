/**
 * GKCE DSA Monitor — API Client for FastAPI Backend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'MENTOR' | 'DEAN';
    avatar_url?: string;
    student_id?: number | null;
    mentor_id?: number | null;
    team_id?: number | null;
    team_number?: string | null;
    roll_number?: string | null;
  };
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem('gkce_access_token');
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem('gkce_access_token', token);
  } catch (err) {
    console.error('Failed to save access token in localStorage', err);
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem('gkce_access_token');
  } catch (err) {
    console.error('Failed to clear access token from localStorage', err);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && endpoint !== '/auth/login') {
    // Only clear stored token on protected endpoint auth failure
    clearStoredToken();
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(data.access_token);
  return data;
}

export async function getMeApi(signal?: AbortSignal): Promise<LoginResponse['user']> {
  return apiRequest<LoginResponse['user']>('/auth/me', { signal });
}

// -------------------------------------------------------------
// Dean Administrative API Operations
// -------------------------------------------------------------
export async function createTeamApi(payload: { team_number: string; name: string; mentor_id?: number; mentor_name?: string }) {
  return apiRequest<any>('/dean/teams', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTeamApi(teamId: number, payload: { name?: string; mentor_id?: number; mentor_name?: string; status?: string }) {
  return apiRequest<any>(`/dean/teams/${teamId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteTeamApi(teamId: number) {
  return apiRequest<{ detail: string }>(`/dean/teams/${teamId}`, {
    method: 'DELETE',
  });
}

export async function createStudentApi(payload: {
  name: string;
  roll_number: string;
  email: string;
  team_id?: number;
  team_number?: string;
  password?: string;
  dsa_level?: string;
  status?: string;
}) {
  return apiRequest<any>('/dean/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createStudentAsMentorApi(payload: {
  name: string;
  roll_number: string;
  email: string;
  team_id?: number;
  team_number?: string;
  password?: string;
  dsa_level?: string;
  status?: string;
}) {
  return apiRequest<any>('/mentor/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateStudentApi(
  studentId: number,
  payload: {
    name?: string;
    roll_number?: string;
    email?: string;
    team_id?: number;
    team_number?: string;
    dsa_level?: string;
    status?: string;
  }
) {
  return apiRequest<any>(`/dean/students/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteStudentApi(studentId: number) {
  return apiRequest<{ detail: string }>(`/dean/students/${studentId}`, {
    method: 'DELETE',
  });
}

export async function createMentorApi(payload: {
  name: string;
  email: string;
  department?: string;
  phone?: string;
  experience_years?: number;
  assigned_team_id?: number;
  password?: string;
}) {
  return apiRequest<any>('/dean/mentors', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteMentorApi(mentorId: number) {
  return apiRequest<{ detail: string }>(`/dean/mentors/${mentorId}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------
// Student Self-Service API Operations
// -------------------------------------------------------------
export async function updateStudentAvatarApi(avatarUrl: string) {
  return apiRequest<any>('/student/me/avatar', {
    method: 'PUT',
    body: JSON.stringify({ avatar_url: avatarUrl }),
  });
}

export async function updateStudentProfileApi(payload: {
  github_username?: string;
  github_url?: string;
  leetcode_username?: string;
  avatar_url?: string;
}) {
  return apiRequest<any>('/student/me/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateStudentGithubApi(repoLink: string) {
  return apiRequest<any>('/student/me/github', {
    method: 'PUT',
    body: JSON.stringify({ github_url: repoLink, github_username: repoLink }),
  });
}

export async function addMentorNoteApi(studentId: number, note: string) {
  return apiRequest<any>(`/mentor/students/${studentId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export async function submitSolutionApi(payload: {
  problem_id: number;
  status: string;
  score?: number;
  runtime_ms?: number;
  memory_mb?: number;
  code_snippet?: string;
  language?: string;
}) {
  return apiRequest<any>('/submissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// -------------------------------------------------------------
// Weekly Exams Operations (Shared across all devices via Neon)
// -------------------------------------------------------------
export async function getWeeklyExamsApi() {
  return apiRequest<any[]>('/exams');
}

export async function createWeeklyExamApi(payload: any) {
  return apiRequest<any>('/dean/exams', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateWeeklyExamApi(examId: string, payload: any) {
  return apiRequest<any>(`/dean/exams/${examId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteWeeklyExamApi(examId: string) {
  return apiRequest<{ detail: string }>(`/dean/exams/${examId}`, {
    method: 'DELETE',
  });
}

export async function submitExamSolutionApi(examId: string, payload: any) {
  return apiRequest<any>(`/student/exams/${examId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// -------------------------------------------------------------
// Mentor Problem Verification Operations (Shared across all devices via Neon)
// -------------------------------------------------------------
export async function getVerificationsApi() {
  return apiRequest<Record<string, string[]>>('/mentor/verifications');
}

export async function toggleMentorVerificationApi(payload: {
  student_identifier: string;
  problem_id: string;
  verified: boolean;
  day_number?: number;
}) {
  return apiRequest<{ student_identifier: string; verified_problem_ids: string[] }>('/mentor/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function batchVerifyMentorApi(payload: {
  student_identifier: string;
  problem_ids: string[];
  verified: boolean;
  day_number?: number;
}) {
  return apiRequest<{ student_identifier: string; verified_problem_ids: string[] }>('/mentor/batch-verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyTeamProblemApi(payload: {
  team_identifier: string;
  problem_id: string;
  verified: boolean;
}) {
  return apiRequest<any>('/mentor/team-verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// -------------------------------------------------------------
// Real Code Execution Sandbox API
// -------------------------------------------------------------
export async function runCodeApi(payload: {
  code: string;
  language: string;
  test_cases: Array<{ id?: number; input: string; expectedOutput: string; isHidden?: boolean }>;
  entry_point?: string;
}) {
  return apiRequest<{
    status: string;
    passed_count: number;
    total_count: number;
    execution_time_ms: number;
    test_results: Array<{
      id: number;
      input: string;
      expected_output: string;
      actual_output: string;
      passed: boolean;
      execution_time_ms: number;
      status: string;
    }>;
    error?: string;
  }>('/code/run', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// -------------------------------------------------------------
// Cross-Device Sync: Fetch live data from backend on login
// -------------------------------------------------------------

/** Full student detail for the currently authenticated student */
export async function getStudentMeDetailApi() {
  return apiRequest<any>('/student/me');
}

/** All students (up to 200) for Dean */
export async function getDeanStudentsAllApi() {
  return apiRequest<{ items: any[]; total: number; page: number; limit: number }>(
    '/dean/students?page=1&limit=200'
  );
}

/** All teams for Dean */
export async function getDeanTeamsApi() {
  return apiRequest<any[]>('/dean/teams');
}

/** 5 students in the authenticated mentor's assigned team */
export async function getMentorTeamStudentsApi() {
  return apiRequest<any[]>('/mentor/team/students');
}

/** Mentor's own team detail (includes topic_performance, average_progress etc.) */
export async function getMentorTeamDetailApi() {
  return apiRequest<any>('/mentor/team');
}
