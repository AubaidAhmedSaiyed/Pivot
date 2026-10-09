const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'pivot.accessToken';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveAccessToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function apiRequest(path, { method = 'GET', body, token = getAccessToken() } = {}) {
  const headers = new Headers();
  if (body !== undefined) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const responseText = await response.text();
  let responseBody = null;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    const detail = responseBody?.detail;
    const detailMessage = Array.isArray(detail)
      ? detail.map((item) => item.msg || JSON.stringify(item)).join('; ')
      : detail;
    const message = typeof responseBody === 'string'
      ? responseBody
      : detailMessage || responseBody?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return responseBody;
}
