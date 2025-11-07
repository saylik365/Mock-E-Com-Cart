import { useEffect, useState, useContext } from 'react';
import { fetchProducts, addToCart } from '../api';
import { AuthContext } from '../auth/AuthProvider';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchProducts().then(r => setProducts(r.products || [])); }, []);

  async function handleAdd(id) {
    const res = await addToCart(id, 1, token);
    if (res.ok) toast.success('Added to cart');
    else toast.error(res.error || 'Error adding');
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Products</h2>
        <button onClick={() => navigate('/cart')} className="bg-white/10 px-4 py-2 rounded hover:bg-white/20">🛒 Cart</button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map(p => (
          <motion.div key={p.id} whileHover={{ scale: 1.03 }} className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
            <
