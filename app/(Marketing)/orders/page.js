"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/Sidebar/UserSidebar";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/orders", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: orderId }),
      });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedOrders.length} selected order(s)?`)) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      for (const orderId of selectedOrders) {
        await fetch(`/api/orders`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ _id: orderId }),
        });
      }
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex">
        <UserSidebar />
        <main className="flex-1 p-6 md:p-12 md:ml-64 pt-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
          {selectedOrders.length > 0 && (
            <div className="mb-4 flex items-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-60"
                onClick={handleDeleteSelected}
                disabled={deleting}
              >
                <Trash2 size={18} /> Delete Selected
              </button>
              <span className="text-gray-500 text-sm">{selectedOrders.length} selected</span>
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500 py-20">Loading orders...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-20 text-xl">You have no orders yet.</div>
          ) : (
            <>
              {/* Table for md+ screens */}
              <div className="hidden md:block bg-white rounded-xl shadow p-6 overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                      <th className="py-3 px-4 w-8"></th>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b last:border-b-0 hover:bg-green-50 transition">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelect(order._id)}
                            className="accent-green-600 w-4 h-4"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">#{order._id?.toString().slice(-6)}</td>
                        <td className="py-3 px-4">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status || "Pending"}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-green-700">${order.amount?.toLocaleString() || "-"}</td>
                        <td className="py-3 px-4">
                          <ul className="list-disc pl-4">
                            {order.items?.map((item, idx) => (
                              <li key={idx} className="text-gray-700">
                                {item.title || item.name} x{item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="text-gray-400 hover:text-red-600 transition"
                            onClick={() => handleDelete(order._id)}
                            disabled={deleting}
                            aria-label="Delete order"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Card layout for mobile */}
              <div className="md:hidden flex flex-col gap-6">
                {orders.map(order => (
                  <div key={order._id} className={`bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative ${selectedOrders.includes(order._id) ? "ring-2 ring-red-400" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-gray-500">#{order._id?.toString().slice(-6)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status || "Pending"}</span>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelect(order._id)}
                        className="accent-green-600 w-4 h-4 ml-2"
                      />
                      <button
                        className="text-gray-400 hover:text-red-600 transition ml-2"
                        onClick={() => handleDelete(order._id)}
                        disabled={deleting}
                        aria-label="Delete order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</span>
                      <span className="font-bold text-green-700">${order.amount?.toLocaleString() || "-"}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Items:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.title || item.name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
} 