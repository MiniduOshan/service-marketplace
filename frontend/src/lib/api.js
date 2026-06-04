// Security Note: Bearer token is stored in localStorage for SPA simplicity.
// To mitigate XSS impact, all user inputs are sanitized on both frontend and backend.
// In a true production environment, it is highly recommended to migrate to HttpOnly secure cookies with CSRF protection.
const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const SESSION_TOKEN_KEY = 'skilledlk_token';
const SESSION_USER_KEY = 'skilledlk_user';

function normalizeToken(token) {
  if (typeof token !== 'string') {
    return null;
  }

  const normalized = token.trim();
  if (!normalized || normalized === 'null' || normalized === 'undefined') {
    return null;
  }

  return normalized;
}

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getStoredSessionToken() {
  return normalizeToken(localStorage.getItem(SESSION_TOKEN_KEY));
}

export async function apiRequest(path, options = {}) {
  const token = getStoredSessionToken();
  const { headers: optionHeaders, ...restOptions } = options;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...restOptions,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(optionHeaders || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = payload?.message || 'Request failed.';

    if (response.status === 401) {
      clearSession();

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function storeSession(token, user) {
  const normalizedToken = normalizeToken(token);

  if (normalizedToken) {
    localStorage.setItem(SESSION_TOKEN_KEY, normalizedToken);
  }

  if (user !== undefined) {
    if (user === null) {
      localStorage.removeItem(SESSION_USER_KEY);
    } else {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    }
  }
}

export function getStoredSessionUser() {
  try {
    const rawUser = localStorage.getItem(SESSION_USER_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
}
