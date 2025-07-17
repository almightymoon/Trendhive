"use client";

import Product from "@/components/Products/Products";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const Products = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
            <Header />
            <div className="pt-20 flex-1">
                <Product />
            </div>
            <Footer />
        </div>
    );
};

export default Products;
