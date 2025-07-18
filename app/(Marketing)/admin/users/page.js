"use client";
import { useEffect, useState } from "react";
import { UserCircle, MoreVertical, Settings } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dropdown, setDropdown] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", admin: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setPage(1);
  }

  async function handleDelete(_id) {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id })
    });
    setDropdown(null);
    fetchUsers();
  }

  function openEdit(user) {
    setEditUser(user._id);
    setEditForm({ name: user.name, email: user.email, admin: user.admin || 0 });
    setDropdown(null);
  }

  async function handleEditSave() {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: editUser, ...editForm })
    });
    setEditUser(null);
    fetchUsers();
  }

  // Filter users by search (name or email)
  const filteredUsers = users.filter(user => {
    const q = debouncedSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }
  function renderPagination() {
    if (totalPages <= 1) return null;
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

  return (
    <div className="bg-white rounded-xl shadow-lg min-h-[85vh] p-2 sm:p-4 md:p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredUsers.length} users found</p>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:ring focus:ring-green-200 w-full md:w-auto"
          />
        </div>
      </div>
      <div className="overflow-x-auto flex-1 rounded-lg">
        <table className="min-w-[700px] w-full text-sm text-left h-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Date Joined</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="align-top h-full">
            {paginatedUsers.map((user, idx) => (
              <tr
                key={user._id}
                className={
                  `${selected === user._id ? "bg-green-100 text-green-900" : "hover:bg-green-50 transition"} ${idx !== paginatedUsers.length - 1 ? "border-b border-gray-200" : ""}`
                }
                onClick={() => setSelected(user._id)}
              >
                <td className="py-3 px-4 font-mono text-xs text-gray-500">#{user._id?.toString().slice(-6)}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                    <UserCircle className="text-green-700" size={24} />
                  </span>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.dateJoined || '-'}</td>
                <td className="py-3 px-4">{user.admin === 1 ? 'Admin' : 'User'}</td>
                <td className="py-3 px-4">Active</td>
                <td className="py-3 px-4">
                  {/* Action buttons here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
} 