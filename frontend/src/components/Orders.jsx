import React, { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import { toast } from "react-hot-toast";

export default function Orders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/checkout/history/${user?.email}`
        );
        const data = await res.json();
        if (data.ok) setOrders(data.receipts);
        else toast.error(data.error || "Failed to load orders");
      } catch (err) {
        toast.error("Server error loading orders");
      } finally {
        setLoading(false);
      }
    }
    if (user?.email) load();
  }, [user]);

  async function handleReorder(id) {
    try {
      const res = await fetch(
        `http://localhost:4000/api/checkout/reorder/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.ok) toast.success("Reorder added to cart!");
      else toast.error(data.error || "Reorder failed");
    } catch {
      toast.error("Reorder request failed");
    }
  }

  if (loading) return <div className="text-gray-300">Loading your orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">🧾 Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">No previous orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 p-4 rounded-xl shadow-lg backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">
                  Order #{order.id.slice(0, 6)}
                </h3>
                <span className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 mb-2">Total: ₹{order.total.toFixed(2)}</p>
              <button
                onClick={() => handleReorder(order.id)}
                className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 rounded-lg text-white hover:opacity-90"
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
