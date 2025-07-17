"use client";
import { useEffect, useState } from "react";
import { UserCircle, MoreVertical, Settings } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dropdown, setDropdown] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", admin: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} users found</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm text-left">
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
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user._id}
                className={
                  selected === user._id
                    ? "bg-green-100 text-green-900"
                    : "hover:bg-green-50 transition"
                }
                onClick={() => setSelected(user._id)}
              >
                <td className="py-3 px-4 font-mono text-xs text-gray-500">#{user._id?.toString().slice(-6)}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                    <UserCircle className="text-green-700" size={24} />
                  </span>
                  <span className="font-medium text-gray-800">{user.name || "-"}</span>
                </td>
                <td className="py-3 px-4 text-gray-700">{user.email}</td>
                <td className="py-3 px-4 text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${user.admin === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {user.admin === 1 ? "Admin" : "Member"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${user.active !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    <span className={`w-2 h-2 rounded-full ${user.active !== false ? "bg-green-500" : "bg-red-500"}`}></span>
                    {user.active !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 relative">
                  <button className="p-2 rounded-full hover:bg-green-100 text-green-700" onClick={e => { e.stopPropagation(); setDropdown(dropdown === user._id ? null : user._id); }}>
                    <Settings size={16} />
                  </button>
                  {dropdown === user._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => { setDropdown(null); alert(JSON.stringify(user, null, 2)); }}>View</button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => openEdit(user)}>Edit</button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600" onClick={() => handleDelete(user._id)}>Delete</button>
                    </div>
                  )}
                  {editUser === user._id && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-20 p-4">
                      <h3 className="font-bold mb-2 text-gray-800">Edit User</h3>
                      <input
                        className="border rounded px-2 py-1 mb-2 w-full"
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Name"
                      />
                      <input
                        className="border rounded px-2 py-1 mb-2 w-full"
                        value={editForm.email}
                        onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Email"
                      />
                      <select
                        className="border rounded px-2 py-1 mb-2 w-full"
                        value={editForm.admin}
                        onChange={e => setEditForm(f => ({ ...f, admin: Number(e.target.value) }))}
                      >
                        <option value={0}>Member</option>
                        <option value={1}>Admin</option>
                      </select>
                      <div className="flex gap-2 mt-2">
                        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" onClick={handleEditSave}>Save</button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300" onClick={() => setEditUser(null)}>Cancel</button>
                      </div>
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