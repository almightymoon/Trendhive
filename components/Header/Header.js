"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const headerHeight = 90; // Adjust if needed

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();

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
      <div className="container mx-auto max-w-6xl px-9 py-6 gap-2 flex justify-between items-center">
        {/* Animated Gradient Text Effect */}
        <Link href="/" className="cursor-pointer">
  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 via-green-950 to-green-500 
                 bg-clip-text text-transparent animate-gradient">
    TRENDHIVE
  </h1>
</Link>

        <nav className="flex space-x-6">
          {["Home", "About", "Products"].map((section) => (
            <button
              key={section}
              onClick={(e) => handleNavigation(e, section)}
              className="text-gray-700 hover:text-black border-none transition-all duration-300"
            >
              {section}
            </button>
          ))}
          {/* Beautiful Contact Button */}
          <button
            onClick={(e) => handleNavigation(e, "contact")}
            className="px-5 py-2 rounded border border-[#162415] font-semibold 
                      hover:bg-gradient-to-r from-green-500 via-green-600 to-green-500 animate-gradient hover:text-white hover:border-green-500 transition-all  duration-300"
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
