"use client";

import Product from "@/components/Products/Products";
import ProductsSidebar from "@/components/Products/ProductsSidebar";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useState } from "react";

const Products = () => {
    // Sidebar filter state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
            <Header />
            <div className="pt-20 flex-1 flex flex-row max-w-7xl mx-auto w-full">
                {/* Sidebar (desktop only) */}
                <div className="w-72 hidden md:block mr-6">
                    <ProductsSidebar
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
                {/* Main Product Grid with mobile filter bar above */}
                <div className="flex-1 w-full">
                    {/* Mobile filter bar and modals */}
                    <div className="block md:hidden">
                        <ProductsSidebar
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedBrand={selectedBrand}
                            setSelectedBrand={setSelectedBrand}
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>
                    <Product
                        showHero={false}
                        filterCategory={selectedCategory}
                        filterBrand={selectedBrand}
                        filterSearch={search}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Products;
