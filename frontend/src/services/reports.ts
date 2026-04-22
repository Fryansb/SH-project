import api from './api';
import authAPI from './auth';
import { FinancialReport, HoursReport, PerformanceReport } from '../types';

function authHeader() {
  const token = authAPI.getAccess();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const reportsAPI = {
  async performance(): Promise<PerformanceReport> {
    const res = await api.get('/reports/performance/', { headers: authHeader() });
    return res.data;
  },

  async financial(): Promise<FinancialReport> {
    const res = await api.get('/reports/financial/', { headers: authHeader() });
    return res.data;
  },

  async hours(): Promise<HoursReport> {
    const res = await api.get('/reports/hours/', { headers: authHeader() });
    return res.data;
  },
};

export default reportsAPI;