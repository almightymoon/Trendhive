"use client";
import Link from "next/link";
import { UserCircle, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const links = [
  { href: "/profile", label: "Profile", icon: <UserCircle size={22} /> },
  { href: "/orders", label: "My Orders", icon: <ShoppingBag size={22} /> },
];

export default function UserSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <>
      {/* Mobile Hamburger */}
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
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-[101] flex flex-col p-6 animate-slide-in rounded-tr-3xl rounded-br-3xl border-r-2 border-green-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-green-700 tracking-wide">Account</h2>
              <button className="text-gray-700 hover:text-red-500 bg-gray-100 rounded-full p-2 shadow focus:outline-none transition-colors duration-200" aria-label="Close sidebar" onClick={() => setMobileOpen(false)}>
                <X size={28} />
              </button>
            </div>
            <nav className="space-y-4 flex-1">
              {links.map(link => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 font-semibold text-gray-800 transition" onClick={() => setMobileOpen(false)}>
                  {link.icon} {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition"
              >
                <LogOut size={20} /> Logout
              </button>
            </nav>
          </div>
        </>
      )}
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:top-0 md:left-0 md:block w-64 min-h-screen p-0 z-30 bg-[#34a853] text-white rounded-bl-lg">
        <div className="flex items-center justify-center h-20 border-b border-green-700 bg-green-600">
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Account</h1>
        </div>
        <nav className="flex flex-col gap-2 mt-6">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 px-8 py-3 my-1 rounded-l-full text-lg font-medium transition-all duration-200 relative hover:bg-green-700/40 text-white">
              {link.icon} {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-8 py-3 my-1 rounded-l-full text-lg font-medium transition-all duration-200 relative hover:bg-green-700/40 text-white"
          >
            <LogOut size={22} /> Logout
          </button>
        </nav>
      </div>
    </>
  );
} 