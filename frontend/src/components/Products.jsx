import React from 'react';
import ProductCard from './ProductCard';
import { addToCart } from '../api';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export default function Products({ products=[], reload, loading }) {
  const { token } = useContext(AuthContext);

  async function handleAdd(id) {
    await addToCart(id, 1, token);
    await reload();
  }

  if (loading) return <div className="text-white">Loading...</div>;
  return (
    <div>
      <h2 className="text-xl text-white mb-4">Products</h2>
      <div>
        {products.map(p => <ProductCard key={p.id} p={p} onAdd={handleAdd} />)}
      </div>
    </div>
  );
}
