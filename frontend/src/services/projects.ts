import api from './api';
import authAPI from './auth';
import { Project, ProjectDocument, ProjectHistoryEntry } from '../types';

function authHeader() {
  const token = authAPI.getAccess();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const projectsAPI = {
  async list(): Promise<Project[]> {
    const res = await api.get('/projects/', { headers: authHeader() });
    return res.data;
  },

  async retrieve(id: number): Promise<Project> {
    const res = await api.get(`/projects/${id}/`, { headers: authHeader() });
    return res.data;
  },

  async create(payload: Partial<Project>): Promise<Project> {
    const res = await api.post('/projects/', payload, { headers: authHeader() });
    return res.data;
  },

  async update(id: number, payload: Partial<Project>): Promise<Project> {
    const res = await api.patch(`/projects/${id}/`, payload, { headers: authHeader() });
    return res.data;
  },

  async assign(id: number, payload: { assigned_member_ids: number[] }): Promise<Project> {
    const res = await api.post(`/projects/${id}/assign/`, payload, { headers: authHeader() });
    return res.data;
  },

  async documents(projectId: number): Promise<ProjectDocument[]> {
    const res = await api.get('/project-documents/', {
      params: { project_id: projectId },
      headers: authHeader(),
    });
    return res.data;
  },

  async uploadDocument(formData: FormData): Promise<ProjectDocument> {
    const res = await api.post('/project-documents/', formData, {
      headers: authHeader(),
    });
    return res.data;
  },

  async history(projectId: number): Promise<ProjectHistoryEntry[]> {
    const res = await api.get('/project-history/', {
      params: { project_id: projectId },
      headers: authHeader(),
    });
    return res.data;
  },
};

export default projectsAPI;