import { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { login } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

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
      toast.success('Login successful!');
      navigate('/shop');
    } else toast.error(res.error || 'Login failed');
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 border border-white/20 shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Vibe Commerce</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-3 rounded bg-white/10 text-white" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full p-3 rounded bg-white/10 text-white" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">Login</button>
        </form>
        <p className="text-gray-300 text-sm text-center mt-4">
          Don’t have an account? <Link to="/register" className="text-indigo-400">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
