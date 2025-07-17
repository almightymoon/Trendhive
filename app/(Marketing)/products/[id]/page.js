"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useState } from "react";
import { useCart } from "@/app/Contexts/CartContext";

const featuredProducts = [
    {
        id: "eco-friendly-tote-bag",
        title: "Eco-Friendly Tote Bag",
        description: "Chic and sustainable tote for everyday use.",
        images: ["/tote-bag.jpeg", "/fitness-tracker.jpeg", "/headphones.jpeg", "/laptop.jpeg"],
        price: 2500,
        details: "Make a sustainable fashion statement with our Eco-Friendly Tote Bag. Crafted from 100% organic cotton, this stylish and spacious tote is perfect for shopping, beach days, or everyday errands. Its durable fabric ensures longevity, while the eye-catching design adds a touch of flair to any outfit. The comfortable straps make it easy to carry, and its lightweight nature means you can fold it up and take it anywhere. Say goodbye to plastic bags and embrace an eco-conscious lifestyle with this chic accessory that’s both functional and fashionable.",
        creator: "TrendHive",
        category: "bag",
        download: true,
        year: 2024
    },
    {
        id: "wireless-noise-cancelling-headphones",
        title: "Wireless Noise-Cancelling Headphones",
        description: "Experience premium sound with noise cancellation.",
        images: ["/headphones.jpeg", "/tote-bag.jpeg", "/fitness-tracker.jpeg", "/laptop.jpeg"],
        price: 12000,
        details: "Immerse yourself in crystal-clear sound with our Wireless Noise-Cancelling Headphones. Designed for audiophiles and casual listeners alike, these headphones use advanced noise-cancellation technology to block out distractions, letting you focus on your music or podcasts. With a comfortable fit and long-lasting battery life, you can enjoy hours of uninterrupted listening. The sleek design complements any style, and the built-in microphone makes it easy to take calls on the go. Elevate your audio experience and escape into a world of sound with these premium headphones that redefine convenience and quality.",
        creator: "TrendHive",
        category: "electronics",
        download: false,
        year: 2024
    },
    {
        id: "smart-fitness-tracker",
        title: "Smart Fitness Tracker",
        description: "Track your health with style and precision.",
        images: ["/fitness-tracker.jpeg", "/tote-bag.jpeg", "/headphones.jpeg", "/laptop.jpeg"],
        price: 8000,
        details: "Stay on top of your health with our Smart Fitness Tracker. This sleek device monitors your heart rate, steps, and sleep patterns, providing you with valuable insights into your daily activity levels. Sync it with your smartphone to track progress and set fitness goals. The user-friendly interface and customizable watch faces make it easy to personalize, while the waterproof design allows for worry-free workouts. With notifications for calls and messages, this tracker keeps you connected without the need to check your phone constantly. Embrace a healthier lifestyle and transform your fitness journey with this essential gadget.",
        creator: "TrendHive",
        category: "wearable",
        download: false,
        year: 2024
    },
];

export default function ProductPage() {
    const { id } = useParams();
    const product = featuredProducts.find((p) => p.id === id);
    const { addToCart } = useCart();
    const [mainImage, setMainImage] = useState(product?.images[0]);

    if (!product) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
                <Link href="/products" className="text-blue-500 underline mt-4 inline-block">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto py-16 px-4 flex flex-col md:flex-row gap-12 pt-32">
                {/* Gallery */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mb-4 transition-transform duration-200 hover:scale-105">
                        <Image
                            src={mainImage}
                            alt={product.title}
                            width={600}
                            height={480}
                            className="w-full h-[26rem] object-cover"
                        />
                    </div>
                    <div className="flex gap-3 mt-3">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`border-2 rounded-lg w-20 h-20 overflow-hidden transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 ${mainImage === img ? 'border-green-600 ring-2 ring-green-400' : 'border-gray-200 hover:border-green-400'}`}
                                aria-label={`Show image ${idx + 1}`}
                            >
                                <Image src={img} alt={product.title} width={80} height={80} className="object-cover w-full h-full" />
                            </button>
                        ))}
                    </div>
                    <p className="text-xl text-gray-700 mt-8 text-center w-full max-w-lg font-medium">{product.description}</p>
                    <p className="text-gray-600 mt-4 text-center w-full max-w-lg leading-relaxed">{product.details}</p>
                </div>
                {/* Info & Purchase */}
                <div className="md:w-1/2 flex flex-col gap-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{product.title}</h1>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-bold text-green-600">${product.price.toLocaleString()}</span>
                            <span className="text-base font-medium text-gray-500">Tax included.</span>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">In Stock</span>
                        </div>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            Add To Cart
                        </button>
                        <Link href="/cart">
                            <button className="w-full py-3 bg-white border border-gray-400 text-black rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400">
                                Checkout
                            </button>
                        </Link>
                        <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M20.5 7.5h-17a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1Zm-17-2A3 3 0 0 0 .5 8.5v7a3 3 0 0 0 3 3h17a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-17Z"/><path fill="#fff" d="M7.5 12.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
                            Pay with Stripe
                        </button>
                        <button className="w-full py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 transition text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#003087" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"/><path fill="#fff" d="M16.5 13.5h-9v-3h9v3Z"/></svg>
                            PayPal
                        </button>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1 border border-gray-200">
                        {product.download && <p className="font-semibold text-green-700">Digital Download</p>}
                        <p><span className="font-semibold">Created By:</span> {product.creator}</p>
                        <p><span className="font-semibold">Year:</span> {product.year}</p>
                        <p><span className="font-semibold">Pack Category:</span> {product.category}</p>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                        Project Management, Delivery and Consultancy<br />
                        For more information, contact us at <a href="mailto:info@trendhive.com" className="text-green-600 underline">info@trendhive.com</a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
