import React from "react";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white/10 rounded-2xl p-5 shadow-lg hover:scale-105 transition-transform backdrop-blur-xl border border-white/10 flex flex-col justify-between h-full">
      <img
        src={product.image}
        alt={product.title}
        className="h-44 w-full object-contain mb-4 rounded-lg bg-white/5 p-2"
      />
      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg leading-snug line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-300 mt-2 mb-4 font-medium text-lg">
          ₹{product.price.toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => addToCart(product.id)} // ✅ Correct handler name
        className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold py-2 rounded-lg mt-auto hover:opacity-90 transition-all"
      >
        Add to Cart
      </button>
    </div>
  );
}
