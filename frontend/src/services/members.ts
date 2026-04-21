import api from './api';
import authAPI from './auth';
import { Member } from '../types';

function authHeader() {
  const token = authAPI.getAccess();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const membersAPI = {
  async list(): Promise<Member[]> {
    const res = await api.get('/members/', { headers: authHeader() });
    return res.data;
  },

  async retrieve(id: number): Promise<Member> {
    const res = await api.get(`/members/${id}/`, { headers: authHeader() });
    return res.data;
  },

  async create(payload: Partial<Member>): Promise<Member> {
    const res = await api.post('/members/', payload, { headers: authHeader() });
    return res.data;
  },

  async update(id: number, payload: Partial<Member>): Promise<Member> {
    const res = await api.patch(`/members/${id}/`, payload, { headers: authHeader() });
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/members/${id}/`, { headers: authHeader() });
  },
};

export default membersAPI;
