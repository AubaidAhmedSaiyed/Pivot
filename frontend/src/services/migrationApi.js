import { apiRequest } from './apiClient';

export function analyzeSchema(body) {
  return apiRequest('/api/schema/analyze', { method: 'POST', body });
}

export function predictComplexity(body) {
  return apiRequest('/api/ml/predict-complexity', { method: 'POST', body });
}

export function generateMigrationSql(body) {
  return apiRequest('/api/migration/generate-sql', { method: 'POST', body });
}

export function reviewMigration(body) {
  return apiRequest('/api/migration/review', { method: 'POST', body });
}

export function diffSchema(body) {
  return apiRequest('/api/schema/diff', { method: 'POST', body });
}
