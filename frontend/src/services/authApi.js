import { apiRequest } from './apiClient';

export function registerUser({ email, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: { email, password },
    token: null,
  });
}

export function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    token: null,
  });
}
