import api from './api';
import authAPI from './auth';
import { PriorityQueueResponse, PriorityReorderPayload } from '../types';

function authHeader() {
  const token = authAPI.getAccess();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const priorityAPI = {
  async queue(params?: { project_id?: number }): Promise<PriorityQueueResponse> {
    const res = await api.get('/priority/queue/', { headers: authHeader(), params });
    return res.data;
  },

  async recalculate(payload?: { project_id?: number }): Promise<PriorityQueueResponse> {
    const res = await api.post('/priority/recalculate/', payload ?? {}, { headers: authHeader() });
    return res.data;
  },

  async reorder(payload: PriorityReorderPayload): Promise<PriorityQueueResponse> {
    const res = await api.put('/priority/reorder/', payload, { headers: authHeader() });
    return res.data;
  },
};

export default priorityAPI;