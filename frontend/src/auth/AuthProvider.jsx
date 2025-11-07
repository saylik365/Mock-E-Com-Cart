import React, { createContext, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      return token ? jwtDecode(token) : null;
    } catch {
      return null;
    }
  });

  function saveToken(t) {
    localStorage.setItem('token', t);
    setToken(t);
    try { setUser(t ? jwtDecode(t) : null); } catch { setUser(null); }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
