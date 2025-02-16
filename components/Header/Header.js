"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Import icons

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const headerHeight = 90;

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false); // Close menu on selection (for mobile)

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
      router.push(`/`);
      setTimeout(scrollToSection, 500);
    }
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto max-w-6xl px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-500 via-green-700 to-green-500 
                         bg-clip-text text-transparent animate-gradient tracking-wide">
            TRENDHIVE
          </h1>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden block text-gray-700 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {["Home", "About", "Products"].map((section) => (
            <button
              key={section}
              onClick={(e) => handleNavigation(e, section)}
              className="text-gray-700 hover:text-green-500 text-lg font-medium tracking-wide 
                        transition-all duration-300"
            >
              {section}
            </button>
          ))}

          <button
            onClick={(e) => handleNavigation(e, "contact")}
            className="px-6 py-2 rounded-md border border-green-500 font-semibold 
                      bg-gradient-to-r from-green-500 via-green-600 to-green-500 
                      text-white hover:bg-gradient-to-l hover:scale-105 transform transition-all duration-300 
                      shadow-lg hover:shadow-green-500/50"
          >
            Contact
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute top-16 right-6 bg-white shadow-lg rounded-lg border border-gray-200 
                       flex flex-col items-start py-3 w-48 transition-all duration-300"
          >
            {["Home", "About", "Products"].map((section) => (
              <button
                key={section}
                onClick={(e) => handleNavigation(e, section)}
                className="w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500 transition-all duration-200"
              >
                {section}
              </button>
            ))}

            <button
              onClick={(e) => handleNavigation(e, "contact")}
              className="w-full px-5 py-3 text-left text-green-600 font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Contact
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
