export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TaskList {
  tasks: Task[];
  total: number;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}
