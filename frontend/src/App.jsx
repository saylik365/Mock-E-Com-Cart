import React, { useEffect, useState, useContext } from 'react';
import { fetchProducts, fetchCart } from './api';
import Products from './components/Products';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import Navbar from './components/Navbar';
import { AuthContext } from './auth/AuthProvider';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState({ cart: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const { token } = useContext(AuthContext);

  async function loadAll() {
    setLoading(true);
    const p = await fetchProducts();
    const c = await fetchCart(token);
    if (p.ok) setProducts(p.products);
    if (c.ok) setCartData({ cart: c.cart, total: c.total });
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, [token]);

  return (
    <div className="container">
      <Navbar cartCount={cartData.cart.reduce((s,i)=>s+i.qty,0)} />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Products products={products} reload={loadAll} loading={loading} />
        </div>
        <aside>
          <Cart cartData={cartData} reload={loadAll} />
        </aside>
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onSuccess={(r) => { setReceipt(r); loadAll(); }} />
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}
