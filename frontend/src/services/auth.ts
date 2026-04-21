import api from './api';
import { User } from '../types';

const STORAGE_KEYS = {
  access: 'access',
  refresh: 'refresh',
  user: 'user',
};

export const authAPI = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login/', { email, password });
    const data = response.data;
    localStorage.setItem(STORAGE_KEYS.access, data.access);
    localStorage.setItem(STORAGE_KEYS.refresh, data.refresh);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user as User));
    return data;
  },

  async logout() {
    const refresh = localStorage.getItem(STORAGE_KEYS.refresh);
    if (refresh) {
      await api.post('/auth/logout/', { refresh });
    }
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.user);
  },

  async refreshToken() {
    const refresh = localStorage.getItem(STORAGE_KEYS.refresh);
    if (!refresh) throw new Error('No refresh token');
    const response = await api.post('/auth/refresh/', { refresh });
    const data = response.data;
    localStorage.setItem(STORAGE_KEYS.access, data.access);
    if (data.refresh) localStorage.setItem(STORAGE_KEYS.refresh, data.refresh);
    return data;
  },

  getAccess() {
    return localStorage.getItem(STORAGE_KEYS.access);
  },

  getUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  },
};

export default authAPI;
