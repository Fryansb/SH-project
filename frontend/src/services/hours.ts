import api from './api';
import authAPI from './auth';
import { HourRegistry, HourRegistryPayload } from '../types';

function authHeader() {
  const token = authAPI.getAccess();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const hoursAPI = {
  async list(): Promise<HourRegistry[]> {
    const res = await api.get('/hours/', { headers: authHeader() });
    return res.data;
  },

  async retrieve(id: number): Promise<HourRegistry> {
    const res = await api.get(`/hours/${id}/`, { headers: authHeader() });
    return res.data;
  },

  async create(payload: HourRegistryPayload): Promise<HourRegistry> {
    const res = await api.post('/hours/', payload, { headers: authHeader() });
    return res.data;
  },

  async update(id: number, payload: Partial<HourRegistryPayload>): Promise<HourRegistry> {
    const res = await api.patch(`/hours/${id}/`, payload, { headers: authHeader() });
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/hours/${id}/`, { headers: authHeader() });
  },

  async myHours(): Promise<HourRegistry[]> {
    const res = await api.get('/hours/my-hours/', { headers: authHeader() });
    return res.data;
  },

  async byProject(projectId: number): Promise<HourRegistry[]> {
    const res = await api.get(`/hours/project/${projectId}/`, { headers: authHeader() });
    return res.data;
  },
};

export default hoursAPI;