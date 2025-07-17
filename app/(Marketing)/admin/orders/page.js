"use client";
import { useEffect, useState } from "react";
import { UserCircle, MoreVertical, Settings } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dropdown, setDropdown] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Order</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} orders found</p>
        </div>
        <div className="text-gray-500 text-sm">All orders</div>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className={
                  selected === order._id
                    ? "bg-green-100 text-green-900"
                    : "hover:bg-green-50 transition"
                }
                onClick={() => setSelected(order._id)}
              >
                <td className="py-3 px-4 font-mono text-xs text-gray-500">#{order._id?.toString().slice(-6)}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                    <UserCircle className="text-green-700" size={24} />
                  </span>
                  <span className="font-medium text-gray-800">{order.user?.name || "-"}</span>
                </td>
                <td className="py-3 px-4 text-gray-700">{order.user?.address || "-"}</td>
                <td className="py-3 px-4 text-gray-500">{order.date ? new Date(order.date).toLocaleDateString() : "-"}</td>
                <td className="py-3 px-4 text-gray-700">${order.price?.toLocaleString() || "-"}</td>
                <td className="py-3 px-4 text-gray-700">{order.productName || "-"}</td>
                <td className="py-3 px-4 text-gray-700">{order.paymentMethod || "-"}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${order.status === "Dispatch" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    <span className={`w-2 h-2 rounded-full ${order.status === "Dispatch" ? "bg-green-500" : "bg-red-500"}`}></span>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 relative">
                  <button className="p-2 rounded-full hover:bg-green-100 text-green-700" onClick={e => { e.stopPropagation(); setDropdown(dropdown === order._id ? null : order._id); }}>
                    <Settings size={16} />
                  </button>
                  {dropdown === order._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => { setDropdown(null); alert(JSON.stringify(order, null, 2)); }}>View</button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">Edit</button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 