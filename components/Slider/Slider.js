"use client"
import Link from "next/link";

const Slider = () => {
    return (
        <section id="Home"
            className="relative bg-cover bg-center h-[80vh] flex items-center justify-center px-6 md:px-10 lg:px-20"
            style={{ backgroundImage: "url('/slider.jpeg')", backgroundSize: "cover", backgroundPosition: "center",backgroundAttachment:"fixed" }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Content Wrapper */}
            <div className="relative max-w-6xl w-full mx-auto text-left">
                <h2 className="text-5xl font-extrabold text-white leading-tight">
                    Explore your needs
                </h2>
                <p className="text-lg text-gray-300 mt-4">
                    Find the best products here
                </p>
                <Link
                    href="/products"
                    className="mt-6 inline-block px-8 py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-gradient-to-r from-green-500 via-green-600 to-green-500 animate-gradient transition-all duration-300"
                >
                    VIEW PRODUCTS
                </Link>
            </div>
        </section>
    );
};

export default Slider;
