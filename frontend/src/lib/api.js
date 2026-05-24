const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api';

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('skilledlk_token');
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = payload?.message || 'Request failed.';
    throw new Error(message);
  }

  return payload;
}

export function storeSession(token, user) {
  localStorage.setItem('skilledlk_token', token);
  localStorage.setItem('skilledlk_user', JSON.stringify(user));
}

export function getStoredSessionUser() {
  try {
    const rawUser = localStorage.getItem('skilledlk_user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('skilledlk_token');
  localStorage.removeItem('skilledlk_user');
}
