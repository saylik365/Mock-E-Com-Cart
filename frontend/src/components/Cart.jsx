import React, { useContext } from 'react';
import { updateCartItem, deleteCartItem } from '../api';
import { AuthContext } from '../auth/AuthProvider';

/**
 * Props:
 * - cartData: { cart: [], total: number }
 * - reload: function to reload data
 * - onCheckout: optional callback to open checkout modal
 */
export default function Cart({ cartData = { cart: [], total: 0 }, reload, onCheckout }) {
  const { token } = useContext(AuthContext);

  async function changeQty(id, qty) {
    // prevent negative
    if (qty < 0) return;
    try {
      await updateCartItem(id, qty, token);
      await reload();
    } catch (err) {
      console.error('Failed to update qty', err);
      alert('Failed to update quantity');
    }
  }

  async function remove(id) {
    try {
      await deleteCartItem(id, token);
      await reload();
    } catch (err) {
      console.error('Failed to remove', err);
      alert('Failed to remove item');
    }
  }

  const totalCount = cartData.cart.reduce((s, i) => s + i.qty, 0);

  function handleCheckoutClick() {
    if (typeof onCheckout === 'function') {
      onCheckout();
    } else {
      // fallback: dispatch event so App can catch it if wired
      window.dispatchEvent(new CustomEvent('openCheckout'));
    }
  }

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">Cart</h3>
        <div className="text-gray-300 text-sm">{totalCount} items</div>
      </div>

      {cartData.cart.length === 0 ? (
        <div className="text-gray-300">Your cart is empty.</div>
      ) : (
        <ul className="space-y-3">
          {cartData.cart.map(it => (
            <li key={it.id} className="flex justify-between items-center py-2 border-b border-white/6">
              <div>
                <div className="text-white font-medium">{it.name}</div>
                <div className="text-gray-300 text-sm">₹{Number(it.price).toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(it.id, it.qty - 1)}
                  className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
                  aria-label="decrease"
                >
                  -
                </button>
                <div className="text-white min-w-[28px] text-center">{it.qty}</div>
                <button
                  onClick={() => changeQty(it.id, it.qty + 1)}
                  className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
                  aria-label="increase"
                >
                  +
                </button>
                <button
                  onClick={() => remove(it.id)}
                  className="px-2 py-1 bg-red-600 rounded text-white"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-white/6 pt-3">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-300">Total</div>
          <div className="text-white font-bold">₹{Number(cartData.total).toFixed(2)}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCheckoutClick}
            disabled={cartData.cart.length === 0}
            className={`flex-1 px-4 py-2 rounded ${cartData.cart.length === 0 ? 'bg-white/10 text-gray-400' : 'bg-accent text-white'}`}
          >
            Checkout
          </button>

          <button
            onClick={() => { /* quick refresh */ reload && reload(); }}
            className="px-4 py-2 rounded bg-white/6 text-white"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
