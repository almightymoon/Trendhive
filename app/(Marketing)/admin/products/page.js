"use client";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Tag, Plus, Edit, Trash2, Search, Star } from "lucide-react";

export default function AdminProductsPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    name: "",
    price: "",
    shortDescription: "",
    description: "",
    category: "",
    mainImage: "",
    images: [],
    brand: "",
  });
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [carouselUploading, setCarouselUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const mainImageInput = useRef();
  const carouselInput = useRef();
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [dropdown, setDropdown] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }
  async function fetchProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  }

  // Category logic (existing)
  async function addCategory() {
    if (!newCategory.trim()) return;
    setCategoryLoading(true);
    setCategoryError("");
    try {
      const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, description: newCategoryDescription })
    });
      const data = await res.json();
      if (!res.ok) {
        setCategoryError(data.error || "Failed to add category");
        setCategoryLoading(false);
        return;
      }
    setNewCategory("");
      setNewCategoryDescription("");
    fetchCategories();
    } catch (err) {
      setCategoryError("Network error");
    }
    setCategoryLoading(false);
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

  // Product form logic
  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  async function handleMainImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setForm(f => ({ ...f, mainImage: data.url }));
    setMainImageUploading(false);
  }
  async function handleCarouselUpload(e) {
    const files = Array.from(e.target.files);
    setCarouselUploading(true);
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      urls.push(data.url);
    }
    setForm(f => ({ ...f, images: [...f.images, ...urls].slice(0, 4) }));
    setCarouselUploading(false);
  }
  function removeCarouselImage(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }
  function startEditProduct(prod) {
    setEditingProduct(prod._id);
    setForm({
      productId: prod.productId || "",
      name: prod.name || "",
      price: prod.price || "",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      category: prod.category || "",
      mainImage: prod.mainImage || "",
      images: prod.images || [],
      brand: prod.brand || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function handleProductSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.price || !form.category || !form.mainImage || !form.brand) {
      setFormError("Please fill all required fields, including Brand, and upload images.");
      return;
    }
    // Product ID logic: auto-generate if blank, check uniqueness if manual
    let productId = form.productId.trim();
    if (!productId) {
      // Auto-generate: use name + timestamp
      productId = (form.name.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now()).slice(0, 32);
    } else {
      // Manual: check uniqueness
      const exists = products.some(p => p.productId === productId && (!editingProduct || p._id !== editingProduct));
      if (exists) {
        setFormError("Product ID is already used by another product. Please choose a unique ID or leave blank for auto.");
        return;
      }
    }
    if (editingProduct) {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: editingProduct, ...form, productId, price: Number(form.price) }),
      });
      setEditingProduct(null);
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId, price: Number(form.price) }),
      });
    }
    setForm({ productId: "", name: "", price: "", shortDescription: "", description: "", category: "", mainImage: "", images: [], brand: "" });
    fetchProducts();
  }
  function cancelEdit() {
    setEditingProduct(null);
    setForm({ productId: "", name: "", price: "", shortDescription: "", description: "", category: "", mainImage: "", images: [], brand: "" });
  }
  async function deleteProduct(_id) {
    if (!window.confirm("Delete this product?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    fetchProducts();
  }

  // Filtered products for search
  const filteredProducts = products.filter(prod =>
    prod.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    prod.category?.toLowerCase().includes(productSearch.toLowerCase())
  );
  // Filtered categories for search
  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Count of featured products
  const featuredCount = products.filter(p => p.featured).length;

  async function toggleFeatureProduct(prod) {
    const newFeatured = !prod.featured;
    if (newFeatured && featuredCount >= 3) {
      alert("You can only feature up to 3 products.");
      return;
    }
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: prod._id, featured: newFeatured }),
    });
    fetchProducts();
  }

  // Collect unique brands for suggestions
  const brandSuggestions = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Products Table (Left) */}
      <div className="flex-1 bg-white rounded shadow p-6 mb-8 md:mb-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
        </div>
        {/* Product Form */}
        <form onSubmit={handleProductSubmit} className="backdrop-blur bg-white/80 border border-gray-200 rounded-2xl p-8 mb-10 shadow-xl flex flex-col gap-6 transition-all">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Product Name *</label>
              <input name="name" value={form.name} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Product ID</label>
              <input name="productId" value={form.productId} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" placeholder="Auto or manual" />
              <span className="text-xs text-gray-400">Leave blank for auto. Must be unique.</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleFormChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                list="brand-suggestions"
                placeholder="Type or select a brand"
              />
              <datalist id="brand-suggestions">
                {brandSuggestions.map((b, i) => (
                  <option key={i} value={b} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Price *</label>
              <input name="price" type="number" value={form.price} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" required min={0} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Short Description</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Category *</label>
              <select name="category" value={form.category} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" required>
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Main Image *</label>
              <input type="file" accept="image/*" ref={mainImageInput} onChange={handleMainImageUpload} className="mb-2" />
              {mainImageUploading && <div className="text-xs text-gray-500 animate-pulse">Uploading...</div>}
              {form.mainImage && <img src={form.mainImage} alt="Main" className="w-32 h-32 object-cover rounded-xl border shadow" />}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Carousel Images (up to 4)</label>
              <input type="file" accept="image/*" multiple ref={carouselInput} onChange={handleCarouselUpload} className="mb-2" />
              {carouselUploading && <div className="text-xs text-gray-500 animate-pulse">Uploading...</div>}
              <div className="flex gap-2 flex-wrap">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="Carousel" className="w-20 h-20 object-cover rounded-xl border shadow" />
                    <button type="button" onClick={() => removeCarouselImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 shadow">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {formError && <div className="text-red-600 font-semibold text-sm">{formError}</div>}
          <div className="flex gap-2 self-end">
            {editingProduct && (
              <button type="button" onClick={cancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200">Cancel</button>
            )}
            <button type="submit" className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-200 w-full md:w-40">
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
        {/* Product Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              placeholder="Search products..."
              className="border rounded-lg px-4 py-2 w-full pl-10 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="align-top h-full">
              {filteredProducts.map((prod, idx) => (
                <tr
                  key={prod._id}
                  className={`${idx !== filteredProducts.length - 1 ? "border-b border-gray-200" : ""} hover:bg-green-50 transition`}
                >
                  <td className="py-3 px-4">
                    {prod.mainImage && <img src={prod.mainImage} alt={prod.name} className="w-16 h-16 object-cover rounded" />}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className={`p-2 rounded-full ${prod.featured ? "bg-yellow-100" : "hover:bg-gray-100"}`}
                      title={prod.featured ? "Unfeature" : featuredCount >= 3 ? "Max 3 featured" : "Feature"}
                      onClick={e => { e.stopPropagation(); toggleFeatureProduct(prod); }}
                      disabled={!prod.featured && featuredCount >= 3}
                    >
                      <Star size={20} className={prod.featured ? "text-yellow-500 fill-yellow-400" : "text-gray-400"} fill={prod.featured ? "#facc15" : "none"} />
                    </button>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{prod.name}</td>
                  <td className="py-3 px-4 text-gray-700">${prod.price?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{prod.brand || '-'}</td>
                  <td className="py-3 px-4 text-gray-700">{prod.category}</td>
                  <td className="py-3 px-4 relative">
                    <button className="p-2 rounded-full hover:bg-green-100 text-green-700" onClick={e => { e.stopPropagation(); setDropdown(dropdown === prod._id ? null : prod._id); }}>
                      <MoreVertical size={18} />
                    </button>
                    {dropdown === prod._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => { setDropdown(null); setPreviewProduct(prod); }}>Preview</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600" onClick={() => { setDropdown(null); startEditProduct(prod); }}>Edit</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600" onClick={() => { setDropdown(null); deleteProduct(prod._id); }}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Product Preview Modal */}
        {previewProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
              <button onClick={() => setPreviewProduct(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl">&times;</button>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col items-center">
                  {previewProduct.mainImage && (
                    <img src={previewProduct.mainImage} alt="Main" className="w-48 h-48 object-cover rounded border mb-4" />
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {previewProduct.images?.map((img, idx) => (
                      <img key={idx} src={img} alt="Carousel" className="w-16 h-16 object-cover rounded border" />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{previewProduct.name}</h2>
                  <div className="mb-2 text-lg text-green-700 font-semibold">${previewProduct.price?.toLocaleString()}</div>
                  <div className="mb-2 text-gray-700"><span className="font-semibold">Category:</span> {previewProduct.category}</div>
                  <div className="mb-2 text-gray-700"><span className="font-semibold">Short Description:</span> {previewProduct.shortDescription}</div>
                  <div className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> {previewProduct.description}</div>
                  <div className="mb-2 text-gray-500 text-xs">Product ID: {previewProduct.productId}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Categories Sidebar (Right) */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-8 self-start">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2"><Tag size={20} className="text-green-600" /> Categories</h2>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Add new category..."
              className="border rounded-lg px-4 py-2 w-full pl-10 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              disabled={categoryLoading}
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="mb-2">
          <input
            value={newCategoryDescription}
            onChange={e => setNewCategoryDescription(e.target.value)}
            placeholder="Description (optional)"
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            disabled={categoryLoading}
          />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={addCategory}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-xl shadow font-bold flex items-center gap-2 disabled:opacity-50"
            disabled={!newCategory.trim() || categoryLoading}
          >
            {categoryLoading ? "Adding..." : (<><Plus size={18} /> Add</>)}
          </button>
        </div>
        {categoryError && <div className="text-red-600 text-sm font-semibold mb-2">{categoryError}</div>}
        <ul className="divide-y divide-gray-100">
          {filteredCategories.map(cat => (
            <li key={cat._id} className="flex flex-col py-2">
              <div className="flex items-center justify-between">
              {editing === cat._id ? (
                <>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="border rounded-lg px-2 py-1 mr-2"
                  />
                  <button onClick={() => updateCategory(cat._id)} className="text-green-600 font-bold mr-2"><Edit size={16} /></button>
                  <button onClick={() => { setEditing(null); setEditName(""); }} className="text-gray-500"><Trash2 size={16} /></button>
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-800 flex items-center gap-2"><Tag size={16} className="text-green-400" /> {cat.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(cat._id); setEditName(cat.name); }} className="text-blue-600 font-bold"><Edit size={16} /></button>
                    <button onClick={() => deleteCategory(cat._id)} className="text-red-600 font-bold"><Trash2 size={16} /></button>
                  </div>
                </>
              )}
              </div>
              {cat.description && <div className="text-gray-500 text-xs mt-1 ml-6">{cat.description}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 