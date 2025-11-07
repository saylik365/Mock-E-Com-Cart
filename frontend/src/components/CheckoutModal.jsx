import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { checkout } from '../api';
import { AuthContext } from '../auth/AuthProvider';

Modal.setAppElement('#root');

export default function CheckoutModal({ open=false, onClose=()=>{}, onSuccess=()=>{} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!name || !email) { setError('Name and email required'); return; }
    setBusy(true);
    try {
      const res = await checkout(name, email, token);
      if (res.ok) {
        onSuccess(res.receipt);
        setName(''); setEmail('');
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
    <Modal isOpen={open} onRequestClose={onClose} overlayClassName="react-modal-overlay" className="react-modal">
      <h3 className="text-lg font-semibold mb-2">Checkout</h3>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 rounded bg-white/5 text-white" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded bg-white/5 text-white" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-white/6">Cancel</button>
          <button type="submit" disabled={busy} className="px-3 py-2 rounded bg-accent text-white">{busy ? 'Processing...' : 'Confirm'}</button>
        </div>
      </form>
    </Modal>
  );
}
