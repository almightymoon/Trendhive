"use client";
import { Bell, Search, UserCircle, Package, ShoppingBag, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <Package size={20} /> },
  { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
  { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
];

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar onCollapse={setSidebarCollapsed} />
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-end bg-white shadow px-4 md:px-6 h-16 sticky top-0 z-20">
            <button className="mx-2 text-gray-500 hover:text-green-600"><Bell size={22} /></button>
            <button className="mx-2 text-gray-500 hover:text-green-600"><Search size={22} /></button>
            <button className="mx-2 text-gray-500 hover:text-green-600"><UserCircle size={28} /></button>
          </div>
          <main className="flex-1 p-4 md:p-10 bg-gray-100">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 