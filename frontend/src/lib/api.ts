import type { LoginRequest, RegisterRequest, Task, TaskList, TaskStatus, Token, User } from '../types';

const BASE_URL = 'http://localhost:8000';

function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Ошибка сервера' }));
    throw new Error(error.detail || 'Ошибка сервера');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const authApi = {
  login: (data: LoginRequest): Promise<Token> =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: data.username, password: data.password }),
    }),

  register: (data: RegisterRequest): Promise<User> =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const tasksApi = {
  getAll: (status?: TaskStatus): Promise<TaskList> => {
    const query = status ? `?status=${status}` : '';
    return request(`/tasks/${query}`);
  },

  create: (title: string): Promise<Task> =>
    request('/tasks/', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  update: (id: number, status: TaskStatus): Promise<Task> =>
    request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: number): Promise<void> =>
    request(`/tasks/${id}`, { method: 'DELETE' }),
};
