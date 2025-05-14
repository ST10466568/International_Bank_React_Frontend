import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safe localStorage initial values
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user'); // Clear corrupted item
      return null;
    }
  });
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const login = useCallback(({ token, user, role }) => {
    console.log('LOGIN triggered → token:', token);
    setToken(token);
    setUser(user);
    setRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Store as JSON string
    localStorage.setItem('role', role);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }, []);

  useEffect(() => {
    console.log("AuthContext useEffect fired. Token value:", token);
    if (!token) return;
    console.log('Token updated, checking expiry');
    let timeoutId;

    try {
      const decoded = jwtDecode(token);
      const expiration = decoded.exp * 1000;
      const now = Date.now();

      if (expiration < now) {
        logout(); // token expired
      } else {
        const delay = expiration - now;
        timeoutId = setTimeout(() => logout(), delay);
      }
    } catch (err) {
      console.error("Token invalid, logging out");
      logout();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, logout]); // Include memoized logout in dependencies

  const contextValue = useMemo(() => ({ token, user, role, login, logout }), [token, user, role, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
