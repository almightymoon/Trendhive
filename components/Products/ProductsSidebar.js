import { useEffect, useState } from "react";
import { Tag, Store, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

function Modal({ open, onClose, title, options, selected, onSelect, searchPlaceholder }) {
  const [search, setSearch] = useState("");
  if (!open) return null;
  const filtered = options.filter(opt =>
    !search.trim() || opt.label.toLowerCase().includes(search.trim().toLowerCase())
  );
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fade-in  top-0 left-0 w-full h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-lg font-bold text-green-700">{title}</h2>
        <button
          className="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="px-4 py-2 sticky top-12 bg-white z-10">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full px-3 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700 bg-gray-50 text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-8 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2  ">
          <button
            className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl text-base font-semibold transition border shadow-sm ${selected == null ? "bg-green-100 text-green-700 border-green-200" : "hover:bg-gray-100 text-gray-700 border-gray-200"}`}
            onClick={() => { onSelect(null); onClose(); }}
          >
            <span className="text-green-700"><Tag size={22} /></span>
            All
          </button>
          {filtered.map(opt => (
            <button
              key={opt.value}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl text-base font-semibold transition border shadow-sm ${selected === opt.value ? "bg-green-500 text-white border-green-500" : "hover:bg-green-100 text-gray-700 border-gray-200"}`}
              onClick={() => { onSelect(opt.value); onClose(); }}
            >
              {opt.icon && <span className="text-green-700">{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  search,
  setSearch,
}) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catModal, setCatModal] = useState(false);
  const [brandModal, setBrandModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const catRes = await fetch("/api/admin/categories");
      const catData = await catRes.json();
      setCategories(catData);
      const prodRes = await fetch("/api/admin/products");
      const prodData = await prodRes.json();
      const uniqueBrands = Array.from(new Set(prodData.map(p => p.brand).filter(Boolean)));
      setBrands(uniqueBrands);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Prepare options for modals
  const categoryOptions = categories.map(cat => ({ value: cat.name, label: cat.name, icon: <Tag size={18} /> }));
  const brandOptions = brands.map(brand => ({ value: brand, label: brand, icon: <Store size={18} /> }));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-white rounded-xl shadow p-3 sticky top-28 flex-col gap-4 border border-gray-100 w-56 min-w-[12rem] max-w-[14rem] hidden md:flex">
        <div>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-2 py-1.5 rounded border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700 bg-gray-50 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-700 mb-1">Categories</h3>
          <ul className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
            <li>
              <button
                className={`w-full text-left px-2 py-1.5 rounded transition font-medium text-sm ${!selectedCategory ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-700"}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat._id}>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded transition font-medium text-sm ${selectedCategory === cat.name ? "bg-green-500 text-white" : "hover:bg-green-100 text-gray-700"}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-700 mb-1">Brands</h3>
          <ul className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
            <li>
              <button
                className={`w-full text-left px-2 py-1.5 rounded transition font-medium text-sm ${!selectedBrand ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-700"}`}
                onClick={() => setSelectedBrand(null)}
              >
                All Brands
              </button>
            </li>
            {brands.map(brand => (
              <li key={brand}>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded transition font-medium text-sm ${selectedBrand === brand ? "bg-green-500 text-white" : "hover:bg-green-100 text-gray-700"}`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Clear Filters Button (desktop only) */}
        <button
          className="mt-4 w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm md:block hidden"
          onClick={() => { setSelectedCategory(null); setSelectedBrand(null); }}
        >
          Clear Filters
        </button>
        {loading && <div className="text-center text-gray-400 text-xs">Loading...</div>}
      </aside>

      {/* Mobile Temu-style Filter Bar (fixed) with back and clear buttons */}
      <div className="md:hidden fixed top-16 pt-4  left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center gap-2 px-2 py-2 overflow-x-auto no-scrollbar shadow-sm">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-sm border transition whitespace-nowrap relative ${selectedCategory ? "bg-green-500 text-white border-green-500" : "bg-green-100 text-green-700 border-green-200"}`}
          onClick={() => setCatModal(true)}
        >
          <Tag size={18} className="inline-block" />
          {selectedCategory || "Categories"}
          {selectedCategory && (
            <span
              className="absolute -top-2 -right-2 bg-white border border-green-500 rounded-full p-0.5 shadow cursor-pointer"
              onClick={e => { e.stopPropagation(); setSelectedCategory(null); }}
              aria-label="Clear category"
            >
              <X size={14} className="text-green-500" />
            </span>
          )}
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-sm border transition whitespace-nowrap relative ${selectedBrand ? "bg-green-500 text-white border-green-500" : "bg-green-100 text-green-700 border-green-200"}`}
          onClick={() => setBrandModal(true)}
        >
          <Store size={18} className="inline-block" />
          {selectedBrand || "Brands"}
          {selectedBrand && (
            <span
              className="absolute -top-2 -right-2 bg-white border border-green-500 rounded-full p-0.5 shadow cursor-pointer"
              onClick={e => { e.stopPropagation(); setSelectedBrand(null); }}
              aria-label="Clear brand"
            >
              <X size={14} className="text-green-500" />
            </span>
          )}
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 min-w-[120px] px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700 bg-gray-50 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Mobile Modals */}
      <Modal
        open={catModal}
        onClose={() => setCatModal(false)}
        title="Categories"
        options={categoryOptions}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        searchPlaceholder="Search categories..."
      />
      <Modal
        open={brandModal}
        onClose={() => setBrandModal(false)}
        title="Brands"
        options={brandOptions}
        selected={selectedBrand}
        onSelect={setSelectedBrand}
        searchPlaceholder="Search brands..."
      />
      {loading && <div className="text-center text-gray-400 text-xs md:hidden">Loading...</div>}
    </>
  );
} 