import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { login } from '../api';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.ok && res.token) {
      saveToken(res.token);
      toast.success('Logged in');
      navigate('/shop');
    } else {
      toast.error(res.error || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-3 rounded bg-white/5 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full p-3 rounded bg-white/5 text-white" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white">Sign in</button>
        </form>
        <p className="mt-4 text-sm text-gray-300">
          Don't have an account? <Link to="/register" className="text-indigo-300">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
