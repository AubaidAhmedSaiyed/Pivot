import { apiRequest } from './apiClient';

export function listProjects() {
  return apiRequest('/api/projects');
}

export function getProject(projectId) {
  return apiRequest(`/api/projects/${encodeURIComponent(projectId)}`);
}

export function createProject({ name, description }) {
  return apiRequest('/api/projects', {
    method: 'POST',
    body: { name, description },
  });
}

export function updateProject(projectId, { name, description, status }) {
  return apiRequest(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: 'PUT',
    body: { name, description, status },
  });
}

export function deleteProject(projectId) {
  return apiRequest(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
  });
}
