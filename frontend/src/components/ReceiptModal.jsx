import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function ReceiptModal({ receipt=null, onClose=()=>{} }) {
  if (!receipt) return null;

  return (
    <Modal isOpen={!!receipt} onRequestClose={onClose} overlayClassName="react-modal-overlay" className="react-modal">
      <h3 className="text-lg font-semibold mb-2">Receipt</h3>
      <div className="text-sm text-gray-300 mb-2">Receipt ID: <span className="text-white">{receipt.id}</span></div>
      <div className="text-sm text-gray-300 mb-2">Name: <span className="text-white">{receipt.name}</span></div>
      <div className="text-sm text-gray-300 mb-2">Email: <span className="text-white">{receipt.email}</span></div>
      <div className="mt-3">
        <strong className="text-white">Items</strong>
        <ul className="mt-2 space-y-2">
          {receipt.items.map(it => (
            <li key={it.productId} className="flex justify-between text-gray-200">
              <span>{it.name} × {it.qty}</span>
              <span>₹{(it.price * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-white font-bold">Total: ₹{Number(receipt.total).toFixed(2)}</div>
        <div>
          <button onClick={onClose} className="px-4 py-2 rounded bg-accent text-white">Close</button>
        </div>
      </div>
    </Modal>
  );
}
