"use client";

import Link from "next/link";
import { Home, UserCircle, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "./SidebarMobileMenu.css";
import { usePathname } from "next/navigation";

const NotificationModal = dynamic(() => import("../Notification/Notification"), { ssr: false });

function SidebarLink({ href, icon, label, isCollapsed }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-8 py-3 my-1 rounded-l-full text-lg font-medium transition-all duration-200 relative
        ${isCollapsed ? "justify-center" : ""}
        ${isActive ? "bg-white text-[#34a853] font-bold shadow" : "hover:bg-green-700/40 text-white"}
      `}
      style={isActive ? { boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" } : {}}
    >
      {icon}
      {!isCollapsed && label}
    </Link>
  );
}

const Sidebar = ({ onCollapse }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Notify parent when collapsed state changes
    useEffect(() => {
      if (onCollapse) onCollapse(isCollapsed);
    }, [isCollapsed, onCollapse]);

    // 🔥 Notification Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("success"); // "success" | "error"
    const [modalMessage, setModalMessage] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);

        // ✅ Show Logout Success Notification
        setModalType("success");
        setModalMessage("You have been logged out successfully.");
        setModalOpen(true);

        // ✅ Redirect after 1.5 seconds
        setTimeout(() => {
            setModalOpen(false);
            router.push("/");
        }, 1500);
    };

    return (
        <>
        {/* Stylish Hamburger for mobile */}
        <button
          className="md:hidden fixed top-5 left-5 z-[101] bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full shadow-lg p-3 border-2 border-white hover:scale-110 transition-transform duration-200 focus:outline-none"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={28} />
        </button>
        {/* Mobile Sidebar & Backdrop */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 animate-fade-in"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar backdrop"
            />
            <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[101] flex flex-col p-6 animate-slide-in rounded-tr-3xl rounded-br-3xl border-r-2 border-green-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-green-700 tracking-wide">Admin</h2>
                <button className="text-gray-700 hover:text-red-500 bg-gray-100 rounded-full p-2 shadow focus:outline-none transition-colors duration-200" aria-label="Close sidebar" onClick={() => setMobileOpen(false)}>
                  <X size={28} />
                </button>
              </div>
              <nav className="space-y-4 flex-1">
                <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 font-semibold text-gray-800 transition" onClick={() => setMobileOpen(false)}>
                  <Home size={20} /> Dashboard
                </Link>
                <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 font-semibold text-gray-800 transition" onClick={() => setMobileOpen(false)}>
                  <Settings size={20} /> Products
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 font-semibold text-gray-800 transition" onClick={() => setMobileOpen(false)}>
                  <Settings size={20} /> Orders
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 font-semibold text-gray-800 transition" onClick={() => setMobileOpen(false)}>
                  <UserCircle size={20} /> Users
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition"
                >
                  <LogOut size={20} /> Logout
                </button>
              </nav>
            </div>
          </>
        )}
        {/* Desktop Sidebar */}
        <div className={`hidden md:fixed md:top-0 md:left-0 md:block transition-width duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"} min-h-screen p-0 z-30 bg-[#34a853] text-white rounded-bl-lg`}>
            {/* 🔥 Notification Modal */}
            <NotificationModal isOpen={modalOpen} setIsOpen={setModalOpen} type={modalType} message={modalMessage} />

            {/* Collapse/Expand Button (Desktop only) */}
            <div className="flex items-center justify-between px-4 h-20 border-b border-green-700 bg-green-600">
  {/* Toggle Button */}
  <button
    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-green-700 hover:bg-green-800 text-white transition-colors duration-200"
    onClick={() => setIsCollapsed(!isCollapsed)}
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
  </button>

  {/* Logo */}
  {!isCollapsed && (
    <h1 className="text-2xl font-extrabold text-white tracking-wide mx-auto">
      Admin
    </h1>
  )}

  {/* Empty div to balance the layout (same width as button) */}
  <div className="w-10 h-10 hidden md:block" />
</div>

            <nav className="flex flex-col gap-2 mt-6">
                <SidebarLink href="/admin/dashboard" icon={<Home size={22} />} label="Dashboard" isCollapsed={isCollapsed} />
                <SidebarLink href="/admin/products" icon={<Settings size={22} />} label="Products" isCollapsed={isCollapsed} />
                <SidebarLink href="/admin/orders" icon={<Settings size={22} />} label="Orders" isCollapsed={isCollapsed} />
                <SidebarLink href="/admin/users" icon={<UserCircle size={22} />} label="Users" isCollapsed={isCollapsed} />
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-8 py-3 my-1 rounded-l-full text-lg font-medium transition-all duration-200 relative hover:bg-green-700/40 text-white ${isCollapsed ? "justify-center" : ""}`}
                >
                    <LogOut size={22} />
                    {!isCollapsed && "Logout"}
                </button>
            </nav>
        </div>
        </>
    );
};

export default Sidebar;