import { createContext, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const user = token ? jwtDecode(token) : null;

  function saveToken(t) {
    setToken(t);
    localStorage.setItem('token', t);
  }
  function logout() {
    setToken(null);
    localStorage.removeItem('token');
  }

  return <AuthContext.Provider value={{ token, user, saveToken, logout }}>{children}</AuthContext.Provider>;
}
