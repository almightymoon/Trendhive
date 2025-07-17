"use client";
import { useState, useEffect } from "react";

export default function AdminProductsPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory })
    });
    setNewCategory("");
    fetchCategories();
  }

  async function updateCategory(id) {
    if (!editName.trim()) return;
    await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, name: editName })
    });
    setEditing(null);
    setEditName("");
    fetchCategories();
  }

  async function deleteCategory(id) {
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id })
    });
    fetchCategories();
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Products Table (Left) */}
      <div className="flex-1 bg-white rounded shadow p-6 mb-8 md:mb-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
          <button className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition">Add Product</button>
        </div>
        {/* Products table placeholder */}
        <div>
          Products table UI here
        </div>
      </div>
      {/* Categories Sidebar (Right) */}
      <div className="w-full md:w-80 bg-white rounded shadow p-6 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="border rounded px-3 py-2 flex-1"
          />
          <button onClick={addCategory} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add</button>
        </div>
        <ul>
          {categories.map(cat => (
            <li key={cat._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              {editing === cat._id ? (
                <>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="border rounded px-2 py-1 mr-2"
                  />
                  <button onClick={() => updateCategory(cat._id)} className="text-green-600 font-bold mr-2">Save</button>
                  <button onClick={() => { setEditing(null); setEditName(""); }} className="text-gray-500">Cancel</button>
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <div>
                    <button onClick={() => { setEditing(cat._id); setEditName(cat.name); }} className="text-blue-600 font-bold mr-2">Edit</button>
                    <button onClick={() => deleteCategory(cat._id)} className="text-red-600 font-bold">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 