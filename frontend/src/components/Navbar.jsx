import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-transparent p-4 border-b border-white/6">
      <div className="container flex justify-between items-center">
        <div>
          <Link to="/shop" className="text-2xl font-bold">Vibe Commerce</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-white/80">Cart</Link>
            <Link to="/orders" className="text-white/80">Orders</Link>
          {user ? (
            <>
              <div className="text-white/80">Hi, {user.name || user.email}</div>
              <button onClick={() => { logout(); navigate('/login'); }} className="px-3 py-1 rounded bg-white/6">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-white/6">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-white/6">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
