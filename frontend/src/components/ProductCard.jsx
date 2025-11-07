import React from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ p, onAdd }) {
  return (
    <motion.div whileHover={{ scale: 1.03, rotateY: 4 }} className="card p-4 mb-4 flex gap-4">
      <div className="product-img">{p.name[0]}</div>
      <div className="flex-1">
        <h3 className="text-white text-lg font-semibold">{p.name}</h3>
        <p className="text-gray-300 text-sm">{p.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-white font-bold">₹{Number(p.price).toFixed(2)}</div>
          <button onClick={() => onAdd(p.id)} className="px-3 py-1 rounded bg-accent text-white">Add</button>
        </div>
      </div>
    </motion.div>
  );
}
