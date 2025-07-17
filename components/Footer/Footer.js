"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#162415] text-white py-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:flex md:justify-between">
        {/* Brand & Description */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</h2>
          <p className="mt-2 text-gray-400">Your one-stop shop for trending & unique products.</p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-4">
          <a href="/" className="text-gray-400 hover:text-white transition">Home</a>
          <a href="/about" className="text-gray-400 hover:text-white transition">About</a>
          <a href="/products" className="text-gray-400 hover:text-white transition">Products</a>
          <a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-6 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <span>Crafted by </span>
        <span className="text-lg font-signature text-white tracking-wide">Athar Iqbal</span>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TRENDHIVE. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
