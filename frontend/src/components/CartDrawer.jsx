import React, { useContext, useState } from 'react';
import { updateCartItem, deleteCartItem } from '../api';
import { AuthContext } from '../auth/AuthProvider';
import CheckoutModal from './CheckoutModal';
import ReceiptModal from './ReceiptModal';

export default function CartDrawer({ cartData = { cart: [], total: 0 }, reload = ()=>{}, open = false, onClose = ()=>{} }) {
  const { token } = useContext(AuthContext);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function changeQty(id, qty) {
    if (qty < 0) return;
    await updateCartItem(id, qty, token);
    reload();
  }

  async function removeItem(id) {
    await deleteCartItem(id, token);
    reload();
  }

  return (
    <>
      <div className={`card p-4 ${open ? '' : ''}`}>
        <h3 className="text-lg font-semibold mb-3">Cart</h3>
        {cartData.cart.length === 0 ? <div className="text-gray-300">Cart is empty</div> : (
          <div className="space-y-3">
            {cartData.cart.map(it => (
              <div key={it.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-gray-300 text-sm">₹{Number(it.price).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeQty(it.id, it.qty - 1)} className="px-2 py-1 rounded bg-white/5">-</button>
                  <div className="px-2">{it.qty}</div>
                  <button onClick={() => changeQty(it.id, it.qty + 1)} className="px-2 py-1 rounded bg-white/5">+</button>
                  <button onClick={() => removeItem(it.id)} className="px-2 py-1 rounded bg-red-600 text-white">Remove</button>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-white/6">
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-300">Total</div>
                <div className="font-bold">₹{Number(cartData.total).toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCheckoutOpen(true)} className="flex-1 py-2 rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white">Checkout</button>
                <button onClick={() => reload()} className="py-2 px-3 rounded bg-white/6">Refresh</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onSuccess={(r) => { setReceipt(r); setCheckoutOpen(false); reload(); }} />
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </>
  );
}
