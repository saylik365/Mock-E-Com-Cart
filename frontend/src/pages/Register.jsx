import React, { useState, useContext } from 'react';
import { register } from '../api';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await register({ name, email, password });
    if (res.ok && res.token) {
      saveToken(res.token);
      toast.success('Registered & logged in');
      navigate('/shop');
    } else if (res.ok && res.user && res.token) {
      // fallback
      saveToken(res.token);
      navigate('/shop');
    } else {
      toast.error(res.error || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-3 rounded bg-white/5 text-white" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="w-full p-3 rounded bg-white/5 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full p-3 rounded bg-white/5 text-white" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white">Register</button>
        </form>
      </div>
    </div>
  );
}
