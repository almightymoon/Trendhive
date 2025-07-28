"use client";
import { useEffect, useState } from "react";
import { UserCircle, MoreVertical, Settings, RefreshCw, Search } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dropdown, setDropdown] = useState(null);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [editOrder, setEditOrder] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editPayment, setEditPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [search, month]);

  async function fetchOrders() {
    setLoading(true);
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (month) params.push(`month=${month}`);
    const res = await fetch(`/api/admin/orders${params.length ? `?${params.join("&")}` : ""}`);
    const data = await res.json();
    setOrders(data);
    setPage(1); // Reset to first page on new search/filter
    setLoading(false);
  }

  function handleRefresh() {
    fetchOrders();
  }

  function handleMonthChange(e) {
    setMonth(e.target.value);
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function openEdit(order) {
    setEditOrder(order);
    setEditStatus(order.status || "");
    setEditPayment(order.paymentMethod || "");
  }

  async function saveEdit() {
    if (!editOrder) return;
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          _id: editOrder._id, 
          status: editStatus, 
          paymentMethod: editPayment 
        }),
      });
      
      if (response.ok) {
        alert('Order updated successfully!');
        setEditOrder(null);
        fetchOrders();
      } else {
        alert('Failed to update order. Please try again.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    }
  }

  async function markAsComplete(order) {
    if (!window.confirm(`Are you sure you want to mark order #${order._id?.toString().slice(-6)} as complete?`)) return;
    
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          _id: order._id, 
          status: "completed"
        }),
      });
      
      if (response.ok) {
        alert('Order marked as complete successfully!');
        setDropdown(null);
        fetchOrders();
      } else {
        alert('Failed to mark order as complete. Please try again.');
      }
    } catch (error) {
      console.error('Error marking order as complete:', error);
      alert('Error marking order as complete. Please try again.');
    }
  }

  async function deleteOrder(order) {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: order._id }),
    });
    fetchOrders();
  }

  async function deleteSelectedOrders() {
    if (selectedOrders.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedOrders.length} selected order(s)?`)) return;
    for (const orderId of selectedOrders) {
      await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId }),
      });
    }
    setSelectedOrders([]);
    fetchOrders();
  }

  async function markSelectedAsComplete() {
    if (selectedOrders.length === 0) return;
    if (!window.confirm(`Are you sure you want to mark ${selectedOrders.length} selected order(s) as complete?`)) return;
    
    try {
      for (const orderId of selectedOrders) {
        await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            _id: orderId, 
            status: "completed"
          }),
        });
      }
      alert(`${selectedOrders.length} order(s) marked as complete successfully!`);
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error('Error marking orders as complete:', error);
      alert('Error marking orders as complete. Please try again.');
    }
  }

  // Month options for dropdown (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  });

  // Pagination logic
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }
  function renderPagination() {
    if (totalPages <= 1) return null;
    // Google-style: show up to 5 pages around current
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      if (end === totalPages) start = Math.max(1, end - 4);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-2 py-1 rounded border text-sm disabled:opacity-50">Prev</button>
        {start > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-3 py-1 rounded border text-sm ${p === page ? "bg-green-600 text-white border-green-600" : "hover:bg-green-100"}`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="px-2">...</span>}
        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-2 py-1 rounded border text-sm disabled:opacity-50">Next</button>
      </div>
    );
  }

  // Checkbox logic
  function toggleSelectOrder(orderId) {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }
  function toggleSelectAll() {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((order) => order._id));
    }
  }
  function isOrderSelected(orderId) {
    return selectedOrders.includes(orderId);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg min-h-[85vh] p-2 sm:p-4 md:p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} orders found</p>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={handleSearchChange}
            className="border rounded px-3 py-2 text-sm focus:ring focus:ring-green-200 w-full md:w-auto"
          />
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex gap-2 items-center mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-sm text-green-700 font-medium">
            {selectedOrders.length} order(s) selected
          </span>
          <button
            onClick={markSelectedAsComplete}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
          >
            Mark as Complete
          </button>
          <button
            onClick={deleteSelectedOrders}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedOrders([])}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
          >
            Clear Selection
          </button>
        </div>
      )}
      <div className="overflow-x-auto flex-1 rounded-lg">
        <table className="min-w-[800px] w-full text-sm text-left h-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </th>
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
          <tbody className="align-top h-full">
            {paginatedOrders.map((order, idx) => (
              <tr
                key={order._id}
                className={
                  `${selected === order._id ? "bg-green-100 text-green-900" : "hover:bg-green-50 transition"} ${idx !== paginatedOrders.length - 1 ? "border-b border-gray-200" : ""}`
                }
                onClick={() => setSelected(order._id)}
              >
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isOrderSelected(order._id)}
                    onChange={() => toggleSelectOrder(order._id)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </td>
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
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "completed" || order.status === "delivered" ? "bg-green-100 text-green-700" :
                    order.status === "transit" || order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                    order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "pending" ? "bg-gray-100 text-gray-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      order.status === "completed" || order.status === "delivered" ? "bg-green-500" :
                      order.status === "transit" || order.status === "shipped" ? "bg-blue-500" :
                      order.status === "processing" ? "bg-yellow-500" :
                      order.status === "pending" ? "bg-gray-500" :
                      "bg-red-500"
                    }`}></span>
                    {order.status || "pending"}
                  </span>
                </td>
                <td className="py-3 px-4 relative">
                  <button className="p-2 rounded-full hover:bg-green-100 text-green-700" onClick={e => { e.stopPropagation(); setDropdown(dropdown === order._id ? null : order._id); }}>
                    <MoreVertical size={20} />
                  </button>
                  {dropdown === order._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-2xl z-50 py-2 flex flex-col gap-1 animate-fade-in">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded transition" onClick={() => { setDropdown(null); alert(JSON.stringify(order, null, 2)); }}>View</button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded transition" onClick={() => { setDropdown(null); openEdit(order); }}>Edit</button>
                      {order.status !== "completed" && order.status !== "delivered" && (
                        <button className="block w-full text-left px-4 py-2 hover:bg-green-100 text-green-600 rounded transition" onClick={() => { setDropdown(null); markAsComplete(order); }}>Mark as Complete</button>
                      )}
                      <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 rounded transition" onClick={() => { setDropdown(null); deleteOrder(order); }}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
      {/* Edit Modal */}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Order #{editOrder._id?.toString().slice(-6)}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="transit">In Transit</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <input value={editPayment} onChange={e => setEditPayment(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Order Details</label>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Customer:</strong> {editOrder.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {editOrder.user?.email || 'N/A'}</p>
                <p><strong>Total:</strong> ${editOrder.price?.toFixed(2) || 'N/A'}</p>
                <p><strong>Date:</strong> {editOrder.date ? new Date(editOrder.date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setEditOrder(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 