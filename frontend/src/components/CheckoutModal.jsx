import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { checkout } from '../api';
import { AuthContext } from '../auth/AuthProvider';

Modal.setAppElement('#root');

export default function CheckoutModal({ open = false, onClose = () => {}, onSuccess = () => {} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    setBusy(true);
    try {
      const res = await checkout(name, email, token);
      if (res.ok) {
        onSuccess(res.receipt);
        setName('');
        setEmail('');
      } else {
        setError(res.error || 'Checkout failed');
      }
    } catch (err) {
      console.error(err);
      setError('Checkout failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      overlayClassName="react-modal-overlay"
      className="react-modal"
    >
      <h2 className="text-xl font-semibold mb-2">Checkout</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <div className="text-sm text-gray-300">Name</div>
          <input className="w-full p-2 rounded bg-white/5 text-white" value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300">Email</div>
          <input className="w-full p-2 rounded bg-white/5 text-white" value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <div className="flex justify-end gap-2 mt-3">
          <button type="button" className="px-4 py-2 rounded bg-white/6 text-white" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={busy} className="px-4 py-2 rounded bg-accent text-white">
            {busy ? 'Processing...' : 'Pay (Mock)'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
