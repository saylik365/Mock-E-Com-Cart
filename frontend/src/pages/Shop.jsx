import React, { useEffect, useState, useContext } from 'react';
import { fetchProducts, fetchCart, addToCart } from '../api';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import useAuth from '../auth/useAuth';
import toast from 'react-hot-toast';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState({ cart: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const p = await fetchProducts();
      const c = await fetchCart(token);
      if (p.ok) setProducts(p.products);
      if (c.ok) setCartData({ cart: c.cart, total: c.total });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [token]);

  async function handleAdd(productId) {
    const res = await addToCart(productId, 1, token);
    if (res.ok) {
      toast.success('Added to cart');
      loadAll();
      setDrawerOpen(true);
    } else {
      toast.error(res.error || 'Add failed');
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: Products */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-8 text-center lg:text-left flex items-center gap-2">
          <span role="img" aria-label="bag">🛍️</span> Products
        </h2>

        {loading ? (
          <div className="text-center text-gray-400">Loading products...</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {products.map(p => (
               <ProductCard key={p.id} product={p} addToCart={handleAdd} />
            ))}
          </div>
        )}
      </div>

      {/* Right: Cart */}
      <div className="lg:w-1/3">
        <CartDrawer
          cartData={cartData}
          reload={loadAll}
          open={true}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  </div>
);
}
