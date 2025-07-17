"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, UserCircle, LogOut, ShoppingCart } from "lucide-react";
import NotificationModal from "../Notification/Notification";
import { useCart } from "@/app/Contexts/CartContext";


const Header = ({ centerNav = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success"); // "success" | "error"
  const [modalMessage, setModalMessage] = useState("");
  
  const pathname = usePathname();
  const router = useRouter();
  const headerHeight = 90;
  const { cart } = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/header", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

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
    <header className="fixed w-full bg-white shadow-md z-50">
      <NotificationModal isOpen={modalOpen} setIsOpen={setModalOpen} type={modalType} message={modalMessage} />

      <div className={`container mx-auto max-w-6xl px-6 py-4 flex items-center ${centerNav ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className="cursor-pointer">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-500 via-green-700 to-green-500 bg-clip-text text-transparent animate-gradient tracking-wide">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
        </Link>

        <button className="md:hidden block text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className="hidden md:flex space-x-8 items-center">
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

          {/* Cart icon before profile/signin */}
          <Link href="/cart" className="relative group ml-4 mr-2 focus:outline-none">
            <ShoppingCart size={28} className="text-gray-700 group-hover:text-green-600 transition" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* Profile icon or sign in/up links */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center py-2 space-x-2 focus:outline-none ml-2">
                <UserCircle size={32} className="text-green-600 hover:text-green-800 transition" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border py-2 z-50">
                  <p className="px-4 py-2 text-gray-700 font-medium">{user.name}</p>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;