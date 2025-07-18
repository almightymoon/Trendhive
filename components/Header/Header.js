"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, UserCircle, LogOut, ShoppingCart } from "lucide-react";
import NotificationModal from "../Notification/Notification";
import { useCart } from "@/app/Contexts/CartContext";
import { useSession } from "@/app/Contexts/SessionContext";
import jwt_decode from "jwt-decode";
import "./HeaderMobileMenu.css";


const Header = ({ centerNav = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success"); // "success" | "error"
  const [modalMessage, setModalMessage] = useState("");
  
  const pathname = usePathname();
  const router = useRouter();
  const headerHeight = 90;
  const { cart } = useCart();
  const { token, checkTokenValidity } = useSession();

  // Get user info from token if available
  let userInfo = null;
  if (token && checkTokenValidity()) {
    try {
      userInfo = jwt_decode(token);
    } catch (e) {
      userInfo = null;
        }
      }

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        const offsetTop = section.offsetTop - headerHeight;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    };
    if (pathname === "/") {
      scrollToSection();
    } else {
      router.push("/");
      setTimeout(scrollToSection, 500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Optionally, you can call setToken(null) if you want to update context immediately
    // setToken(null);
    // ✅ Show Logout Success Notification
    setModalType("success");
    setModalMessage("You have been logged out successfully.");
    setModalOpen(true);
    // ✅ Redirect after 1.5 seconds
    setTimeout(() => {
      setModalOpen(false);
      router.push("/signin");
    }, 1500);
  };


  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <NotificationModal isOpen={modalOpen} setIsOpen={setModalOpen} type={modalType} message={modalMessage} />

      <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-500 via-green-700 to-green-500 bg-clip-text text-transparent animate-gradient tracking-wide">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
        </Link>
        <button className="md:hidden block text-gray-700 focus:outline-none" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu size={28} />
        </button>
        {/* Centered nav links (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex space-x-8 items-center">
            <button
              onClick={(e) => handleNavigation(e, 'Home')}
              className="text-gray-700 hover:text-green-500 text-lg font-medium tracking-wide transition-all duration-300"
            >
              Home
            </button>
            <button
              onClick={(e) => handleNavigation(e, 'About')}
              className="text-gray-700 hover:text-green-500 text-lg font-medium tracking-wide transition-all duration-300"
            >
              About
            </button>
            <Link href="/products" className="text-gray-700 hover:text-green-500 text-lg font-medium tracking-wide transition-all duration-300">
              Products
            </Link>
            <button
              onClick={(e) => handleNavigation(e, 'contact')}
              className="px-6 py-2 rounded-md border border-green-500 font-semibold bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white hover:bg-gradient-to-l hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-green-500/50"
            >
              Contact
            </button>
          </nav>
        </div>
        {/* Cart and profile/signin section (desktop only) */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <Link href="/cart" className="relative group ml-4 mr-2 focus:outline-none">
            <ShoppingCart size={28} className="text-gray-700 group-hover:text-green-600 transition" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center py-2 space-x-2 focus:outline-none ml-2">
                <UserCircle size={32} className="text-green-600 hover:text-green-800 transition" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border py-2 z-50">
                  <p className="px-4 py-2 text-gray-700 font-medium">{userInfo.name || userInfo.email}</p>
                  <Link href="/profile" className="w-full">
                    <button className="w-full text-left px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 transition-all duration-200">
                      <span>Profile</span>
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4 py-2 text-lg font-semibold text-gray-700 ml-2">
              <Link href="/signup" className="hover:text-green-500 transition-all duration-200">
                Sign Up
              </Link>
              <span className="h-5 w-px bg-gray-400"></span>
              <Link href="/signin" className="hover:text-green-500 transition-all duration-200">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu & Backdrop */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu backdrop"
          />
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 w-full max-w-xs h-full bg-white rounded-tr-3xl rounded-br-3xl shadow-2xl z-50 animate-slide-in flex flex-col p-6 border-r border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-green-700 tracking-wide">Menu</h2>
              <button className="text-gray-700 hover:text-red-500 focus:outline-none" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 flex-1">
              <button
                onClick={(e) => { handleNavigation(e, 'Home'); setMenuOpen(false); }}
                className="text-gray-800 hover:bg-green-50 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 text-left"
              >
                Home
              </button>
              <button
                onClick={(e) => { handleNavigation(e, 'About'); setMenuOpen(false); }}
                className="text-gray-800 hover:bg-green-50 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 text-left"
              >
                About
              </button>
              <Link href="/products" className="text-gray-800 hover:bg-green-50 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 text-left" onClick={() => setMenuOpen(false)}>
                Products
              </Link>
              <button
                onClick={(e) => { handleNavigation(e, 'contact'); setMenuOpen(false); }}
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 text-left shadow hover:scale-105"
              >
                Contact
              </button>
              <Link href="/cart" className="relative group flex items-center gap-2 text-gray-800 hover:bg-green-50 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200" onClick={() => setMenuOpen(false)}>
                <ShoppingCart size={26} className="text-green-600" />
                Cart
                {cart.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
              <div className="border-t border-gray-200 my-4" />
              {userInfo ? (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-700 mb-1">{userInfo.name || userInfo.email}</span>
                  <Link href="/profile" className="w-full" onClick={() => setMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-green-100 rounded transition-all duration-200">
                      <span>Profile</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                  >
                    <LogOut size={16} /> <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/signup" className="hover:text-green-500 transition-all duration-200 w-full text-left px-4 py-2" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                  <Link href="/signin" className="hover:text-green-500 transition-all duration-200 w-full text-left px-4 py-2" onClick={() => setMenuOpen(false)}>
                    Sign In
                  </Link>
                </div>
              )}
            </nav>
            <div className="mt-auto pt-8 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;