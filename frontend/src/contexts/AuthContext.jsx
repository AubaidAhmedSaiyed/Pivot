import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextValue';
import { clearAccessToken, getAccessToken, saveAccessToken } from '../services/apiClient';
import { loginUser, registerUser } from '../services/authApi';

const USER_STORAGE_KEY = 'pivot.user';
function readStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAccessToken);
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async (credentials) => {
    const result = await loginUser(credentials);
    if (!result?.access_token || !result?.user) {
      throw new Error('The login response did not include an access token and user.');
    }
    saveAccessToken(result.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    setToken(result.access_token);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback((credentials) => registerUser(credentials), []);

  const logout = useCallback(() => {
    clearAccessToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
