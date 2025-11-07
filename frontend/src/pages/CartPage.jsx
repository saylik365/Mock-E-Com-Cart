import React, { useEffect, useState } from 'react';
import { fetchCart } from '../api';
import CartDrawer from '../components/CartDrawer';
import useAuth from '../auth/useAuth';

export default function CartPage() {
  const [cartData, setCartData] = useState({ cart: [], total: 0 });
  const { token } = useAuth();

  async function loadCart() {
    const c = await fetchCart(token);
    if (c.ok) setCartData({ cart: c.cart, total: c.total });
  }

  useEffect(() => { loadCart(); }, [token]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Your Cart</h2>
      <CartDrawer cartData={cartData} reload={loadCart} open={true} />
    </div>
  );
}
