import axios from 'axios';
import authAPI from './auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor to handle 401 -> try refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await authAPI.refreshToken();
        // set new header
        const token = authAPI.getAccess();
        if (token) original.headers['Authorization'] = `Bearer ${token}`;
        return axios(original);
      } catch (e) {
        // failed to refresh -> logout
        try { await authAPI.logout(); } catch (_) {}
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
