import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export default function Navbar({ cartCount=0 }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">Vibe Commerce</h1>
      <div className="flex items-center gap-4">
        <div className="text-white">Cart: <strong>{cartCount}</strong></div>
        {user ? (
          <>
            <div className="text-white">Hi, {user.name || user.email}</div>
            <button className="px-3 py-1 bg-white/10 rounded" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <a className="px-3 py-1 bg-white/10 rounded" href="#/login">Login</a>
            <a className="px-3 py-1 bg-white/10 rounded" href="#/register">Register</a>
          </>
        )}
      </div>
    </header>
  );
}
