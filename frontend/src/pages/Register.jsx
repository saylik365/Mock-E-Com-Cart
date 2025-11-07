import { useState } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await register(form);
    if (res.ok) {
      toast.success('Registered successfully!');
      navigate('/login');
    } else toast.error(res.error || 'Registration failed');
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 border border-white/20 shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Name" className="w-full p-3 rounded bg-white/10 text-white" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" className="w-full p-3 rounded bg-white/10 text-white" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" className="w-full p-3 rounded bg-white/10 text-white" onChange={e => setForm({ ...form, password: e.target.value })} />
          <button className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">Register</button>
        </form>
        <p className="text-gray-300 text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-indigo-400">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
