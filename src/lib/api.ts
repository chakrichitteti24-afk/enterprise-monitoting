/**
 * GKCE DSA Monitor — API Client for FastAPI Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

  if (response.status === 401) {
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

export async function getMeApi(): Promise<LoginResponse['user']> {
  return apiRequest<LoginResponse['user']>('/auth/me');
}
