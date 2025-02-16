"use client";

import Product from "@/components/Products/Products";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const Products = () => {
    return (
        <> 
            <Header />
            <main className="pt-20"> {/* Added padding to prevent content from hiding behind the header */}
                <Product />
            </main>
            <Footer />
        </>
    );
};

export default Products;
