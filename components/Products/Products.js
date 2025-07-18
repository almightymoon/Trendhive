"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Product = ({ featuredOnly = false, showHero = true, filterCategory, filterBrand, filterTrending, filterSearch }) => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const url = featuredOnly ? "/api/admin/products?featured=true" : "/api/admin/products";
        fetch(url)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [featuredOnly]);
    
    // Filtering logic
    let filteredProducts = products;
    if (filterCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    }
    if (filterBrand) {
        filteredProducts = filteredProducts.filter(p => p.brand === filterBrand);
    }
    if (filterTrending) {
        filteredProducts = filteredProducts.filter(p => p.featured === true);
    }
    if (filterSearch && filterSearch.trim()) {
        const searchLower = filterSearch.trim().toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.shortDescription?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower)
        );
    }
    
    if (showHero) {
        // Show hero section with up to 3 featured products
        const featuredProducts = filteredProducts.filter(p => p.featured).slice(0, 3);
        return (
            <div id="Products" className="relative w-full">
                {/* HERO SECTION */}
                <section className="w-full bg-gray-100 pt-20 pb-10">
                    <div className="max-w-6xl mx-auto text-left px-6">
                        <p className="text-green-600 font-semibold uppercase tracking-wide">
                            Explore The Trends
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-2">
                            Discover unique items for every lifestyle
                        </h1>
                    </div>
                    {/* PRODUCT GRID */}
                    <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProducts.length === 0 ? (
                            <div className="col-span-3 text-center text-gray-500 py-20 text-xl">No featured products yet.</div>
                        ) : featuredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
                            >
                                <Link href={`/products/${product._id}`} className="block">
                                    <div className="overflow-hidden">
                                        <img
                                            src={product.mainImage}
                                            alt={product.name}
                                            width={400}
                                            height={300}
                                            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3
                                            className="text-lg font-bold text-gray-600 transition-all duration-300 \
                                                group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:via-green-900 group-hover:to-green-500 \
                                                group-hover:bg-clip-text group-hover:text-transparent group-hover:animate-gradient"
                                        >
                                            {product.name}
                                        </h3>
                                        <div className="text-green-700 font-semibold text-lg mt-1">${product.price?.toLocaleString()}</div>
                                        <p className="text-gray-600 mt-2 ">{product.shortDescription || product.description}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </section>
                </section>
            </div>
        );
    } else {
        // Show all products in a grid
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500 py-20 text-xl">No products found.</div>
                ) : filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
                    >
                        <Link href={`/products/${product._id}`} className="block">
                            <div className="overflow-hidden">
                                <img
                                    src={product.mainImage}
                                    alt={product.name}
                                    width={400}
                                    height={300}
                                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-600">{product.name}</h3>
                                <div className="text-green-700 font-semibold text-lg mt-1">${product.price?.toLocaleString()}</div>
                                <p className="text-gray-600 mt-2 ">{product.shortDescription || product.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        );
    }
};

export default Product;
