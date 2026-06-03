import { useState } from 'react';
import { authApi } from '../lib/api';
import type { LoginRequest, RegisterRequest, User } from '../types';

function parseUserFromToken(token: string): Partial<User> | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (data: LoginRequest): Promise<void> => {
    const token = await authApi.login(data);
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
  };

  const register = async (data: RegisterRequest): Promise<User> => {
    const newUser = await authApi.register(data);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const saveUser = (u: User) => {
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  return { user, login, register, logout, saveUser };
}
