import api from './api';
import authAPI from './auth';
import { Stack } from '../types';

function authHeader() {
  const token = authAPI.getAccess();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const stacksAPI = {
  async list(): Promise<Stack[]> {
    const res = await api.get('/stacks/', { headers: authHeader() });
    return res.data;
  },

  async create(payload: Pick<Stack, 'name'>): Promise<Stack> {
    const res = await api.post('/stacks/', payload, { headers: authHeader() });
    return res.data;
  },
};

export default stacksAPI;