"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, UserCircle, Package, ShoppingBag, Users, List } from "lucide-react";
import Header from "@/components/Header/Header";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <Package size={20} /> },
  { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
  { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  return (
    <ProtectedRoute adminOnly={true}>
    <div className="min-h-screen  flex bg-gray-100" >
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex-shrink-0 hidden md:flex flex-col relative z-10">
        <div className="h-20 flex items-center justify-center border-b border-green-700">
          <span className="text-2xl font-extrabold tracking-wide">Admin</span>
        </div>
        <nav className="flex-1 py-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-8 py-3 my-1 rounded-l-full text-lg font-medium transition-all duration-200 relative ${pathname.startsWith(item.href)
                ? "bg-white text-green-700 shadow-lg"
                : "hover:bg-green-700/40 text-white"}`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex justify-center gap-4 pb-6 mt-auto">
          <a href="#" className="text-white hover:text-green-200 text-sm">Facebook</a>
          <a href="#" className="text-white hover:text-green-200 text-sm">Twitter</a>
          <a href="#" className="text-white hover:text-green-200 text-sm">Google</a>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-end bg-white shadow px-6 h-16">
          <button className="mx-2 text-gray-500 hover:text-green-600"><Bell size={22} /></button>
          <button className="mx-2 text-gray-500 hover:text-green-600"><Search size={22} /></button>
          <button className="mx-2 text-gray-500 hover:text-green-600"><UserCircle size={28} /></button>
        </div>
        <main className="flex-1 p-6 md:p-10 bg-gray-100">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
} 