import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './auth/AuthProvider';


export default function App() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // redirect to login
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  return (
    <div>
      <Toaster />
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
